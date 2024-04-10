import PDFParser, { Output } from "pdf2json";
import { File } from "../../../types/requests";
import { openai, DEFAULT_MODEL, OPENAI_MODELS } from "../../../utils/openai";
import { Router, Request, Response } from "express";
import moment from "moment";
import mammoth from "mammoth";
import MarkdownIt from "markdown-it";
import { bucket, db } from "../../../utils/firebase";
import { Resume } from "../../../types/resume";
import fs from "fs";
import { captureException } from "../../../utils/sentry";
const ov = `You are a helpful AI assistant expert at extracting details from resume, Extract the following details from the resume and return it in JSON format. Use british english for spellings.
*************
{{resumeText}}
*************
NOTE: EXTRACT THE INFORMATION AS IS, DO NOT MODIFY IT.  MAKE SURE TO EXTRACT ALL DETAILS MENTIONED IN WORK EXPERIENCE SECTION, DONT CHANGE THE CONTENT JUST EXACTLY COPY IT.
Format of each section should be as follows, follow exactly the same format: Any endDate which is not present should be set to null. 
{
    "personalInfo": {
        "firstName": "",
        "lastName": "",
        "email": "", 
        "phone": {
            "countryCode": "",
            "number": ""
        
        }, 
        currentRole: "",
        "location" : "",
        "linkedin": "",  # Should be a valid linkedIn URL (start with https)

    }, 
    "education": [
        {
            "school": "",
            "degree": "",
            "startDate": "", # Format should be "MM/YYYY" (should be valid else output null)
            "endDate": "", # Format should be "MM/YYYY" (null if currently here)(should be valid else output null)
            "grade": "",
            "modules": "", 
            "description": "" # Use markdown for formatting, if not mentioned leave blank
        }
    ],
    "experience": [
        {
            "employerName": "",
            "location": "",
            "position": "",
            "startDate": "", # Format should be "MM/YYYY" (should be valid else output null)
            "endDate": "", # Format should be "MM/YYYY" (null if currently here) (should be valid else output null)
            "description": "",  # Use markdown for formatting, if not mentioned leave blank, content which are not in bullets generally go here 
            "achievements": [ # If no achievements, set as empty array, make sure to extract all the achievements mentioned (extract multiple bullet points if mentioned), bullets go here 
                {
                    "description": ""
                }
            ]
        }
    ],
    "skills": [
        {
            "name": "",
            "level": "" # Default value should be "Expert"
        }
    ],
    "professionalSummary": "", # Use markdown for formatting, generate a good summary if not mentioned (in about 50 words, 3rd person british english without pronouns)
}
JSON Output: 
`;

const parseDate = (date: string | null) => {
  // Handle date formats like "MM/YYYY", "MM-YYYY", "YYYY-MM" using moment
  // library
  if (!date) {
    return null;
  }

  // If date is in format "MM/YYYY"
  let convertedDate: Date | null = null;
  convertedDate = moment(date, "MM/YYYY").toDate();
  // Check if invalid date
  if (!convertedDate || convertedDate.toString() == "Invalid Date") {
    convertedDate = moment(date, "YYYY-MM").toDate();
  }

  // Check if invalid date
  if (!convertedDate || convertedDate.toString() == "Invalid Date") {
    convertedDate = moment(date, "MM-YYYY").toDate();
  }

  if (convertedDate.toString() == "Invalid Date") {
    return null;
  }
  return convertedDate;
};

const parseResumeToCV = async (
  resumeText: string,
  userId: string,
  resumeId: string
) => {
  let md = new MarkdownIt();
  // Configure prompt
  const prompt = ov.replace("{{resumeText}}", resumeText);
  let response = await openai.chat.completions.create({
    model: OPENAI_MODELS.GPT_4,
    temperature: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that helps people write impressive resumes.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (
    !response.choices[0].message.content ||
    response.choices[0].message.content.includes("Error")
  ) {
    throw new Error("Invalid response from openai");
  }
  try {
    let result = null;
    try {
      let res = response.choices[0].message.content
        .replace("```json", "")
        .replace("```", "")
        .replace("```", "");
      result = JSON.parse(res);
    } catch (e) {
      throw e;
    }
    let personalInfo = result.personalInfo;
    let education = result.education;

    let professionalSummary = result.professionalSummary;
    let experience = result.experience;
    let skills = result.skills;

    let profileEducation = {
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      educationList: education.map((education: any) => {
        if (experience.endDate == "Current") {
          experience.endDate = null;
        }
        return {
          school: education.school,
          degree: education.degree,
          startDate: parseDate(education.startDate),
          endDate: parseDate(education.endDate),
          grade: education.grade,
          modules: education.modules,
          description: education.description
            ? md.render(education.description)
            : "",
        };
      }),
    };

    let profileExperience = {
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      experienceList: experience.map((experience: any) => {
        if (experience.endDate == "Current") {
          experience.endDate = null;
        }
        return {
          employerName: experience.employerName,
          location: experience.location,
          position: experience.position,
          startDate: parseDate(experience.startDate),
          endDate: parseDate(experience.endDate),
          description: experience.description
            ? md.render(experience.description)
            : "",
          achievements: experience.achievements.map((achievement: any) => {
            return {
              description: achievement.description,
            };
          }),
        };
      }),
    };

    let profileSkills = {
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      skillList: skills.map((skill: any) => {
        return {
          name: skill.name,
          level: skill.level,
        };
      }),
    };

    let profilePersonalInfo = {
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phone: {
        countryCode: personalInfo.phone.countryCode,
        number: personalInfo.phone.number,
      },
      currentRole: personalInfo.currentRole,
      location: personalInfo.location,
      linkedin: personalInfo.linkedin,
    };
    const resumeRef = await db.collection("resumes").doc(resumeId).get();
    const resumeData = resumeRef.data() as Resume;
    const data: Resume = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        ...profilePersonalInfo,
      },
      candidateDetails: {
        ...resumeData.candidateDetails,
        ...profilePersonalInfo,
        candidateSummary: professionalSummary || "",
      },
      professionalSummary: professionalSummary || "",
      experienceList: profileExperience.experienceList,
      educationList: profileEducation.educationList,
      awardList: resumeData.awardList || [],
      publicationList: resumeData.publicationList || [],
      languageList: resumeData.languageList || [],
      volunteeringList: resumeData.volunteeringList || [],
      otherInformationList: resumeData.otherInformationList || [],
      skillList: profileSkills.skillList || [],
    };

    await db.collection("resumes").doc(resumeId).set(data, { merge: true });

    return {
      result: {
        personalInfo: profilePersonalInfo,
        education: profileEducation,
        experience: profileExperience,
        skills: profileSkills,
        professionalSummary: result.professionalSummary,
        openaiResponse: response.choices[0].message.content,
      },
      message: "success",
    };
  } catch (e) {
    throw e;
  }
};

const saveCVToStorage = async (
  resumeId: string,
  userId: string,
  file: File
) => {
  console.log("Saving file to storage...");
  // File is a in memory file
  const dateStr = new Date().toISOString().replace(/:/g, "-");
  let outputFileKey = `${userId}/uploaded/${dateStr}-parsed.json`;

  if (file?.filename?.endsWith(".pdf")) {
    const bucketFile = bucket.file(
      `${userId}/uploaded/${dateStr}-for-resume.pdf`
    );

    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType: "application/pdf",
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on("error", (err) => {
        reject(err);
      });

      stream.on("finish", async () => {
        resolve(outputFileKey);
      });

      fs.createReadStream(file.path).pipe(stream);
    });
  } else {
    // Upload the word document
    const bucketFile = bucket.file(
      `${userId}/uploaded/${dateStr}-for-resume.docx`
    );
    console.log(bucketFile);

    const stream = bucketFile.createWriteStream({
      metadata: {
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on("error", (err) => {
        reject(err);
      });

      stream.on("finish", async () => {
        resolve(outputFileKey);
      });

      fs.createReadStream(file.path).pipe(stream);
    });
  }
};

const saveOuputToStorage = async (outputFileKey: string, output: any) => {
  console.log("Saving output to storage...");
  const bucketFile = bucket.file(outputFileKey);
  const stream = bucketFile.createWriteStream({
    metadata: {
      contentType: "application/json",
    },
  });

  return new Promise<string>((resolve, reject) => {
    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("finish", async () => {
      resolve(outputFileKey);
    });

    stream.write(JSON.stringify(output, null, 2));
    stream.end();
  });
};

const resumeExtractionForCV = async (
  file: File,
  userId: string,
  resumeId: string
) => {
  let outputFileKey = "";
  try {
    // Save the file to storage
    outputFileKey = await saveCVToStorage(resumeId, userId, file);
    // Check if file is pdf
    let parsedOutput: any = null;
    if (file?.filename?.endsWith(".pdf")) {
      let pdfParser = new PDFParser();
      await pdfParser.loadPDF(file.path);

      let resumeText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataReady", (pdfData: Output) => {
          let resumeText = pdfData.Pages.map((page) =>
            page.Texts.map((text) =>
              text.R.map((r) => decodeURIComponent(r.T)).join("")
            ).join("")
          ).join("\n");
          resolve(resumeText);
        });
      });

      parsedOutput = await parseResumeToCV(
        resumeText as string,
        userId,
        resumeId
      );
    } else if (
      file?.filename?.endsWith(".docx") ||
      file?.filename?.endsWith(".doc")
    ) {
      const result = await mammoth.convertToHtml({ path: file.path });
      const text = result.value; // The raw text
      const messages = result.messages;
      parsedOutput = await parseResumeToCV(text, userId, resumeId);
    }

    // Save the output to storage
    await saveOuputToStorage(outputFileKey, parsedOutput);
  } catch (e) {
    captureException(e as Error, {
      src: "parseResumeToCV",
      context: {
        userId,
        resumeId,
        outputFileKey
      },
    });
  }
};

export default resumeExtractionForCV;

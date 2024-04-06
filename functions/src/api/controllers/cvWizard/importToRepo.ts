import PDFParser, { Output } from "pdf2json";
import { File } from "../../../types/requests";
import { openai, DEFAULT_MODEL , OPENAI_MODELS} from "../../../utils/openai";
import { Router, Request, Response } from "express";
import moment from "moment";
import mammoth from "mammoth";
import MarkdownIt from "markdown-it";
import { bucket, db } from "../../../utils/firebase";
import fs from "fs";

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
            "startDate": "", # Format should be "MM/YYYY"
            "endDate": "", # Format should be "MM/YYYY" (null if currently here)
            "grade": "",
            "modules": [], # All modules metioned in an array  
            "description": "" # Use markdown for formatting, if not mentioned leave blank
        }
    ],
    "experience": [
        {
            "employerName": "",
            "location": "",
            "position": "",
            "startDate": "", # Format should be "MM/YYYY"
            "endDate": "", # Format should be "MM/YYYY" (null if currently here)
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
  return convertedDate;
};

const parseResume = async (
  resumeText: string,
  userId: string,
) => {
  let md = new MarkdownIt();
  // Configure prompt
  const prompt = ov.replace("{{resumeText}}", resumeText);
  // Call openai
  let response = await openai.chat.completions.create({
    model: OPENAI_MODELS.GPT_4,
    temperature: 0,
    n: 1,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that is expert at parsing resume, make sure to extract exact info mentioned in resume, don't change anything.",
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
    return {"error": "Error in parsing resume"}
  }
  try {
    let result = null;
    try {
      result = JSON.parse(response.choices[0].message.content);
    } catch (e) {
      let res = response.choices[0].message.content
        .replace("```", "")
        .replace("```", "")
        .replace("json", "");
      console.log(res);
      result = JSON.parse(res);
    }
    let personalInfo = result.personalInfo;
    let education = result.education;

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
    console.log(profilePersonalInfo);
    console.log(profileEducation);
    console.log(profileExperience);
    console.log(profileSkills);
    await db
      .collection("education")
      .doc(userId)
      .set(profileEducation, { merge: true });

    await db
      .collection("experience")
      .doc(userId)
      .set(profileExperience, { merge: true });

    await db
      .collection("skill")
      .doc(userId)
      .set(profileSkills, { merge: true });

    await db
      .collection("personalInfo")
      .doc(userId)
      .set(profilePersonalInfo, { merge: true });

    await db
      .collection("professionalSummary")
      .doc(userId)
      .set(
        {
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          professionalSummary: result.professionalSummary
            ? md.render(result.professionalSummary)
            : result.professionalSummary,
        },
        { merge: true }
      );

    return  {
        personalInfo: profilePersonalInfo,
        education: profileEducation,
        experience: profileExperience,
        skills: profileSkills,
        professionalSummary: result.professionalSummary,
        openaiResponse: response.choices[0].message.content,
      }
  } catch (e) {
    console.log(e);
    return { message: "Error in parsing resume" , 
  }
  }
};

const saveCVToStorage = async (
  userId: string,
  file: File
) => {
  console.log("Saving file to storage...");
  // File is a in memory file
  const dateStr = new Date().toISOString().replace(/:/g, "-");
  let outputFileKey = `userData/${userId}/uploaded/${dateStr}-profile-parsed.json`;

  if (file?.filename?.endsWith(".pdf")) {
    const bucketFile = bucket.file(
      `userData/${userId}/uploaded/${dateStr}-for-resume.pdf`
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
      `userData/${userId}/uploaded/${dateStr}-for-resume.docx`
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


const importResumeToRepo = async (file: File, userId: string) => {
  let outputFileKey = await saveCVToStorage( userId, file);

  // Check if file is pdf
  if (file?.filename?.endsWith(".pdf")) {
    let pdfParser = new PDFParser();
    await pdfParser.loadPDF(file.path);


    // Convert to promise 
    let resumeText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData: Output) => {
        // resolve(pdfData);

        let text = pdfData.Pages.map((page) =>
          page.Texts.map((text) =>
            text.R.map((r) => decodeURIComponent(r.T)).join("")
          ).join("")
        ).join("\n");

        resolve(text);
      });


    });

    let result = await parseResume(resumeText, userId);

    // Save the output to storage
    await saveOuputToStorage(outputFileKey, result);
    return result;
  } else if (
    file?.filename?.endsWith(".docx") ||
    file?.filename?.endsWith(".doc")
  ) {
    const result = await mammoth.convertToHtml({ path: file.path });
    const text = result.value; // The raw text
    const messages = result.messages;
    let parsedResult = await parseResume(text, userId);
    // Save the output to storage
    await saveOuputToStorage(outputFileKey, parsedResult);
    return parsedResult;


  }
};



export default importResumeToRepo;

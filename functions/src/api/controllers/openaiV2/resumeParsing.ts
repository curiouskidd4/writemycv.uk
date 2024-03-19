import PDFParser, { Output } from "pdf2json";
import { File } from "../../../types/requests";
import { openai, DEFAULT_MODEL, OPENAI_MODELS } from "../../../utils/openai";
import { Router, Request, Response } from "express";
import moment from "moment";
import mammoth from "mammoth";
import MarkdownIt from "markdown-it";
import { db } from "../../../utils/firebase";
import { Resume } from "../../../types/resume";

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
            "modules": "", 
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

const parseResumeToCV = async (
  resumeText: string,
  userId: string,
  resumeId: string,
) => {
  let md = new MarkdownIt();
  // Configure prompt
  const prompt = ov.replace("{{resumeText}}", resumeText);
  console.log(prompt);
  // Call openai
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

  console.log(JSON.stringify(response.choices[0].message.content));
  if (
    !response.choices[0].message.content ||
    response.choices[0].message.content.includes("Error")
  ) {
    return { message: "Error in parsing resume" } ;
    
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
    console.log(profilePersonalInfo);
    console.log(profileEducation);
    console.log(profileExperience);
    console.log(profileSkills);
    

    const resumeRef =await db.collection("resumes").doc(resumeId).get();
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
      volunteeringList: resumeData.volunteeringList     || [],
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
      },
      message: "success",
    }
  } catch (e) {
    console.log(e);
    return { message: "Error in parsing resume" }
  }
};

const resumeExtractionForCV = async (file: File, userId: string, resumeId: string) => {
  // Check if file is pdf
  if (file?.filename?.endsWith(".pdf")) {
    let pdfParser = new PDFParser();
    await pdfParser.loadPDF(file.path);

    let resumeText = "";
    // Extract text from all pages
    pdfParser.on("pdfParser_dataReady", async (pdfData: Output) => {
      resumeText = pdfData.Pages.map((page) =>
        page.Texts.map((text) =>
          text.R.map((r) => decodeURIComponent(r.T)).join("")
        ).join("")
      ).join("\n");

      return parseResumeToCV(resumeText, userId,resumeId, );
    });
  } else if (
    file?.filename?.endsWith(".docx") ||
    file?.filename?.endsWith(".doc")
  ) {
    const result = await mammoth.convertToHtml({ path: file.path });
    const text = result.value; // The raw text
    const messages = result.messages;
    return parseResumeToCV(text, userId, resumeId, );
  }
};



export default resumeExtractionForCV;

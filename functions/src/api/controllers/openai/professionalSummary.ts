import { Resume } from "../../../types/resume";
import { db } from "../../../utils/firebase";
import {
  openai,
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_MESSAGE,
} from "../../../utils/openai";

const PROFSUMMARY_PROMPT = `You are a helpful AI assistant expert at generating professional summary given a resume sections. 
Generate a professional summary in about 50-60 words highlighting the key skills and achievements of the candidate. Make sure to pick the right skills and achievements based on the role they are looking for.

Here are the information: 
Current Role: {{currentRole}}
Target Role: {{targetRole}}
Target Sector: {{targetSector}}
Target Geography: {{targetGeography}}

Resume Sections:
Education: 
{{education}}

Experience:
{{experience}}

Skills:
{{skills}}

A good summary has following structure, make sure to follow it:
  - Title and Experience: Start with your current job title and years of experience in the field, if a recent gratuate use generic statement like Proffesional 
  - Highlight their key skills by mentioning what could they offer to the target role
  - Major Achievements: Mention major achievements which are relevant to the target role
Make sure NOT to use pronouns like "I/We/he/they" in sentences, start with verbs and use british english for spellings and keep sentences in 3rd person

Summary:
`;

const PROFSUMMARY_REWRITE_PROMPT = `You are a helpful AI assistant expert at generating professional summary given a resume sections. 
Help rewrite the professional summary in about 50-60 words highlighting the key skills and achievements of the candidate. Make sure to pick the right skills and achievements based on the role they are looking for.
Follow these guidelines:
  - Title and Experience: Start with your current job title and years of experience in the field.
  - Key Skills: Highlight 2-3 key skills that are most relevant to the job profile.
  - Major Achievements: Mention 1-2 significant achievements that are relevant to the job you are applying for.
  - Career Goal or Value Proposition: Briefly state your career goal or how you can add value to the company.
  - Customization: Tailor this summary to the target role and sector and geography mentioned below, also make sure it aligns with the job description if mentioned
  - Don't use pronouns like "I/We" and use british english for spellings

Here are the information: 
Current Role: {{currentRole}}
Target Role: {{targetRole}}
Target Sector: {{targetSector}}
Target Geography: {{targetGeography}}
Job Description: {{jobDescription}}
Resume Sections:
Education: 
{{education}}

Experience:
{{experience}}

Skills:
{{skills}}

Existing Summary:
{{existingSummary}}

Summary:
`;

const generateProfessionalSummary = async (
  resumeId: string,
  userId: string,
  n: number
) => {
  let resumeData;
  let targetRole;
  let targetSector;
  let targetGeography;
  let education;
  let experience;
  let skills;
  let jobDescription;
  let currentRole;

  let prompt;
  if (resumeId) {
    let resumeRef = await db.collection("resumes").doc(resumeId).get();
    resumeData = resumeRef.data() as Resume;

    targetRole = resumeData.role;
    currentRole = resumeData.personalInfo?.currentRole || "N/A";
    targetSector = resumeData.sector || "N/A";
    targetGeography = resumeData.geography || "N/A";
    jobDescription = resumeData.jobDescription || "N/A";


    education = JSON.stringify(resumeData.educationList);
    experience = JSON.stringify(resumeData.experienceList);
    skills = JSON.stringify(resumeData.skillList);

    prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
      .replace("{{targetSector}}", targetSector)
      .replace("{{targetGeography}}", targetGeography)
      .replace("{{education}}", education)
      .replace("{{experience}}", experience)
      .replace("{{currentRole}}", currentRole)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{skills}}", skills);
  } else {
    // Get data from profile
    let educationRef = await db.collection("education").doc(userId).get();
    let experienceRef = await db.collection("experience").doc(userId).get();
    let skillRef = await db.collection("skill").doc(userId).get();
    let personalInfo = await db.collection("personalInfo").doc(userId).get();

    let educationData = educationRef.data();
    let experienceData = experienceRef.data();
    let skillData = skillRef.data();
    let personalInfoData = personalInfo.data();

    targetRole = personalInfoData?.currentRole;
    currentRole = personalInfoData?.currentRole;

    targetSector = personalInfoData?.targetSector || "N/A";
    targetGeography = personalInfoData?.targetGeography || "N/A";
    jobDescription = personalInfoData?.jobDescription || "N/A";

    education = JSON.stringify(educationData);
    experience = JSON.stringify(experienceData);
    skills = JSON.stringify(skillData);

    prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
      .replace("{{targetSector}}", targetSector)
      .replace("{{targetGeography}}", targetGeography)
      .replace("{{education}}", education)
      .replace("{{experience}}", experience)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{currentRole}}", currentRole)
      .replace("{{skills}}", skills);
  }
  console.log("prompt", prompt);
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.5,
    n: n || 1,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
  });

  const suggestions = response.choices.map((item) => {
    return item.message.content;
  });

  return suggestions;
};

const rewriteProfessionalSummary = async (
  resumeId: string | undefined,
  existingSummary: string,
  userId: string,
  n: number
) => {
  let resumeData;
  let targetRole;
  let targetSector;
  let targetGeography;
  let education;
  let experience;
  let skills;

  let prompt;
  if (resumeId) {
    let resumeRef = await db.collection("resumes").doc(resumeId).get();
    resumeData = resumeRef.data() as Resume;

    targetRole = resumeData.role;
    targetSector = resumeData.sector || "N/A";
    targetGeography = resumeData.geography || "N/A";

    education = JSON.stringify(resumeData.educationList);
    experience = JSON.stringify(resumeData.experienceList);
    skills = JSON.stringify(resumeData.skillList);

    prompt = PROFSUMMARY_REWRITE_PROMPT.replace("{{targetRole}}", targetRole)
      .replace("{{targetSector}}", targetSector)
      .replace("{{targetGeography}}", targetGeography)
      .replace("{{education}}", education)
      .replace("{{experience}}", experience)
      .replace("{{skills}}", skills)
      .replace("{{existingSummary}}", existingSummary);
  } else {
    // Get data from profile
    let educationRef = await db.collection("education").doc(userId).get();
    let experienceRef = await db.collection("experience").doc(userId).get();
    let skillRef = await db.collection("skill").doc(userId).get();
    let personalInfo = await db.collection("personalInfo").doc(userId).get();

    let educationData = educationRef.data();
    let experienceData = experienceRef.data();
    let skillData = skillRef.data();
    let personalInfoData = personalInfo.data();

    targetRole = personalInfoData?.currentRole;
    targetSector = personalInfoData?.targetSector || "N/A";
    targetGeography = personalInfoData?.targetGeography || "N/A";

    education = JSON.stringify(educationData);
    experience = JSON.stringify(experienceData);
    skills = JSON.stringify(skillData);

    prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
      .replace("{{targetSector}}", targetSector)
      .replace("{{targetGeography}}", targetGeography)
      .replace("{{education}}", education)
      .replace("{{experience}}", experience)
      .replace("{{skills}}", skills)
      .replace("{{existingSummary}}", existingSummary);
  }
  prompt =
    prompt +
    "\n\nRewrite the below summary in a more professional way and try to improve it.\n\nSummary:\n";
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.5,
    n: n || 1,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,

      },
      { role: "user", content: prompt },
    ],
  });

  const suggestions = response.choices.map((item) => {
    return item.message.content;
  });

  return suggestions;
};

// export default generateProfessionalSummary;
export { generateProfessionalSummary, rewriteProfessionalSummary };

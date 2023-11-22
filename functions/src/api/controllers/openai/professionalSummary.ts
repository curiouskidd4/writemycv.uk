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
`;

const PROFSUMMARY_REWRITE_PROMPT = `You are a helpful AI assistant expert at generating professional summary given a resume sections. 
Help rewrite the professional summary in about 50-60 words highlighting the key skills and achievements of the candidate. Make sure to pick the right skills and achievements based on the role they are looking for.

Here are the information: 
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

Existing Summary:
{{existingSummary}}

Rewritten Summary in 50-60 words in professional way for a resume:
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

    prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
      .replace("{{targetSector}}", targetSector)
      .replace("{{targetGeography}}", targetGeography)
      .replace("{{education}}", education)
      .replace("{{experience}}", experience)
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

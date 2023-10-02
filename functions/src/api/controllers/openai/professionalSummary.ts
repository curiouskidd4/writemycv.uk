import e from "cors";
import { Resume } from "../../../types/resume";
import { db } from "../../../utils/firebase";
import { openai } from "../../../utils/openai";

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

const generateProfessionalSummary = async (resumeId: string, n: number) => {
  const resumeRef = await db.collection("resumes").doc(resumeId).get();
  const resumeData = resumeRef.data() as Resume;

  const targetRole = resumeData.role;
  const targetSector = resumeData.sector || "N/A";
  const targetGeography = resumeData.geography || "N/A";

  const education = JSON.stringify(resumeData.educationList);
  const experience = JSON.stringify(resumeData.experienceList);
  const skills = JSON.stringify(resumeData.skillList);

  const prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
    .replace("{{targetSector}}", targetSector)
    .replace("{{targetGeography}}", targetGeography)
    .replace("{{education}}", education)
    .replace("{{experience}}", experience)
    .replace("{{skills}}", skills);

  console.log("prompt", prompt);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    // model: "gpt-4-0613",
    temperature: 0.5,
    n: n || 1,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that helps people write impressive resumes.",
      },
      { role: "user", content: prompt },
    ],
  });

  const suggestions = response.choices.map((item) => {
    return item.message.content;
  });

  return suggestions;
};

const rewriteProfessionalSummary = async (resumeId: string, n: number) => {
  const resumeRef = await db.collection("resumes").doc(resumeId).get();
  const resumeData = resumeRef.data() as Resume;

  const targetRole = resumeData.role;
  const targetSector = resumeData.sector || "N/A";
  const targetGeography = resumeData.geography || "N/A";

  const education = JSON.stringify(resumeData.educationList);
  const experience = JSON.stringify(resumeData.experienceList);
  const skills = JSON.stringify(resumeData.skillList);

  let prompt = PROFSUMMARY_PROMPT.replace("{{targetRole}}", targetRole)
    .replace("{{targetSector}}", targetSector)
    .replace("{{targetGeography}}", targetGeography)
    .replace("{{education}}", education)
    .replace("{{experience}}", experience)
    .replace("{{skills}}", skills);

  prompt =
    prompt +
    "\n\nRewrite the below summary in a more professional way and try to improve it.\n\nSummary:\n";
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    // model: "gpt-4-0613",
    temperature: 0.5,
    n: n || 1,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that helps people write impressive resumes.",
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

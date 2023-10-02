import { openai } from "../../../utils/openai";

const experienceSummarySuggestion = async (
  experienceRole: string,
  experienceOrg: string,
  role: string,
    n: number = 1
) => {
  let prompt = `Write a short summary (in 50 words) for experience section for a resume for the role of ${role}. Make sure summary is in third person, past tense and british english. \Experience Role: ${experienceRole}\Organization: ${experienceOrg}\nSummary:`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    n: n,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that helps people write impressive resumes.",
      },
      { role: "user", content: prompt },
    ],
  });
  const responseString = response.choices[0].message.content;
  return responseString;
};

export default experienceSummarySuggestion;

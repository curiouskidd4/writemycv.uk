import { openai } from "../../../utils/openai";

const educationSummarySuggestion = async (
  degree: string,
  school: string,
  role: string, 
  n: number = 1
) => {
  let prompt = `Write a short summary (in 50 words) for eduction sections for a resume for the role of ${role}. Make sure summary is in third person, past tense and british english. \nDegree: ${degree}\nSchool: ${school}\nSummary:`;

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
  const summaries = response.choices.map((item) => {
    return item.message;
  });

  return summaries;
};

export default educationSummarySuggestion;

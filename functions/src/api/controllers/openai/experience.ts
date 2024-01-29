import {
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_MESSAGE,
  openai,
} from "../../../utils/openai";

const experienceSummarySuggestion = async (
  experienceRole: string,
  experienceOrg: string,
  role: string,
  n: number = 3
) => {
  let prompt = `Write short summary (in 50 words) for experience section for a resume for the role of ${role}. Use british english for spellings, don't use pronouns like "I/We". Make sure summary is in  past tense and british english. Make sure not to use they/he/them/i/we start sentence with past verb.  \Experience Role: ${experienceRole}\Organization: ${experienceOrg}\nSummary:`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    n: n,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE
      },
      { role: "user", content: prompt },
    ],
  });
  const summaries = response.choices.map((item) => {
    return item.message.content;
  });

  return summaries;
};

const experienceSummaryRewrite = async (
  experienceRole: string,
  experienceOrg: string,
  role: string,
  existingSummary: string,
  n: number = 3
) => {
  let prompt = `Rewrite short summary (in 50 words) for experience section for a resume for the role of ${role}.  Use british english for spellings, don't use pronouns like "I/We". Make sure summary past tense and british english.
  Make sure not to use they/he/them/I/we start sentence with past verb. \Experience Role: ${experienceRole}\Organization: ${experienceOrg}\nSummary: ${existingSummary}\n Suggested Summary:`;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    n: n,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
  });
  const summaries = response.choices.map((item) => {
    return item.message.content;
  });
  return summaries;
};

export { experienceSummarySuggestion, experienceSummaryRewrite };
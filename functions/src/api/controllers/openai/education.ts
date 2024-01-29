import {
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_MESSAGE,
  openai,
} from "../../../utils/openai";

const educationSummarySuggestion = async (
  degree: string,
  school: string,
  role: string,
  n: number = 1
) => {
  let prompt = `Write a short summary (in 50 words) for eduction sections for a resume for the role of ${role}.  
  Follow the following guidelines: 
    - Use british english for spellings, don't use pronouns like "I/We". 
    - Make sure summary is in  past tense and british english. 
  Degree: ${degree}
  School: ${school}
  Summary:`;

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

const eductionCoursesHelper = async (
  degree: string,
  school: string,
  role: string,
  instructions?: string,
  n: number = 1
) => {
  let prompt;
  if (instructions) {
    prompt = `Suggest few courses (comma separated, at most 10) for a ${degree} degree from ${school} for the role of ${role}.  Use british english for spellings, don't use pronouns like "I/We". Make sure courses are relevant to the role and are short (max 4 words), also keep them very granualar. \nFollow the following instructions carefully: ${instructions}  \nDegree: ${degree}\nSchool: ${school}, 
    Output Format: 
    {"courses": ["course 1", "course 2", "course 3", ...]}
    Courses:\n`;
  } else {
    prompt = `Suggest few courses (comma separated, at most 10) for a ${degree} degree from ${school} for the role of ${role}.  Use british english for spellings, don't use pronouns like "I/We". Make sure courses are relevant to the role and are short (max 4 words), also keep them very granualar. (generate comma separated, at most 5)\n \nDegree: ${degree}\nSchool: ${school}
    Output Format: 
    {"courses": ["course 1", "course 2", "course 3", ...]}
    
    Courses:\n`;
  }

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    n: 1,
    temperature: 0.25,
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
  });
  let finalSuggestions: string[] = []
  const suggestions = response.choices.map((item) => {
    let suggestions = []
    try{
      console.log(item.message.content)
      suggestions = JSON.parse(item.message.content!).courses;
    }catch(e){
      console.log(e)
    }
    // return suggestions;
    finalSuggestions = [...finalSuggestions, ...suggestions]
    
  });

  return finalSuggestions;
};

const educationSummaryRewrite = async (
  degree: string,
  school: string,
  role: string,
  existingSummary: string,
  instructions?: string,
  n: number = 3
) => {
  console.log("Rewrite");
  let prompt;
  if (instructions) {
    prompt = `Rewrite short summary (in 50 words) for eduction sections for a resume for the role of ${role}.  Use british english for spellings , don't use pronouns like "I/We". Make sure summary is in  past tense and british english. Make sure not to use they/he/them/i/we start sentence with past verb.\n Follow the following instructions carefully: ${instructions}  \nDegree: ${degree}\nSchool: ${school}\nSummary: ${existingSummary}`;
  } else {
    prompt = `Rewrite  short summary (in 50 words) for eduction sections for a resume for the role of ${role}.  Use british english for spellings , don't use pronouns like "I/We". Make sure summary is in past tense and british english. Make sure not to use they/he/them/i/we start sentence with past verb. \nDegree: ${degree}\nSchool: ${school}\nSummary: ${existingSummary}`;
  }

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

export {
  educationSummarySuggestion,
  educationSummaryRewrite,
  eductionCoursesHelper,
};

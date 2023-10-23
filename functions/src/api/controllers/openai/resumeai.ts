import { db } from "../../../utils/firebase";
import { openai } from "../../../utils/openai";

const ov = `You are a helpful AI assistant expert at helping people create resumes. 
You are expert at creating the following sections of a resume only:
1. Personal Info
2. Education - Can be more than 1 
3. Experience - Can be more than 1
4. Skills - Can be more than 1
5. Summary

Format of each section should be as follows: 
1. Personal Info 
interface PersonalInfo {
    city?: string;
    country?: string;
    linkedIn?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}
2. Education
interface EducationDisseration {
    title: string;
    abstract?: string;
    supervisor?: string;
}
interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    grade?: string;
    modules?: string;
    dissertation?: EducationDisseration;
    description?: string;
}
3. Experience

interface Experience {
    id: string;
    employerName: string;
    location?: string;
    position: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    description: string;
}
4. Skills
interface Skill {
    name: string;
    level: string;
}
5. Summary
string

Ask user which section they want to create and then ask follow up questions along with help writing 'descriptions' of the section. if you are done with a section write "FINISHED" followed by section in JSON format and ask user if they want to create another section and repeat the process.

`;
const EDUCATION_PROMPT = `You are a helpful AI assistant expert at helping people create resumes. 
You are expert at creating the following sections of a resume only:
1. Education - Can be more than 1 

Format of each section should be as follows: 
1. Education
interface EducationDisseration {
    title: string;
    abstract?: string;
    supervisor?: string;
}
interface Education {
    school: string;
    degree: string;
    startDate: Timestamp; // convert user input in "MM-YYYY" format 
    endDate?: Timestamp; // convert user input in "MM-YYYY" format (null if current)
    grade?: string;
    modules?: string;
    dissertation?: EducationDisseration;
    description?: string; // Summary of the education, 50 words only in past tense and british english, this can contains achievements, awards, projects, etc
}

User has currently this role: {{role}}  and looking for {{lookingRole}}
Follow this pattern : 
- Ask them to provide basic fields  information and suggest they can write in simple text 
- Ask followup questions till you have the information
- After you have basic field suggest them a description based on the the role they have and the role they are looking for, summary should be about 50 words only in  past tense and british english, confirm the summary and ask if any additional update is needed
- If they are a recent graduate (graduate of 2021/2022/2020) suggest them to add dissertation and modules (also suggest modules which they should add based on the role they are looking for)
If you are done with a section write "FINISHED" followed by section in JSON format, the json data should be enclosed in """ (triple quotes) and ask user if they want to create another education entry and repeat the process.
After Start greet the user and start with steps above.
Start: 
`;

const EXPERIENCE_PROMPT = `You are a helpful AI assistant expert at helping people create resumes. 
You are expert at creating the following sections of a resume only:
1. Experience - Can be more than 1 

Format of each section should be as follows: 
1. Experience
interface Experience {
    employerName: string;
    location?: string;
    position: string;
    startDate: Timestamp; // convert user input to "MM-YY" format
    endDate?: Timestamp; // null if current job 
    description: string;
}

User has currently this role: {{role}}  and looking for {{lookingRole}}
Follow this pattern : 
- Ask them to provide basic fields  information and suggest they can write in simple text 
- Ask followup questions till you have the information
- After you have basic field suggest them a description based on the the role they have and the role they are looking for, description should be about 50 words only in past tense and british english
If you are done with a section write "FINISHED" followed by section in JSON format and ask user if they want to create another education item and repeat the process.
After Start greet the user and start with steps above.
Start: 
`;

interface ChatMessage {
  role: "function" | "system" | "user" | "assistant";
  content: string;
}

const educationHelper = async (
  currentRole: string,
  targetRole: string,
  messages: ChatMessage[]
) => {
  let prompt = EDUCATION_PROMPT.replace("{{role}}", currentRole).replace(
    "{{lookingRole}}",
    targetRole
  );
  if (
    messages.length === 0 ||
    (messages[0].content === "start" && messages.length === 1)
  ) {
    messages.push(
      { role: "user", content: prompt }
      //   { role: "user", content: "Start" }
    );
  } else {
    // Add prompt at the start
    messages.unshift({ role: "user", content: prompt });
  }

  console.log(messages);
  const response = await openai.chat.completions.create({
    // model: "gpt-3.5-turbo",
    model: "gpt-4-0613",
    temperature: 0,
    n: 1,
    messages: messages,
  });

  const responseString = response.choices[0].message.content;
  return responseString;
};

const experienceHelper = async (
  currentRole: string,
  targetRole: string,
  messages: ChatMessage[]
) => {
  if (
    messages.length === 0 ||
    (messages[0].content === "start" && messages.length === 1)
  ) {
    let prompt = EXPERIENCE_PROMPT.replace("{{role}}", currentRole).replace(
      "{{lookingRole}}",
      targetRole
    );
    messages.push(
      { role: "system", content: prompt },
      { role: "user", content: "Start" }
    );
  } else {
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    n: 1,
    messages: messages,
  });

  const responseString = response.choices[0].message.content;
  return responseString;
};

const educationSummarySuggestion = async (
  degree: string,
  school: string,
  role: string,
  n: number = 1
) => {
  console.log("NUMBER", n);

  let prompt = `Write a short summary (in 50 words) for eduction sections for a resume for the role of ${role}. Make sure summary is in  past tense and british english. \nDegree: ${degree}\nSchool: ${school}\nSummary:`;

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

const eductionCoursesHelper = async (
  degree: string,
  school: string,
  role: string,
  instructions?: string,
  n: number = 1
) => {
  let prompt;
  if (instructions) {
    prompt = `Suggest few courses (comma separated, at most 5) for a ${degree} degree from ${school} for the role of ${role}. Make sure courses are relevant to the role and are short (max 4 words), also keep them very granualar. \nFollow the following instructions carefully: ${instructions}  \nDegree: ${degree}\nSchool: ${school}`;
  } else {
    prompt = `Suggest few courses (comma separated, at most 5) for a ${degree} degree from ${school} for the role of ${role}. Make sure courses are relevant to the role and are short (max 4 words), also keep them very granualar. (generate comma separated, at most 5)\n \nDegree: ${degree}\nSchool: ${school}`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    n: n,
    temperature: 0.25,
    messages: [
      {
        role: "system",
        content:
          "You are a helpul AI that helps people write impressive resumes. Please follow the instructions exactly",
      },
      { role: "user", content: prompt },
    ],
  });
  const summaries = response.choices.map((item) => {
    return item.message;
  });

  return summaries;
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
    prompt = `Rewrite short summary (in 50 words) for eduction sections for a resume for the role of ${role}. Make sure summary is in  past tense and british english. Make sure not to use they/he/them start sentence with past verb.\n Follow the following instructions carefully: ${instructions}  \nDegree: ${degree}\nSchool: ${school}\nSummary: ${existingSummary}`;
  } else {
    prompt = `Rewrite  short summary (in 50 words) for eduction sections for a resume for the role of ${role}. Make sure summary is in past tense and british english. Make sure not to use they/he/them start sentence with past verb. \nDegree: ${degree}\nSchool: ${school}\nSummary: ${existingSummary}`;
  }

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

const experienceSummarySuggestion = async (
  experienceRole: string,
  experienceOrg: string,
  role: string,
  n: number = 3
) => {
  let prompt = `Write short summary (in 50 words) for experience section for a resume for the role of ${role}. Make sure summary is in  past tense and british english. Make sure not to use they/he/them start sentence with past verb.  \Experience Role: ${experienceRole}\Organization: ${experienceOrg}\nSummary:`;

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

const experienceSummaryRewrite = async (
  experienceRole: string,
  experienceOrg: string,
  role: string,
  existingSummary: string,
  n: number = 3
) => {
  let prompt = `Rewrite short summary (in 50 words) for experience section for a resume for the role of ${role}. Make sure summary past tense and british english.
  Make sure not to use they/he/them start sentence with past verb. \Experience Role: ${experienceRole}\Organization: ${experienceOrg}\nSummary: ${existingSummary}\n Suggested Summary:`;

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

const professionSummarySuggestion = async (
  role: string,
  resumeId: string,
  n: number = 1
) => {
  let resume = await db.collection("resumes").doc(resumeId).get();

  if (!resume.exists) {
    throw new Error("Resume not found");
  }

  let prompt = `Write a short summary (in 50 words) for profession section for a resume for the role of ${role}. Make sure not to use they/he/them start sentence with past verb. Make sure summary is in past tense and british english. Other resume details are given below ${JSON.stringify(
    resume.data()
  )} \nSummary:`;

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

const professionSummaryRewrite = async (
  role: string,
  resumeId: string,
  existingSummary: string,
  n: number = 1
) => {
  let resume = await db.collection("resumes").doc(resumeId).get();
  if (!resume.exists) {
    throw new Error("Resume not found");
  }

  let prompt = `Rewrite the summary (in 50 words) for profession section for a resume for the role of ${role}. Make sure summary is in  past tense and british english. Make sure not to use they/he/them start sentence with past verb. Other resume details are given below ${JSON.stringify(
    resume.data()
  )} \nSummary: ${existingSummary}`;

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

const skillSuggestion = async (role: string, alreadyAdded: string[]) => {
  let alreadyAddedStr = alreadyAdded.join(", ");
  let prompt = `Suggest top 10 skills for a ${role} resume, each skill should be unique and short (max 4 words), also keep them very granualar, Keep in mind this is to add in a resume under Skills section.\nAlready added skills: ${alreadyAddedStr}\nSuggested Skills:\n1. `;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-0613",
  });
  const responseString = response.choices[0].message.content;
  let responseArray: string[] = [];
  if (responseString) {
    // Split and remove the \d\. from the response
    responseArray = responseString.split("\n").map((item) => {
      return item.replace(/\d+\./, "").trim();
    });
  } else {
    responseArray = [];
  }
  return responseArray;
};

const themeSuggestion = async (role: string, alreadyAdded: string[]) => {
  let alreadyAddedStr = alreadyAdded.join(", ");
  let prompt = `Suggest top 10 themes for a ${role}, each theme should be unique and short (max 4 words), also keep them very granualar, Keep in mind this is to add achievements under experience section.\nAlready added themes: ${alreadyAddedStr}\nSuggested Themes:\n1. `;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-0613",
  });
  const responseString = response.choices[0].message.content;
  console.log(responseString);
  let responseArray: string[] = [];
  if (responseString) {
    // Split and remove the \d\. from the response
    responseArray = responseString.split("\n").map((item) => {
      return item.replace(/\d+\./, "").trim();
    });
  } else {
    responseArray = [];
  }
  return responseArray;
};

const themeDescriptionSuggestion = async (role: string, theme: string) => {
  //write 2-3 sentence on how one should write an achievement for "Data Visualization" theme in a resume under work experience section and suggest one possible example

  let prompt = `Write 2-3 sentence on how one should write an achievement for "${theme}" theme in a resume under work experience section and suggest one possible example`;

  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-0613",
  });
  const responseString = response.choices[0].message.content;
  return responseString;
};
export {
  educationHelper,
  experienceHelper,
  educationSummarySuggestion,
  educationSummaryRewrite,
  eductionCoursesHelper,
  experienceSummarySuggestion,
  experienceSummaryRewrite,
  professionSummarySuggestion,
  professionSummaryRewrite,
  skillSuggestion,
  themeSuggestion,
  themeDescriptionSuggestion,
};

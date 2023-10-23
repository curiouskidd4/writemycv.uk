import { db } from "../../../utils/firebase";
import { openai } from "../../../utils/openai";

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

  let prompt = `Write 2-3 sentence on how one should write an achievement for "${theme}" theme in a resume under work experience section and suggest three possible examples.
  Follow this JSON format exactly : 
  """
  {
    "explanation": "how to write in 2- 3 sentences", 
    "examples": [
        "example 1", # Each example should be for about 20-30 words
        "example 2", 
        "example 3"
        ]
  }
  """ 
  `;

  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-0613",
  });
  const responseString = response.choices[0].message.content;
  console.log(responseString);
  try {
    let response = JSON.parse(responseString!);

    return { ...response };
  } catch (e) {
    return {
      explanation:
        "We could not find any suggestions for this theme. Please try another theme.",
      examples: [],
    };
  }
};

const achievementRewrite = async (
  theme: string,
  existingAchievement: string,
  n: number
) => {
  let prompt = `ReWrite 2-3 sentence for the following existing achievement for a job role in resume for "${theme}" theme in a resume under work experience section and suggest three possible examples.
  existing achievement: ${existingAchievement}

  Follow this JSON format exactly : 
  """
  {
    "examples": [
        "example 1", # Each example should be for about 20-30 words
        "example 2", 
        "example 3"
        ]
  }
  
  """ 
  `;

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

  const responseString = response.choices[0].message.content;

  // return suggestions;
  try {
    let response = JSON.parse(responseString!);

    return { ...response };
  } catch (e) {
    return {
      explanation:
        "We could not find any suggestions for this theme. Please try another theme.",
      examples: [],
    };
  }
};

export { themeSuggestion, themeDescriptionSuggestion, achievementRewrite };

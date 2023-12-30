import {
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_MESSAGE,
  openai,
} from "../../../utils/openai";

const _ACHIEVEMENT_GUIDELINES = `Follow the following guidelines: 
  - Use past tense and british english and don't use pronouns like "I/We".
  - Do not to use hyperbolic language, rather just use the verb for example "increased" instead of "dramatically increased".
  - Make sure to lead sentence with the impact created i.e. the numeber if mentioned and the then the method and then the action . 
  - If the given already follows the above guidelines, then don't change much
  - Effectively communicate the acievement in the start of the sentence
`



const themeSuggestion = async (role: string, alreadyAdded: string[]) => {
  let alreadyAddedStr = alreadyAdded.join(", ");
  let prompt = `Suggest top 10 themes for a ${role}, each theme should be unique and short (max 4 words), also keep them very granualar, Keep in mind this is to add achievements under experience section. Use british english for spellings , don't use pronouns like "I/We".\nAlready added themes: ${alreadyAddedStr}\nSuggested Themes:\n1. `;
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
    model: DEFAULT_MODEL,
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
  Follow the following guidelines:
  {{guidelines}}
  Follow this JSON format exactly : 
  {
    "explanation": "how to write in 2- 3 sentences", 
    "examples": [
        "example 1", # Each example should be for about 20-30 words
        "example 2", 
        "example 3"
        ]
  }
  `.replace("{{guidelines}}", _ACHIEVEMENT_GUIDELINES);

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: DEFAULT_SYSTEM_MESSAGE,
      },
      { role: "user", content: prompt },
    ],
    // model: "gpt-3.5-turbo-0613",
    model: DEFAULT_MODEL,
  });
  const responseString = response.choices[0].message.content;
  console.log(responseString);
  try {
    let response = JSON.parse(responseString!);

    return { ...response };
  } catch (e) {
    console.log(e);
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
  {{guidelines}}}
  existing achievement: ${existingAchievement}
  Rewrite above achievement following the guidelines exactly and suggest three possible examples, make sure to rewrite cohesively, keep it simple and try to make it better.
  Follow this JSON format exactly : 
  {
    "examples": [
        "example 1", # Each example should be for about 20-30 words following the guidelines exactly
        "example 2", 
        "example 3"
        ], 
        "explanation": [
          "explanation_1",  # Explanation why the example 1 is better
          "explanation_2",
          "explanation_3"
          ]
  }
  `.replace("{{guidelines}}", _ACHIEVEMENT_GUIDELINES);

  console.log(prompt);
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

  const responseString = response.choices[0].message.content;

  // return suggestions;
  try {
    let response = JSON.parse(responseString!.trim());

    return { ...response };
  } catch (e) {
    console.log("responseString", responseString);
    console.log(e);

    return {
      explanation:
        "We could not find any suggestions for this theme. Please try another theme.",
      examples: [],
    };
  }
};

export { themeSuggestion, themeDescriptionSuggestion, achievementRewrite };

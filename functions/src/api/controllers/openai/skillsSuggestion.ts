import {
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_MESSAGE,
  openai,
} from "../../../utils/openai";

const skillSuggestion = async (role: string, alreadyAdded: string[]) => {
  let alreadyAddedStr = alreadyAdded.join(", ");
  let prompt = `Suggest top 10 skills for a ${role} resume, each skill should be unique and short (max 4 words), also keep them very granualar, Keep in mind this is to add in a resume under Skills section.\nAlready added skills: ${alreadyAddedStr}\nSuggested Skills:\n1. `;
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: DEFAULT_SYSTEM_MESSAGE },
      { role: "user", content: prompt },
    ],
    model: DEFAULT_MODEL,
  });
  const responseString = response.choices[0].message.content;
  let responseArray: string[] = [];
  if (responseString) {
    // Split and remove the \d\. from the response
    responseArray = responseString.split("\n").map((item) => {
      return item.replace(/\d+\./, "").replace('"', "").replace('"', "").trim();
    });
  } else {
    responseArray = [];
  }
  return responseArray;
};

export default skillSuggestion;

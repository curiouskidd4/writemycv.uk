import axios from "axios";

const persistedState = createPersistedState("chatbotState");

const educationHelper = async (currentRole, targetRole, messages, token) => {
  let apiUrl =
    "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api/openai/educationHelper";

  let data = {
    currentRole: currentRole,
    targetRole: targetRole,
    messages: messages,
  };
  let headers = {
    Authorization: "Bearer " + `${token}`,
  };

  let response = await axios.post(apiUrl, data, {
    headers: headers,
  });
  return { content: response.data.result, role: "assistant" };
};

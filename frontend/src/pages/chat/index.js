import React from "react";
import ChatBot from "../../components/chatbot";
import { useQuery } from "react-query";
import "./index.css"
const ChatBotPage = (props) => {
  const botService = useQuery("sessionId", () =>
    {}
  );

  return (
    <div className="chat-page">
        <div className="header">
      <h1>Ask a question</h1>
        </div>
      <div>
        {botService.isLoading && <div>Loading...</div>}
        {!botService.isLoading && botService.data && (
          <ChatBot sessionId={botService.data.id} />
        )}
      </div>
    </div>
  );
};

export default ChatBotPage;

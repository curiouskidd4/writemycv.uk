import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, Row, message, Input, Divider } from "antd";
import { MoreOutlined, SendOutlined, LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

import moment from "moment";
import { useAuth } from "../../authContext";
import "./index.css";
import axios from "axios";


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

const ChatBot = (props) => {
  const { authToken } = useAuth();
  const [state, setState] = useState({});
  const [messages, setMessages] = useState([
    // { content: "start", role: "user" },
  ]);
  const auth = useAuth();
  let chatWebsocket = useRef();
  let dummyDiv = useRef();

  useEffect(() => {
    if (dummyDiv.current) {
      dummyDiv.current.scrollIntoView({ behavior: "smooth" });
    }

    if (messages.length == 0 || messages[messages.length - 1].role === "user") {
    // Send request to backend to get response
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    auth.user.getIdToken().then((token) =>
      educationHelper(
        "Machine Learning Engineer",
        "Data Scientist",
        messages,
        token
      ).then((response) => {
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
        setMessages((prev) => [...prev, response]);
      })
    );
    }
  }, [messages]);

  const scrollLastMessage = () => {
    if (dummyDiv.current) {
      dummyDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const newMessage = async () => {
    setState((prev) => ({ ...prev, message: "" }));
    setMessages((prev) => [
      ...prev,
      {
        content: state.message,
        role: "user",
      },
    ]);
  };

  const getMessages = () => {
    if (state.loading) {
      return [...messages, { role: "assistant", loading: true }];
    }
    return messages;
  };

  return (
    <Row style={{ width: "100%", height: "80vh" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          margin: "1rem",
          position: "relative",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              position: "absolute",
              height: "calc(100% - 100px)",
              bottom: "100px",
              overflowY: "auto",
            }}
          >
            {/* <div style={{ overflowY: "auto"}}> */}
            <div className="chat-message-box">
              <Divider type="horizontal">Conversation Started</Divider>
              {getMessages().map((item) => (
                <div key={item.id}>
                  <div className="chat-message-wrapper" key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: item.role == "assistant" ? "left" : "right",
                        maxWidth: "85%",
                        margin: "0.5rem 0rem",
                      }}
                    >
                      <div
                        className={
                          item.role == "assistant"
                            ? "agent-chat-message"
                            : "user-chat-message"
                        }
                      >
                        {item.loading ? (
                          <LoadingOutlined />
                        ) : (
                          // item.message.split("\n").map((i, key) => {
                          //   return (
                          //     <div
                          //       style={{ margin: "0.375rem 0rem" }}
                          //       key={key}
                          //     >
                          //       {i}
                          //     </div>
                          //   );
                          // })
                          <div className="markdown-message-container">
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                          </div>
                        )}
                        {/* { item.message} */}
                      </div>
                      <div
                        className={
                          item.is_agent
                            ? "agent-chat-message-timeline"
                            : "user-chat-message-timeline"
                        }
                      >
                        {/* {moment(item.created_at).fromNow()} */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={dummyDiv} style={{ paddingBottom: "1rem" }}></div>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div style={{ bottom: "0px", position: "absolute", width: "100%" }}>
          <Input.TextArea
            value={state.message}
            onChange={(e) =>
              setState((prev) => ({ ...prev, message: e.target.value }))
            }
            style={{ width: "100%", resize: "none" }}
          ></Input.TextArea>
          <Row>
            <Button
              onClick={newMessage}
              type="primary"
              style={{ marginTop: "1rem" }}
            >
              Submit
              <SendOutlined />
            </Button>
            {/* <Button
              onClick={props.onClear}
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              Clear Chat
            </Button> */}
          </Row>
        </div>
      </div>
    </Row>
  );
};

export default ChatBot;

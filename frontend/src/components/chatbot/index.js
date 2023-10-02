import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Drawer,
  Col,
  Row,
  Spin,
  notification,
  Tabs,
  Tag,
  Popover,
  message,
  Input,
  Divider,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
// import Search from "./containers/search";
import createPersistedState from "use-persisted-state";
// import DownloadSupplierTable from ".//containers/downloadTableSupplier";
// import AssignSupplier from "./containers/assignSupplier";
import { MoreOutlined, SendOutlined, LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

import moment from "moment";
import getWebsocket from "./websocket";
import { FirebaseUserContext } from "../../customContext";
import { useAuth } from "../../authContext";
import "./index.css";
const persistedState = createPersistedState("chatbotState");

const ChatBot = (props) => {
  const { authToken } = useAuth();
  const [state, setState] = persistedState({});
  // const SessionService = ChatbotSession;
  const [messages, setMessages] = useState([]);
  const firebaseUser = useContext(FirebaseUserContext);
  const queryClient = useQueryClient();
  let chatWebsocket = useRef();
  let dummyDiv = useRef();

  useEffect(() => {
    if (dummyDiv.current) {
      dummyDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages]);

  const scrollLastMessage = () => {
    if (dummyDiv.current) {
      dummyDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    initChatsocket(authToken);
  }, []);

  useEffect(() => {
    if (props.sessionId != state.sessionId) {
      console.log(props.sessionId, state.sessionId);
      setState((prev) => ({ ...prev, sessionId: props.sessionId }));
      chatbotMessages.mutate(props.sessionId);
    }
  }, [props.sessionId]);

  const handleNewMessage = (event) => {
    const msg = JSON.parse(event.data);
    console.log("agent_message", msg);
    if (msg.event == "message_update") {
      if (msg.message) {
        setMessages((prev) =>
          (prev || []).map((item) =>
            item.id == msg.id
              ? { ...item, loading: msg.loading, message: msg.message }
              : { ...item }
          )
        );
      }
      scrollLastMessage();
    } else if (msg.event == "user_message") {
      setMessages((prev) => [...prev, { ...msg }]);
      setState((prev) => {
        return {
          ...prev,
          message: "",
        };
      });
    } else if (msg.event == "agent_message") {
      setMessages((prev) => [...prev, { ...msg }]);

      setState((prev) => {
        return {
          ...prev,
          message: "",
        };
      });
    }
  };

  const initChatsocket = (token, flag) => {
    try {
      message.destroy();
      if (flag == "reconnect") {
        message.loading("Re-Connecting to chatbot...", 0);
      } else {
        message.loading("Connecting to chatbot...", 0);
      }
      let wsURL = props.isPublic
        ? process.env.REACT_APP_WS_URL.replace("api", "api/public")
        : process.env.REACT_APP_WS_URL;
      chatWebsocket.current = getWebsocket({
        protocol: "normal",
        sessionId: props.sessionId,
        token: token,
        onOpen: () => {
          setState((prev) => ({ ...prev, websocketState: "open" }));
          message.destroy();
        },

        baseUrl: wsURL + `/chatbot/session/${props.sessionId}/ws/`,
      });
      chatWebsocket.current.onmessage = handleNewMessage;
      chatWebsocket.current.onclose = () => {
        console.log("Websocket closed");
        setState((prev) => ({ ...prev, websocketState: "closed" }));
      };
      window.addEventListener("focus", checkWebsocket);
    } catch (exception) {
      console.log(exception);
      debugger;
    }
  };

  const checkWebsocket = () => {
    if (chatWebsocket.current.readyState == 3) {
      initChatsocket(authToken, "reconnect");
    }
  };

  const chatbotMessages = useMutation(
    (sessionId) => {},
    {
      onSuccess: (data) => {
        message.success("Messages Loaded");
        setMessages([...data.results]);
        setState((prev) => ({ ...prev, messages: [...data.results] }));
      },
      onError: (data) => {
        message.error("Messages Loading Failed!!!");
      },
    }
  );

  const newMessage = async () => {
    await chatWebsocket.current.send(
      JSON.stringify({
        event: "new_message",
        type: "user",
        message: state.message,
        session_id: props.sessionId,
      })
    );
    setState((prev) => ({ ...prev, message: "" }));
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
              {(messages || []).map((item) => (
                <div key={item.id}>
                  <div className="chat-message-wrapper" key={item.id}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        float: item.is_agent ? "left" : "right",
                        maxWidth: "60%",
                        margin: "0.5rem 0rem",
                      }}
                    >
                      <div
                        className={
                          item.is_agent
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
                          <div className="markdown-message-container" >
                            <ReactMarkdown>{item.message}</ReactMarkdown>
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
                        {moment(item.created_at).fromNow()}
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
              // loading={newMessage.isLoading}
              onClick={newMessage}
              type="primary"
              style={{ marginTop: "1rem" }}
            >
              Submit
              <SendOutlined />
            </Button>
            <Button
              // loading={newMessage.isLoading}
              onClick={props.onClear}
              // type="primary"
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
            >
              Clear Chat
              {/* <SendOutlined /> */}
            </Button>
          </Row>
        </div>
      </div>
    </Row>
  );
};

export default ChatBot;

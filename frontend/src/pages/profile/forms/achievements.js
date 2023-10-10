import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  Form,
  Input,
  Button,
  Row,
  DatePicker,
  Typography,
  Col,
  Skeleton,
  message,
  Popover,
  Space,
  Modal,
  Spin,
} from "antd";
import EditorJsInput from "../../../components/editor";
import { useAuth } from "../../../authContext";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import dayjs from "dayjs";
import { objectId } from "../../../helpers";
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";
import showdown from "showdown";
import "./index.css";

const Achievements = ({ jobTitle, description, value, onChange }) => {
  // AI Actions helper
  const [state, setState] = useState({
    modalVisible: false,
    mode: null,
    loadedTheme: null,
    loadedThemeDescription: null,
    currentAchievement: null,
  });

  useEffect(() => {
    if (jobTitle && jobTitle != state.loadedTheme) {
      getThemeSuggestions();
      setState({ ...state, loadedTheme: jobTitle });
    }
  }, [jobTitle]);

  useEffect(() => {
    if (
      state.selectedTheme &&
      state.selectedTheme != state.loadedThemeDescription
    ) {
      getThemeDescription();
      setState({ ...state, loadedThemeDescription: state.selectedTheme });
    }
  }, [state.selectedTheme]);

  let themeSuggestion = useOpenAI();
  let themeDescription = useOpenAI();

  const getThemeSuggestions = () => {
    themeSuggestion.getThemeSuggestions({
      role: jobTitle,
    });
  };

  const getThemeDescription = () => {
    themeDescription.getThemeDescription({
      role: jobTitle,
      theme: state.selectedTheme,
    });
  };

  const onModalClose = () => {
    setState({ ...state, modalVisible: false, mode: null });
  };

  const addAchievement = () => {
    let newValue = value ? [...value] : [];
    newValue.push({
      theme: state.selectedTheme,
      description: state.currentAchievement,
    });

    onChange(newValue);
    setState({
      ...state,
      modalVisible: false,
      mode: null,
      currentAchievement: null,
      selectedTheme: null,
    });
  };

  return (
    <>
      <Modal
        width={600}
        closeIcon={true}
        open={state.modalVisible}
        footer={null}
        onCancel={onModalClose}
        zIndex={1050}
      >
        {/* {state.mode == "summary" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>Summary</Typography.Title>
              <Typography.Text type="secondary">
                Click one of following options to add
              </Typography.Text>
            </div>

            <Space direction="vertical">
              {openai.loading && (
                <div
                  style={{
                    minHeight: "400px",
                  }}
                >
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              )}
              {!openai.loading &&
                openai.data?.results?.map((item, key) => (
                  <div
                    key={key}
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item.content)}
                  >
                    {item.content.split("\n").map(
                      (item, index) =>
                        item && (
                          <span key={index}>
                            {item}
                            <br />
                          </span>
                        )
                    )}
                  </div>
                ))}
            </Space>
          </div>
        )}
        {state.mode == "rewrite" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>Rewrite</Typography.Title>
              <Typography.Text type="secondary">
                Click one of following options to add
              </Typography.Text>
            </div>

            <Space direction="vertical">
              {openai.loading && (
                <div
                  style={{
                    minHeight: "400px",
                  }}
                >
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              )}
              {!openai.loading &&
                openai.data?.results?.map((item) => (
                  <div
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item.content)}
                  >
                    {item.content}
                  </div>
                ))}
            </Space>
          </div>
        )} */}
        <Typography.Title level={5}>
          Selected Theme: {state.selectedTheme}
        </Typography.Title>

        {themeDescription.loading && (
          <div className="spin-container" style={{ height: "100px" }}>
            <Spin />
          </div>
        )}
        {!themeDescription.loading && (
          <>
            <Typography.Text type="secondary">
              {themeDescription.data}
            </Typography.Text>
            <Input.TextArea
              rows={3}
              style={{ marginTop: "1rem" }}
              onChange={(e) =>
                setState({ ...state, currentAchievement: e.target.value })
              }
            ></Input.TextArea>

            <Row style={{ marginTop: "1rem" }}>
              <Button
                onClick={() => {
                  addAchievement();
                }}
              >
                Save
              </Button>
            </Row>
          </>
        )}
      </Modal>
      <div style={{ paddingBottom: "1rem" }}>
        <Typography.Text type="secondary">
          Select topic to add achievements
        </Typography.Text>
        <Row>
          {themeSuggestion.loading && (
            <div className="spin-container">
              <Spin />
            </div>
          )}
          <Space wrap direction="horizontal">
            {!themeSuggestion.loading &&
              themeSuggestion.data &&
              themeSuggestion.data?.map((item, index) => (
                <Button
                  key={index}
                  type="text"
                  size="small"
                  onClick={() => {
                    setState({
                      ...state,
                      modalVisible: true,
                      selectedTheme: item,
                    });
                  }}
                >
                  {item}
                </Button>
              ))}
          </Space>
        </Row>
      </div>
      <div style={{ paddingBottom: "1rem" }}>
        {value && value.length > 0 && (
          <>
            <Typography.Text type="secondary">
              Added achievements
            </Typography.Text>{" "}
            {value.map((item, index) => (
              <div className="achievement-item" key={index}>
                <div className="achievement-item-header">
                  <Typography.Text type="secondary">
                    {item.theme}
                  </Typography.Text>
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={() => {
                      let newValue = [...value];
                      newValue.splice(index, 1);
                      onChange(newValue);
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
                <Typography.Text>{item.description}</Typography.Text>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Achievements;

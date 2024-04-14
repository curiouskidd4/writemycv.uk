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
import { useAuth } from "../../../contexts/authContext";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import dayjs from "dayjs";
import { objectId } from "../../../helpers";
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";
import showdown from "showdown";
import "./index.css";
import Markdown from "react-markdown";
import { MagicWandIcon, MagicWandLoading } from "../../../components/faIcons";

const AchievementStep1 = ({ selectedTheme, themeDescription, onSelect }) => {
  const [state, setState] = useState({});

  return (
    <>
      <Typography.Title level={5}>
        Selected Theme: {selectedTheme}
      </Typography.Title>

      {themeDescription.loading && (
        <div className="spin-container" style={{ height: "100px" }}>
          <Spin />
        </div>
      )}
      {!themeDescription.loading && (
        <>
          <Typography.Text type="secondary">
            {themeDescription.data?.result?.explanation}
          </Typography.Text>
          <div
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Typography.Text type="secondary">
              Select any of the following examples and update it as per your own
              achievement
            </Typography.Text>
            {themeDescription.data?.result?.examples?.map((item, index) => (
              <div
                key={index}
                type="text"
                className="openai-generated-content-item"
                onClick={() => onSelect(item)}
              >
                <Markdown>{item}</Markdown>
              </div>
            ))}
            <div
              key={"custom"}
              type="text"
              className="openai-generated-content-item"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  currentAchievement: "",
                }))
              }
            >
              Write your own
            </div>
          </div>
        </>
      )}
    </>
  );
};

const AchievementStep2 = ({ selectedTheme, achievement, onChange, onSave }) => {
  const [state, setState] = useState({
    wizardMode: null,
  });
  let openai = useOpenAI();
  const handleGenSummary = () => {
    setState({ ...state, wizardMode: "summary" });
    openai.getThemeDescription({
      theme: selectedTheme,
      existingAchievement: achievement,
    });
  };

  const handleRewrite = () => {
    setState({ ...state, wizardMode: "rewrite" });
    openai.getAchivementSuggestion({
      theme: selectedTheme,
      existingAchievement: achievement,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  const onSelectDescription = (value) => {
    onChange(value);
    setState({ ...state, wizardMode: null });
  };

  return (
    <>
      <Typography.Title level={5}>
        Selected Theme: {selectedTheme}
      </Typography.Title>

      <Row justify="end">
        <Col>
          <Popover
            zIndex={1050}
            placement="bottomRight"
            trigger={["click"]}
            content={
              <div>
                <Space direction="vertical">
                  <Typography.Text type="secondary">
                    Write with CV Wizard
                  </Typography.Text>{" "}
                  <Button type="link" size="small" onClick={handleRewrite}>
                    Rephrase and Optimise
                  </Button>
                  {/* <Button type="link" size="small">
                    Repharse with Instructions
                  </Button> */}
                  <Button type="link" size="small" onClick={handleGenSummary}>
                    Generate New Summary
                  </Button>
                </Space>
              </div>
            }
          >
            <Button type="link" size="small">
              <MagicWandIcon /> Write with CV Wizard
            </Button>
          </Popover>
        </Col>
      </Row>

      <Input.TextArea
        rows={3}
        style={{ marginTop: "0.25rem" }}
        value={achievement}
        onChange={(e) => onChange(e.target.value)}
      ></Input.TextArea>

      {state.wizardMode == "summary" && (
        <div
          style={{
            margin: "0.5rem 0",
          }}
        >
          <div
            style={{
              margin: "0.25rem 0",
            }}
          >
            <Typography.Text type="secondary">Suggestions</Typography.Text>
          </div>

          {openai.loading && (
            <div
              style={{
                width: "100%",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MagicWandLoading />
            </div>
          )}
          {!openai.loading &&
            openai.data?.result?.examples?.map((item, idx) => (
              <div
                key={idx}
                type="text"
                className="openai-generated-content-item"
                onClick={() => onSelectDescription(item)}
              >
                <Markdown>{item}</Markdown>
              </div>
            ))}
        </div>
      )}
      {state.wizardMode == "rewrite" && (
        <div
          style={{
            margin: "0.5rem 0",
          }}
        >
          <div
            style={{
              margin: "0.25rem 0",
            }}
          >
            <Typography.Text type="secondary">Suggestions</Typography.Text>
          </div>
          {openai.loading && (
            <div
              style={{
                width: "100%",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MagicWandLoading />
            </div>
          )}
          {!openai.loading &&
            openai.data?.result?.examples?.map((item) => (
              <div
                type="text"
                className="openai-generated-content-item"
                onClick={() => onSelectDescription(item)}
              >
                <Markdown>{item}</Markdown>
              </div>
            ))}
        </div>
      )}
      <Row style={{ marginTop: "1rem" }}>
        <Button
          onClick={() => {
            onSave();
          }}
        >
          Save
        </Button>
      </Row>
    </>
  );
};

const Achievements = (props) => {
  const { jobTitle, description, value, onChange } = props
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
    let mode = (state.editIdx != null || state.editIdx != undefined) ? "edit" : "add";
    if (mode == "edit") {
      // Update the value
      value[state.editIdx] = {
        theme: state.selectedTheme || "",
        description: state.currentAchievement,
      };
      onChange(value);
      setState({
        ...state,
        modalVisible: false,
        mode: null,
        currentAchievement: null,
        selectedTheme: null,
      });
    } else {
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
    }
  };

  const onEditAchievement = (index) => {
    setState({
      ...state,
      modalVisible: true,
      selectedTheme: value[index].theme,
      currentAchievement: value[index].description,
      isAtStep1: false,
      editIdx: index,
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
        {state.isAtStep1 && (
          <AchievementStep1
            selectedTheme={state.selectedTheme}
            themeDescription={themeDescription}
            onSelect={(item) => {
              setState({
                ...state,
                isAtStep1: false,
                currentAchievement: item,
              });
            }}
          />
        )}
        {!state.isAtStep1 && (
          <AchievementStep2
            selectedTheme={state.selectedTheme}
            achievement={state.currentAchievement}
            onChange={(value) => {
              setState({
                ...state,
                currentAchievement: value,
              });
            }}
            onSave={() => {
              addAchievement();
            }}
          />
        )}
      </Modal>
      <div style={{ paddingBottom: "1rem" }}>
        <Typography.Title level={5}>Achievements</Typography.Title>
        <div
          style={{
            marginBottom: "0.5rem",
          }}
        >
          <Typography.Text type="secondary">
            Fill your CV with achievements! Here are a list of themes that
            relate to your experience – click on each one and write about your
            successes. Don't forget to use CV Wizard to make it perfect!
          </Typography.Text>
        </div>
        <Row>
          {themeSuggestion.loading && (
            <div className="spin-container">
              <Spin />
            </div>
          )}
          <Space wrap direction="horizontal">
            {!themeSuggestion.loading &&
              themeSuggestion.data &&
              themeSuggestion.data?.result?.map((item, index) => (
                <Button
                  key={index}
                  // type="text"
                  size="small"
                  onClick={() => {
                    setState({
                      ...state,
                      modalVisible: true,
                      selectedTheme: item,
                      isAtStep1: true,
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
                  <div>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        onEditAchievement(index);
                      }}
                    >
                      <EditOutlined />
                    </Button>
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

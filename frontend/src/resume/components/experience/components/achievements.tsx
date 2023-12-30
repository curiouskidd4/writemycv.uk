import React, { useEffect, useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useOpenAI } from "../../../../utils";
import Markdown from "react-markdown";
import {
  AIWizardHideIcon,
  MagicWandIcon,
  MagicWandLoading,
} from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBox";
import { Achievement } from "../../../../types/resume";
import CustomCarousel from "../../../../components/suggestionCarousel";

type AchievementStep1Props = {
  selectedTheme: string | null;
  themeDescription: any;
  onSelect: (value: string) => void;
};
const AchievementStep1 = ({
  selectedTheme,
  themeDescription,
  onSelect,
}: AchievementStep1Props) => {
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
            {themeDescription.data?.result?.examples?.map(
              (item: string, index: number) => (
                <div
                  key={index}
                  className="openai-generated-content-item"
                  onClick={() => onSelect(item)}
                >
                  <Markdown>{item}</Markdown>
                </div>
              )
            )}
            <div
              key={"custom"}
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

type AchievementStep2Props = {
  selectedTheme: string | null;
  achievement: string;
  onChange: (value: string) => void;
  onSave: () => void;
};
const AchievementStep2 = ({
  selectedTheme,
  achievement,
  onChange,
  onSave,
}: AchievementStep2Props) => {
  type _state = {
    wizardMode: string | null;
  };
  const [state, setState] = useState<_state>({
    wizardMode: null,
  });
  let openai = useOpenAI();
  const handleGenSummary = () => {
    setState((prev) => ({ ...prev, wizardMode: "summary" }));
    openai.getThemeDescription({
      theme: selectedTheme,
      existingAchievement: achievement,
    });
  };

  const handleRewrite = () => {
    setState((prev) => ({ ...prev, wizardMode: "rewrite" }));
    openai.getAchivementSuggestion({
      theme: selectedTheme,
      existingAchievement: achievement,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  const onSelectDescription = (value: string) => {
    onChange(value);
    setState((prev) => ({ ...prev, wizardMode: null }));
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
            openai.data?.result?.examples?.map((item: string, idx: number) => (
              <div
                key={idx}
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
            openai.data?.result?.examples?.map((item: string, idx: number) => (
              <div
                key={idx}
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

const AchievementThemeWizard = ({
  showAIWizard,
  jobTitle,
  existingAchievements,
  onHide,
  onSelect,
}: {
  showAIWizard: boolean;
  jobTitle: string;
  existingAchievements: Achievement[];
  onSelect: (value: string) => void;
  onHide: () => void;
}) => {
  let themeSuggestion = useOpenAI();

  // console.log("themeSuggestion.data?.result", themeSuggestion.data?.result);
  useEffect(() => {
    if (showAIWizard) {
      themeSuggestion.getThemeSuggestions({ role: jobTitle });
    }
  }, [showAIWizard]);

  console.log("showAIWizard", showAIWizard)
  return showAIWizard ? (
    <CVWizardBox>
      <>
        <Row>
          <Col>
            <Typography.Text type="secondary">
              <MagicWandIcon /> CV Wizard Suggestions:
            </Typography.Text>
          </Col>
          <Col
            style={{
              marginLeft: "auto",
            }}
          >
            <Button
              type="link"
              size="small"
              onClick={() => {
                onHide();
              }}
            >
              <AIWizardHideIcon /> Hide
            </Button>
          </Col>
        </Row>
        <Row>
          <Typography.Text type="secondary">
            Select your theme to get started
          </Typography.Text>
        </Row>
      </>
      <Row>
        {themeSuggestion.loading && (
          <div className="spin-container">
            <Spin />
          </div>
        )}
        <Space wrap direction="horizontal">
          {!themeSuggestion.loading &&
            themeSuggestion.data &&
            themeSuggestion.data?.result?.map((item: string, index: number) => (
              <Button
                key={index}
                size="small"
                onClick={() => {
                  onSelect(item);
                }}
              >
                {item.replace('"', "").replace('"', "")}
              </Button>
            ))}
        </Space>
      </Row>
    </CVWizardBox>
  ) : null;
};

const AchievementRewrite = ({
  achievement,
  onSelect,
}: {
  achievement: string;
  onSelect: (value: string) => void;
}) => {
  useEffect(() => {
    handleRewrite();
  }, []);
  let openai = useOpenAI();

  const handleRewrite = () => {
    // setState((prev) => ({ ...prev, wizardMode: "rewrite" }));
    openai.getAchivementSuggestion({
      theme: "",
      existingAchievement: achievement,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  return (
    <CVWizardBox>
      <Row>
        <Typography.Text type="secondary">
          <MagicWandIcon /> CV Wizard Suggestions:
        </Typography.Text>
      </Row>

      {openai.loading && <Skeleton active></Skeleton>}

      <Row
        style={{
          width: "100%",
          // width: "500px"
        }}
      >
        {/* {openai.data?.result?.examples &&
          openai.data?.result?.examples.map((item: string, index: number) => (
            <Col
              key={index}
              span={24}
              style={{
                width: "100%",
              }}
            >
              <Button
                type="text"
                size="small"
                onClick={() => {
                  onSelect(item);
                }}
              >
                {item}
              </Button>
            </Col>
          ))} */}
        {openai.data?.result?.examples && (
          <CustomCarousel
            suggestions={openai.data?.result?.examples}
            onClick={(value) => {
              onSelect(value);
            }}
          />
        )}
      </Row>
    </CVWizardBox>
  );
};

const AchievementCard = ({
  item,
  onEditAchievement,
  index,
  onDelete,
}: {
  item: Achievement;
  index: number;
  onEditAchievement: (index: number) => void;
  onDelete: (index: number) => void;
}) => {
  const [state, setState] = useState<{
    showAIWizard: boolean;
  }>({ showAIWizard: false });

  const achievementSuggestion = useOpenAI();

  const loadSuggestions = () => {
    setState((prev) => ({ ...prev, showAIWizard: true }));
    achievementSuggestion.getAchivementSuggestion({
      theme: item.theme,
      existingAchievement: item.description,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  return (
    <Row
      style={{
        width: "100%",
      }}
    >
      <div className="achievement-item">
        <div className="achievement-item-header">
          <Typography.Text type="secondary">{item.theme}</Typography.Text>
          <div>
            <Button type="link" size="small" onClick={loadSuggestions}>
              <MagicWandIcon />
            </Button>
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
              onClick={() => onDelete(index)}
            >
              <DeleteOutlined />
            </Button>
          </div>
        </div>
        <Typography.Text>{item.description}</Typography.Text>

        {state.showAIWizard && (
          <AchievementRewrite
            achievement={item.description}
            onSelect={(value) => {
              setState((prev) => ({ ...prev, showAIWizard: false }));
              // onEditAchievement(index);
            }}
          />
        )}
      </div>
    </Row>
  );
};
type AchievementsProps = {
  jobTitle: string;
  description?: string;
  value?: any;
  onChange?: (value: any) => void;
};

type AchievementStateType = {
  modalVisible: boolean;
  mode: string | null;
  loadedTheme: string | null;
  loadedThemeDescription: string | null;
  currentAchievement: string | null;
  selectedTheme: string | null;
  editIdx: number | null;
  isAtStep1?: boolean | null;
  showAIWizard: boolean;
};
const Achievements = ({
  jobTitle,
  description,
  value,
  onChange,
}: AchievementsProps) => {
  // AI Actions helper
  const [state, setState] = useState<AchievementStateType>({
    modalVisible: false,
    mode: null,
    loadedTheme: null,
    loadedThemeDescription: null,
    currentAchievement: null,
    selectedTheme: null,
    editIdx: null,
    showAIWizard: false,
  });

  useEffect(() => {
    if (jobTitle && jobTitle != state.loadedTheme) {
      getThemeSuggestions();
      setState((prev) => ({ ...prev, loadedTheme: jobTitle }));
    }
  }, [jobTitle]);

  useEffect(() => {
    if (
      state.selectedTheme &&
      state.selectedTheme != state.loadedThemeDescription
    ) {
      getThemeDescription();
      setState((prev) => ({
        ...prev,
        loadedThemeDescription: state.selectedTheme,
      }));
    }
  }, [state.selectedTheme]);

  let themeSuggestion = useOpenAI();
  let themeDescription = useOpenAI();

  const getThemeSuggestions = () => {
    setState((prev) => ({ ...prev, showAIWizard: true }));
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
    setState((prev) => ({
      ...prev,
      modalVisible: false,
      mode: null,
      isAtStep1: true,
    }));
  };

  const addAchievement = () => {
    let mode =
      state.editIdx != null || state.editIdx != undefined ? "edit" : "add";
    if (mode == "edit") {
      if (state.editIdx == null) {
        return;
      }
      // Update the value
      value[state.editIdx] = {
        theme: state.selectedTheme || "",
        description: state.currentAchievement,
      };
      if (onChange) {
        onChange(value);
      }
      setState((prev) => ({
        ...prev,
        modalVisible: false,
        mode: null,
        currentAchievement: null,
        selectedTheme: null,
      }));
    } else {
      let newValue = value ? [...value] : [];
      newValue.push({
        theme: state.selectedTheme,
        description: state.currentAchievement,
      });

      if (onChange) {
        onChange(newValue);
      }
      setState((prev) => ({
        ...prev,
        modalVisible: false,
        mode: null,
        currentAchievement: null,
        selectedTheme: null,
      }));
    }
  };

  const onEditAchievement = (index: number) => {
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      selectedTheme: value[index].theme,
      currentAchievement: value[index].description,
      isAtStep1: false,
      editIdx: index,
    }));
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
              setState((prev) => ({
                ...prev,
                isAtStep1: false,
                currentAchievement: item,
              }));
            }}
          />
        )}
        {!state.isAtStep1 && (
          <AchievementStep2
            selectedTheme={state.selectedTheme}
            achievement={
              state.currentAchievement ? state.currentAchievement : ""
            }
            onChange={(value) => {
              setState((prev) => ({
                ...prev,
                currentAchievement: value,
              }));
            }}
            onSave={() => {
              addAchievement();
            }}
          />
        )}
      </Modal>
      <Row style={{ paddingBottom: "1rem", width: "100%" }}>
        <Row style={{ width: "100%" }}>
          <Col>
            <Typography.Title level={5}>Achievements</Typography.Title>
          </Col>
          <Col
            style={{
              marginLeft: "auto",
            }}
          >
            <Button type="link" size="small">
              <MagicWandIcon /> CV Wizard
            </Button>
          </Col>
        </Row>
        <Row
          style={{
            marginBottom: "0.5rem",
          }}
        >
          <Typography.Text type="secondary">
            Fill your CV with achievements! Here are a list of themes that
            relate to your experience – click on each one and write about your
            successes. Don't forget to use CV Wizard to make it perfect!
          </Typography.Text>

          <AchievementThemeWizard
            jobTitle={jobTitle}
            showAIWizard={state.showAIWizard}
            existingAchievements={value}
            onHide={() => {
              setState((prev) => ({ ...prev, showAIWizard: false }));
            }}
            onSelect={(value) => {
              setState((prev) => ({
                ...prev,
                selectedTheme: value,
                modalVisible: true,
                isAtStep1: true,
                // showAIWizard: false,
              }));
            }}
          />
        </Row>
      </Row>
      <Row style={{ paddingBottom: "1rem" }}>
        {value && value.length > 0 && (
          <>
            <Row
              style={{
                width: "100%",
              }}
            >
              <Typography.Text type="secondary">
                Added achievements
              </Typography.Text>{" "}
            </Row>

            {value.map((item: any, index: number) => (
              // <div className="achievement-item" key={index}>
              //   <div className="achievement-item-header">
              //     <Typography.Text type="secondary">
              //       {item.theme}
              //     </Typography.Text>
              //     <div>
              //       <Button type="link" size="small">
              //         <MagicWandIcon />
              //       </Button>
              //       <Button
              //         type="link"
              //         size="small"
              //         onClick={() => {
              //           onEditAchievement(index);
              //         }}
              //       >
              //         <EditOutlined />
              //       </Button>
              //       <Button
              //         type="link"
              //         size="small"
              //         danger
              //         onClick={() => {
              //           let newValue = [...value];
              //           newValue.splice(index, 1);
              //           if (onChange) {
              //             onChange(newValue);
              //           }
              //         }}
              //       >
              //         <DeleteOutlined />
              //       </Button>
              //     </div>
              //   </div>
              //   <Typography.Text>{item.description}</Typography.Text>
              // </div>
              <AchievementCard
                key={index}
                item={item}
                index={index}
                onEditAchievement={onEditAchievement}
                onDelete={(index) => {
                  let newValue = [...value];
                  newValue.splice(index, 1);
                  if (onChange) {
                    onChange(newValue);
                  }
                }}
              />
            ))}
          </>
        )}
      </Row>
    </>
  );
};

export default Achievements;

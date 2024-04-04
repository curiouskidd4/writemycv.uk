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
  Divider,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useOpenAI } from "../../../../utils";
import Markdown from "react-markdown";
import {
  AIWizardHideIcon,
  AIWizardIcon,
  DeleteIcon,
  EditIcon,
  MagicWandIcon,
  MagicWandLoading,
} from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBoxV2";
import { Achievement } from "../../../../types/resume";
import CustomCarousel from "../../../../components/suggestionCarousel";
import CVWizardBadge from "../../../../components/cvWizardBadge";
import { PlusOutlined } from "@ant-design/icons";
import SortableComponent from "../../../../components/sortableList";
import ObjectID from "bson-objectid";
import "./achievement.css";
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
      <div>
        <div className="">
          <CVWizardBadge />
        </div>
        <div
          className="profile-input-section-title"
          style={{
            margin: "1rem 0rem",
            font: "normal normal bold 24px/12px DM Sans",
          }}
        >
          {selectedTheme ? `Selected Theme: ${selectedTheme}` : "Achievement"}
        </div>
      </div>

      {themeDescription.loading && (
        <div className="spin-container" style={{ height: "100px" }}>
          <Spin />
        </div>
      )}
      {!themeDescription.loading && (
        <>
          <div
            className=""
            style={{
              backgroundColor: "var(--accent-2-lighter)",
              borderRadius: "10px",
              padding: "20px",
              font: "normal normal normal 14px/22px DM Sans;",
            }}
          >
            <Typography.Text>
              {/* {themeDescription.data?.result?.explanation}
               */}
              {selectedTheme
                ? `When describing achievements in ${selectedTheme}, start
              with the impact created, followed by the action taken. Use past
              tense and third-person narrative. Avoid exaggerations however do
              use strong action verbs such as 'developed', 'increased', or
              'transformed'.`
                : `When describing achievements, start
              with the impact created, followed by the action taken. Use past
              tense and third-person narrative. Avoid exaggerations however do
              use strong action verbs such as 'developed', 'increased', or
              'transformed'.`}
            </Typography.Text>
          </div>
          <div
            style={{
              margin: "1rem 0rem",
              font: "normal normal normal 16px/24px DM Sans",
            }}
          >
            You can choose one of these examples and amend it to reflect your personal achievements, or you can write your own.
          </div>
          <div>
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
                // setState((prev) => ({
                //   ...prev,
                //   currentAchievement: "",
                // }))
                onSelect("")
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
  loadWizardSuggestions: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
};
const AchievementStep2 = ({
  selectedTheme,
  achievement,
  loadWizardSuggestions,
  onChange,
  onSave,
}: AchievementStep2Props) => {
  type _state = {
    wizardMode: string | null;
  };
  const [state, setState] = useState<_state>({
    wizardMode: null,
  });

  useEffect(() => {
    if (loadWizardSuggestions) {
      handleRewrite();
    }
  }, []);

  let openai = useOpenAI();

  // const handleGenSummary = () => {
  //   setState((prev) => ({ ...prev, wizardMode: "summary" }));
  //   openai.getThemeDescription({
  //     theme: selectedTheme,
  //     existingAchievement: achievement,
  //   });
  // };

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
      {/* <Typography.Title level={5}>
        Selected Theme: {selectedTheme}
      </Typography.Title> */}

      <div>
        <div className="">
          <CVWizardBadge />
        </div>
        <Row justify="space-between" align="middle">
          <div
            className="profile-input-section-title"
            style={{
              margin: "1rem 0rem",
              font: "normal normal bold 24px/12px DM Sans",
            }}
          >
            {selectedTheme ? `Selected Theme: ${selectedTheme}` : "Achievement"}
          </div>
          <Button
            type="primary"
            size="small"
            onClick={handleRewrite}
            className="black-button-small"
          >
            <MagicWandIcon color="white" /> Rephrase
          </Button>
        </Row>
      </div>

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
              margin: "1rem 0",
            }}
          >
            Select any of the following suggestions:
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
          className="black-button"
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

  return showAIWizard ? (
    <CVWizardBox
      title="Tip"
      subtitle="This section should include details of your top 3-8 achievements in this role. This could be strategies, projects, or initiatives you delivered or helped to deliver that had a positive impact on the organisation. If possible, measure the success using facts and figures."
    >
      <>
        {/* <Row>
          <Col>
            <Typography.Text type="secondary">
              CV Wizard Suggestions:
            </Typography.Text>
          </Col>
        </Row> */}
        <Row
          style={{
            paddingBottom: "0.5rem",
          }}
        >
          <Typography.Text type="secondary">
            Here are themes that may be relevant to this role. Select one and
            our CV Wizard will help you.
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
    <CVWizardBox title="Achievement Suggestion" subtitle="">
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

const AllAchievements = (
  value: any,
  onChange: (value: any) => void,
  onEditAchievement: (id: string) => void,
  onRephraseAchievement: (id: string) => void
) => {
  const renderFn = (item: any, dragHandle: any) => {
    return (
      <>
        <Row align="top" className="achievement-item" wrap={false}>
          <Col
            flex="24px"
            style={{
              paddingTop: "4px",
            }}
          >
            {dragHandle}
          </Col>
          <Col flex="auto">
            <AchievementCard
              key={item.id}
              item={item}
              onEditAchievement={onEditAchievement}
              onRephraseAchievement={onRephraseAchievement}
              onDelete={(id) => {
                let newValue = [...value];
                newValue = newValue.filter((item: any) => item.id !== id);
                onChange(newValue);
              }}
            />
          </Col>
        </Row>
        <Divider style={{ margin: "0.5rem 0" }} />
      </>
    );
  };
  return (
    <>
      <SortableComponent
        items={value}
        renderFn={renderFn}
        onReorder={(newOrder: any) => {
          onChange(newOrder);
        }}
      />
    </>
  );
};
const AchievementCard = ({
  item,
  onEditAchievement,
  onRephraseAchievement,
  onDelete,
}: {
  item: Achievement;
  onEditAchievement: (id: string) => void;
  onRephraseAchievement: (id: string) => void;
  onDelete: (id: string) => void;
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
    <
      // style={{
      //   width: "100%",
      // }}
    >
      <div className="achievement-options">
        <Space
          size="small"
          direction="horizontal"
          split={
            <Divider
              type="vertical"
              style={{
                height: "24px",
                margin: "0 0rem",
                borderInlineStart: "1px solid var(--black)",
                borderBlockStart: "1px solid var(--black)",
              }}
            />
          }
        >
          <Button
            type="link"
            size="small"
            onClick={() => {
              onRephraseAchievement(item.id!);
            }}
          >
            <MagicWandIcon color="var(--black)" marginRight="0px" />
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              onEditAchievement(item.id!);
            }}
          >
            <EditIcon color="var(--black)" marginRight="0px" />
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => onDelete(item.id!)}
          >
            <DeleteIcon color="var(--black)" marginRight="0px" />
          </Button>
        </Space>
      </div>
      <div>
        <div className="achievement-item-header">
          <Typography.Text type="secondary"></Typography.Text>
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
    </>
  );
};
type AchievementsProps = {
  jobTitle: string;
  description?: string;
  value: any;
  onChange: (value: any) => void;
};

type AchievementStateType = {
  modalVisible: boolean;
  mode: string | null;
  loadedTheme: string | null;
  loadedThemeDescription: string | null;
  currentAchievement: string | null;
  loadWizardSuggestions: boolean;
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
  // Add id if not present
  value = value?.map((item: any, idx: number) => {
    return {
      ...item,
      id: item.id || ObjectID().toHexString(),
    };
  });
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
    loadWizardSuggestions: false,
  });

  useEffect(() => {
    if (jobTitle && jobTitle !== state.loadedTheme) {
      getThemeSuggestions();
      setState((prev) => ({ ...prev, loadedTheme: jobTitle }));
    }
  }, [jobTitle]);

  useEffect(() => {
    if (
      state.selectedTheme &&
      state.selectedTheme !== state.loadedThemeDescription
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
      state.editIdx != null && state.editIdx !== undefined ? "edit" : "add";
    if (mode === "edit") {
      if (state.editIdx == null) {
        return;
      }
      // Update the value
      value[state.editIdx] = {
        theme: state.selectedTheme || "",
        description: state.currentAchievement,
      };
      onChange(value);
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
        id: ObjectID().toHexString(),
        theme: state.selectedTheme,
        description: state.currentAchievement,
      });

      onChange(newValue);
      setState((prev) => ({
        ...prev,
        modalVisible: false,
        mode: null,
        currentAchievement: null,
        selectedTheme: null,
      }));
    }
  };

  const onEditAchievement = (id: string) => {
    let index = value.findIndex((item: any) => item.id === id);
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      selectedTheme: value[index].theme,
      currentAchievement: value[index].description,
      isAtStep1: false,
      editIdx: index,
    }));
  };

  const onRephraseAchievement = (id: string) => {
    let index = value.findIndex((item: any) => item.id === id);
    setState((prev) => ({
      ...prev,
      modalVisible: true,
      selectedTheme: value[index].theme,
      currentAchievement: value[index].description,
      isAtStep1: false,
      loadWizard: true,
      loadWizardSuggestions: true,
      editIdx: index,
    }));
  };

  return (
    <>
      <Modal
        width={800}
        closeIcon={true}
        open={state.modalVisible}
        footer={null}
        onCancel={onModalClose}
        zIndex={1050}
        className="default-modal"
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
            loadWizardSuggestions={state.loadWizardSuggestions}
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
      <div className="profile-tab-detail">
        <div className="user-input-area">
          <div className="profile-input-section-title">
            <Typography.Text strong>Achievements</Typography.Text>
            <Button type="link" size="small">
              <AIWizardIcon />
            </Button>
          </div>

          {/* <Row style={{ paddingBottom: "1rem", width: "100%" }}>
            <Row
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Typography.Text type="secondary">
                Fill your CV with achievements! Here are a list of themes that
                relate to your experience – click on each one and write about
                your successes. Don't forget to use CV Wizard to make it
                perfect!
              </Typography.Text>
            </Row>
          </Row> */}
          <Row style={{ paddingBottom: "1rem" }} className="all-achievements">
            {value && value.length > 0 && (
              <>
                {/* <Row
                  style={{
                    width: "100%",
                  }}
                >
                  <Typography.Text type="secondary">
                    Added achievements
                  </Typography.Text>{" "}
                </Row> */}

                {/* {value.map((item: any, index: number) => (
                  <AchievementCard
                    key={index}
                    item={item}
                    index={index}
                    onEditAchievement={onEditAchievement}
                    onDelete={(index) => {
                      let newValue = [...value];
                      newValue.splice(index, 1);
                      onChange(newValue);
                    }}
                  />
                ))} */}
                {AllAchievements(
                  value,
                  onChange,
                  onEditAchievement,
                  onRephraseAchievement
                )}
              </>
            )}
          </Row>
          <Button
            type="link"
            className="small-link-btn"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                modalVisible: true,
                isAtStep1: false,
              }));
            }}
          >
            <PlusOutlined />
            Add New
          </Button>
        </div>
        <div className="ai-wizard-area">
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
        </div>
      </div>
    </>
  );
};

export default Achievements;

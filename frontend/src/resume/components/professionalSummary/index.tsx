import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import { useOpenAI } from "../../../utils";
import {
  AIWizardIcon,
  DeleteIcon,
  LightBulbIcon,
  MagicWandIcon,
  MagicWandLoading,
  RepharseIcon,
} from "../../../components/faIcons";
import {
  PlusOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Skill } from "../../../types/resume";
import EditorJsInput from "../../../components/editor";
import FormLabel from "../../../components/labelWithActions";
import { useResume } from "../../../contexts/resume";
import CustomCarousel from "../../../components/suggestionCarousel";
import CVWizardBox from "../../../components/cvWizardBoxV2";
import openAI from "../../../hooks/cvWizard";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import CVWizardBadge from "../../../components/cvWizardBadge";

type FormLabelWithAIActionProps = {
  resumeId: string;
  description: string;
  onAdd: (value: string) => void;
};

type FormStateType = {
  modalVisible: boolean;
  mode: string | null;
};

const FormLabelWithAIActions = ({
  resumeId,
  description,
  onAdd,
}: FormLabelWithAIActionProps) => {
  // AI Actions helper
  const [state, setState] = useState<FormStateType>({
    modalVisible: false,
    mode: null,
  });

  const [showAIWizard, setShowAIWizard] = useState(false);

  let openai = useOpenAI();
  const handleGenSummary = () => {
    setState({ ...state, modalVisible: true, mode: "summary" });
    openai.getProfessionalSummary({
      resumeId: resumeId,
      generateFromProfile: resumeId ? false : true,
      existingSummary: description,
    });
  };

  const handleRewrite = () => {
    setState({ ...state, modalVisible: true, mode: "rewrite" });
    openai.getProfessionalSummary({
      resumeId: resumeId,
      generateFromProfile: resumeId ? false : true,
      existingSummary: description,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  const onModalClose = () => {
    setState({ ...state, modalVisible: false, mode: null });
  };

  const onSelectDescription = (value: string) => {
    onAdd(value);
    onModalClose();
  };

  return (
    <>
      {/* <Modal
        width={600}
        closeIcon={true}
        open={state.modalVisible}
        footer={null}
        onCancel={onModalClose}
        zIndex={1050}
      >
        {state.mode == "summary" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>New Summary</Typography.Title>
              <Typography.Text type="secondary">
                Here are some fresh ideas for summary! Click one of following
                options to add
              </Typography.Text>
            </div>

            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              {openai.loading && (
                <div
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MagicWandLoading />
                </div>
              )}
              {!openai.loading &&
                openai.data &&
                openai.data?.result.map((item: any, key: number) => (
                  <div
                    key={key}
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item)}
                  >
                    {item.split("\n").map(
                      (item: string, index: number) =>
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
              <Typography.Title level={4}>
                Rephrase and Optimise
              </Typography.Title>
              <Typography.Text type="secondary">
                Let’s make sure your summary is word perfect! Click one of
                following options to add
              </Typography.Text>
            </div>

            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              {openai.loading && (
                <div
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MagicWandLoading />
                </div>
              )}
              {!openai.loading &&
                openai.data?.result.map((item: any) => (
                  <div
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item)}
                  >
                    {item.split("\n").map(
                      (item: string, index: number) =>
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
      </Modal> */}
      {/* <Row>
        {openai.data || openai.loading ? (
          <CVWizardBox>
            <Typography.Text type="secondary">
              <MagicWandIcon /> CV Wizard Suggestions:
            </Typography.Text>
            {openai.loading && <Skeleton active></Skeleton>}
            {openai.loading === false && openai.data!.result.length > 0 && (
              // <Carousel>
              //   {descriptionHelper.descriptionSuggestions!.results.map(
              //     (item: any, idx: number) => (
              //       <div
              //         className="openai-generated-content-item"
              //         onClick={() => onAddDescription(item)}
              //       >
              //         {item}
              //       </div>
              //     )
              //   )}
              // </Carousel>
              <CustomCarousel
                suggestions={openai.data.result}
                onClick={(item: any) => onSelectDescription(item)}
              />
            )}
          </CVWizardBox>
        ) : null}
      </Row> */}
      <FormLabel
        action={
          // <Popover
          //   placement="bottomRight"
          //   trigger={["click"]}
          //   content={
          //     <div>
          //       <Space direction="vertical">
          //         <Typography.Text type="secondary">
          //           Write with CV Wizard
          //         </Typography.Text>
          //         <Button
          //           type="link"
          //           size="small"
          //           disabled={
          //             description && description.length > 20 ? false : true
          //           }
          //           onClick={handleRewrite}
          //         >
          //           Rephrase and Optimise
          //         </Button>

          //         <Button type="link" size="small" onClick={handleGenSummary}>
          //           Generate New Summary
          //         </Button>
          //       </Space>
          //     </div>
          //   }
          // >
          //   <Button type="link" size="small">
          //     <MagicWandIcon /> Write with CV Wizard
          //   </Button>
          // </Popover>

          <Popover
            placement="topRight"
            trigger="click"
            content={
              <Space direction="vertical">
                <Button
                  type="text"
                  // size="small"
                  style={{
                    height: "auto",
                    textAlign: "left",
                  }}
                  disabled={
                    description && description.length > 20 ? false : true
                  }
                  onClick={() => {
                    // loadSuggestions({
                    //   employerName: initialValues?.employerName,
                    //   position: initialValues?.position,
                    //   rewrite: true,
                    //   existingDesscription: description,
                    // });
                    handleRewrite();
                  }}
                >
                  <Typography.Text strong>
                    {" "}
                    <RepharseIcon /> Optimize
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    Rephrase and optimize your current description
                  </Typography.Text>
                </Button>
                <Button
                  type="text"
                  style={{
                    height: "auto",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onClick={() => {
                    // loadSuggestions({
                    //   employerName: initialValues?.employerName,
                    //   position: initialValues?.position,
                    //   rewrite: false,
                    // });
                    handleGenSummary();
                  }}
                >
                  <Typography.Text strong>
                    {" "}
                    <LightBulbIcon /> Generate new ideas
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    Get new ideas for the desciption
                  </Typography.Text>
                </Button>
              </Space>
            }
          >
            <Button type="link" size="small">
              <MagicWandIcon /> Write with CV Wizard
            </Button>
          </Popover>
        }
        label={""}
        required={true}
      />
    </>
  );
};

type DummyInputProps = {
  resumeId: string | undefined;
  onAdd: (value: string) => void;
};
const DummyInput = ({ resumeId, onAdd, ...rest }: DummyInputProps) => {
  const value = (rest as any).value;
  return (
    <>
      <FormLabelWithAIActions
        description={value}
        onAdd={onAdd}
        resumeId={resumeId ? resumeId : ""}
      />
      {/* <Input.TextArea rows={3} {...rest} value={value} />
       */}
      <EditorJsInput value={value} {...rest} />
    </>
  );
};

const ProfessionalSummaryFlow = ({
  professionalSummary,
  // onFinish,
  syncProfessionalSummary,
}: {
  professionalSummary: string;
  onFinish: (value: string) => void;
  syncProfessionalSummary: (value: string) => Promise<void>;
}) => {
  const resume = useResume();
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [state, setState] = React.useState({
    loading: false,
    showSaved: false,
    summary: professionalSummary,
  });


  const debounceSave = useCallback(
    _.debounce(async (val: any) => {
      await syncProfessionalSummary(val);
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000),
    []
  );

  const onAdd = (value: string) => {
    setState({ ...state, summary: value });
  };



  useEffect(() => {
    // Check if the summary has changed
    if (state.summary !== professionalSummary) {
      setState({ ...state, loading: true, showSaved: true });
      debounceSave(state.summary);

    }
  }, [state.summary]);

  const descriptionHelper = openAI.useProfessionalSummaryHelper();
  const loadSuggestions = async ({ rewrite }: { rewrite: boolean }) => {
    setShowAIWizard(true);
    await descriptionHelper.getSuggestions({
      existingSummary: state.summary || "",
      numberSuggestions: 3,
      rewrite: rewrite,
    });
  };

  return (
    <>
      <Modal
        width={800}
        visible={showAIWizard}
        footer={null}
        onCancel={() => setShowAIWizard(false)}
        className="default-modal"
      >
        <CVWizardBadge />
        <div
          style={{
            margin: "1rem 0rem",
            font: "normal normal bold 24px/12px DM Sans",
          }}
        >
          Description Suggestion
        </div>
        {descriptionHelper.loading && (
          <div className="spin-container" style={{ height: "100px" }}>
            <Spin />
          </div>
        )}

        {descriptionHelper.loading === false &&
          descriptionHelper.suggestions &&
          descriptionHelper.suggestions.result.length > 0 && (
            <>
              <div
                style={{
                  margin: "1rem 0rem",
                  font: "normal normal normal 16px/24px DM Sans",
                }}
              >
                Select any of the following suggestions
              </div>
              <div>
                {descriptionHelper.suggestions?.result?.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="openai-generated-content-item"
                      onClick={() => {
                        onAdd(item);
                        setShowAIWizard(false);
                      }}
                    >
                      <ReactMarkdown>{item}</ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            </>
          )}
      </Modal>
      <div className="resume-edit-detail padding">
        <Row  align="middle" justify="space-between" >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "70%",
              paddingRight: "50px"
            }}
          >
            <div className="profile-input-section-title">
              <Typography.Title
                level={4}
                style={{
                  marginBottom: "0px",
                }}
              >
                Professional Summary
              </Typography.Title>
              <Popover
                placement="topLeft"
                trigger="click"
                content={
                  <Space direction="vertical">
                    <Button
                      type="text"
                      // size="small"
                      style={{
                        height: "auto",
                        textAlign: "left",
                      }}
                      disabled={
                        state.summary && state.summary.length > 20
                          ? false
                          : true
                      }
                      onClick={() => {
                        loadSuggestions({
                          rewrite: true,
                        });
                      }}
                    >
                      <Typography.Text strong>
                        {" "}
                        <RepharseIcon /> Optimize
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        Rephrase and optimize your current description
                      </Typography.Text>
                    </Button>
                    <Button
                      type="text"
                      style={{
                        height: "auto",
                        textAlign: "left",
                        width: "100%",
                      }}
                      onClick={() => {
                        loadSuggestions({
                          rewrite: false,
                        });
                      }}
                    >
                      <Typography.Text strong>
                        {" "}
                        <LightBulbIcon /> Generate new ideas
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        Get new ideas for the desciption
                      </Typography.Text>
                    </Button>
                  </Space>
                }
              >
                <Button type="link">
                  <AIWizardIcon />
                </Button>
              </Popover>
            </div>
            {state.loading && state.showSaved ? (
              <div className="auto-save-label-loading">
                Saving changes <i className="fa-solid fa-cloud fa-beat"></i>
              </div>
            ) : state.showSaved ? (
              <div className="auto-save-label-success">
                Saved <i className="fa-solid fa-cloud"></i>
              </div>
            ) : null}
          </div>
        </Row>

        <Row gutter={24} className="description-input">
          <Col span={24}>
            <div className="profile-tab-detail">
              <div className="user-input-area">
                {/* <Typography.Text type="secondary">
                Write 2-4 sentences that summarise your experience, skills and
                value to an employer. Begin your profile with a clear and
                concise title that reflects your professional identity,
                highlight your years of experience, and explain the impact you
                make on an organisation. You can also share your educational
                background and key skills. <br />
                If you need some fresh ideas, try CV Wizard – it can refine your
                profile or write you a new one based on your target role.
              </Typography.Text> */}
                <Row gutter={24} className="description-input">
                  <div className="description-options">
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
                        // onClick={loadSuggestions}
                        onClick={() => {
                          loadSuggestions({
                            rewrite: true,
                          });
                        }}
                      >
                        <MagicWandIcon color="var(--black)" marginRight="0px" />
                      </Button>

                      <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() =>
                          setState((prev) => ({ ...prev, summary: "" }))
                        }
                      >
                        <DeleteIcon color="var(--black)" marginRight="0px" />
                      </Button>
                    </Space>
                  </div>
                  <Col span={24}>
                    <EditorJsInput
                      value={state.summary}
                      onChange={(value: any) => {
                        setState({ ...state, summary: value });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <div className="ai-wizard-area">
                <Row
                  style={{
                    width: "100%",
                  }}
                >
                  <CVWizardBox
                    title="Description Tip"
                    subtitle="Highlighting your key achievements here, like awards, dissertations or projects"
                    actions={[
                      <Button
                        className="black-button-small"
                        type="primary"
                        onClick={() =>
                          loadSuggestions({
                            rewrite: false,
                          })
                        }
                      >
                        {" "}
                        <MagicWandIcon color="var(--white)" />
                        Generate Ideas
                      </Button>,
                    ]}
                  >
                    {/* <Typography.Text type="secondary">
                        CV Wizard Suggestions:
                      </Typography.Text>
                      {descriptionHelper.loading && (
                        <Skeleton active></Skeleton>
                      )}
                      {descriptionHelper.loading === false &&
                        !descriptionHelper.error &&
                        descriptionHelper.suggestions?.result &&
                        descriptionHelper.suggestions?.result?.length > 0 && (
                          <CustomCarousel
                            suggestions={descriptionHelper.suggestions.result}
                            onClick={(item: any) => onAdd(item)}
                          />
                        )}

                      {descriptionHelper.error && (
                        <Typography.Text type="danger">
                          Something wrong happened
                        </Typography.Text>
                      )} */}
                    <div>
                      Stuck for ideas describing your education? Try CV Wizard
                    </div>
                  </CVWizardBox>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProfessionalSummaryFlow;

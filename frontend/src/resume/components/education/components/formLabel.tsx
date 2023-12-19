import React, { useState } from "react";
import { useOpenAI } from "../../../../utils";
import { Button, Modal, Popover, Skeleton, Space, Typography } from "antd";
import { MagicWandIcon, MagicWandLoading } from "../../../../components/faIcons";
import Markdown from "react-markdown";
import FormLabel from "../../../../components/labelWithActions";
import withPaywall from "../../../../components/paywallHOC";

type FormLabelWithAIActionProps = {
    degree: string;
    school: string;
    modules: string;
    description: string;
    onAddDescription: (value: string) => void;
    label: string | React.ReactNode;
  };

type FormStateType = {
    modalVisible: boolean;
    mode: string | null;
  };

const FormLabelWithAIActions = ({
    degree,
    school,
    modules,
    description,
    onAddDescription,
    label,
  }: FormLabelWithAIActionProps) => {
    // AI Actions helper
    const [state, setState] = useState<FormStateType>({
      modalVisible: false,
      mode: null,
    });
  
    let openai = useOpenAI();
    const handleGenSummary = () => {
      setState({ ...state, modalVisible: true, mode: "summary" });
      openai.getEducationSummary({
        degree,
        school,
        modules,
        existingSummary: description,
        // role: "machine learning engineer",
      });
    };
  
    const handleRewrite = () => {
      setState({ ...state, modalVisible: true, mode: "rewrite" });
      openai.getEducationSummary({
        degree,
        school,
        modules,
        existingSummary: description,
        // role: "machine learning engineer",
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
      onAddDescription(value);
      onModalClose();
    };
  
    return (
      <>
        <Modal
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
                  openai.data?.results?.map((item: any) => (
                    <div
                      className="openai-generated-content-item"
                      onClick={() => onSelectDescription(item.content)}
                    >
                      <Markdown>{item.content}</Markdown>
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
  
              {/* {JSON.stringify(openai.data)} */}
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
                  openai.data?.results?.map((item: any) => (
                    <div
                      className="openai-generated-content-item"
                      onClick={() => onSelectDescription(item.content)}
                    >
                      <Markdown>{item.content}</Markdown>
                    </div>
                  ))}
              </Space>
            </div>
          )}
          {state.mode == "rewriteWithInstructions" && (
            <div className="openai-model-content">
              <div className="model-header">
                {" "}
                <Typography.Title level={4}>
                  Rewrite with Instructions
                </Typography.Title>
                <Typography.Text type="secondary">
                  Click one of following options to add
                </Typography.Text>
              </div>
  
              {/* {JSON.stringify(openai.data)} */}
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
                {!openai.loading && openai.data &&
                  openai.data.results?.map((item: any) => (
                    <div
                      className="openai-generated-content-item"
                      onClick={() => onSelectDescription(item.content)}
                    >
                      {item.content}
                    </div>
                  ))}
              </Space>
            </div>
          )}
        </Modal>
        {label}
        <FormLabel
            label={null}
          action={
            <Popover
              placement="bottomRight"
              trigger={["click"]}
              content={
                withPaywall(popOverContent())
              }
            >
              <Button type="link" size="small">
                <MagicWandIcon /> Write with CV Wizard
              </Button>
            </Popover>
          }
          // label="List further achievements here, such as scholarships, awards, the title of your dissertation and / or key projects"
          required={true}
        />
      </>
    );
  
    function popOverContent() {
      return <div>
        <Space direction="vertical">
          <Typography.Text type="secondary">
            Write with CV Wizard
          </Typography.Text>
          <Button
            type="link"
            size="small"
            disabled={description && description.length > 20 ? false : true}
            onClick={handleRewrite}
          >
            Rephrase and Optimise
          </Button>
          {/* <Button
            type="link"
            size="small"
            disabled={
              description && description.length > 20 ? false : true
            }
          >
            Repharse with Instructions
          </Button> */}
          <Button
            type="link"
            size="small"
            disabled={degree && school ? false : true}
            onClick={handleGenSummary}
          >
            Generate New Summary
          </Button>
        </Space>
      </div>;
    }
  };
  

export default FormLabelWithAIActions;
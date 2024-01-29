import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
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
import { LightBulbIcon, MagicWandIcon, MagicWandLoading, RepharseIcon } from "../../../components/faIcons";
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
import CVWizardBox from "../../../components/cvWizardBox";

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
         <Row>
              {openai.data || openai.loading ? (
                <CVWizardBox>
                  <Typography.Text type="secondary">
                    <MagicWandIcon /> CV Wizard Suggestions:
                  </Typography.Text>
                  {openai.loading && <Skeleton active></Skeleton>}
                  {openai.loading === false &&
                    openai.data!.result.length >
                    0 && (
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
                        onClick={(item: any) => onSelectDescription(item)} />
                    )}
                </CVWizardBox>
              ) : null}
            </Row>
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
                  content={<Space direction="vertical">
                    <Button
                      type="text"
                      // size="small"
                      style={{
                        height: "auto",
                        textAlign: "left",
                      }}
                      disabled={description && description.length > 20 ? false : true}
                      onClick={() => {
                        // loadSuggestions({
                        //   employerName: initialValues?.employerName,
                        //   position: initialValues?.position,
                        //   rewrite: true,
                        //   existingDesscription: description,
                        // });
                        handleRewrite()
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
                        handleGenSummary()
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
                  </Space>}
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
  onFinish,
  syncProfessionalSummary,
}: {
  professionalSummary: string;
  onFinish: (value: string) => void;
  syncProfessionalSummary: (value: string) => Promise<void>;
}) => {
  const resume = useResume();
  const [state, setState] = React.useState({
    loading: false,
    summary: professionalSummary,
  });

  const [form] = Form.useForm();

  const onAdd = (value: string) => {
    // setState({ ...state, summary: value });
    form.setFieldsValue({ professionalSummary: value });
  };

  const onSave = async (values: any) => {
    setState({ ...state, loading: true });
    await syncProfessionalSummary(values.professionalSummary);
    await onFinish(values.professionalSummary)
    setState({ ...state, loading: false });
  }

  return (
    <div>
      <Row>
        <Typography.Title level={4}>Professional Summary</Typography.Title>
      </Row>
      <Row>
        <Col span={24}>
          <Typography.Text type="secondary">
            Write 2-4 sentences that summarise your experience, skills and value
            to an employer. Begin your profile with a clear and concise title
            that reflects your professional identity, highlight your years of
            experience, and explain the impact you make on an organisation. You
            can also share your educational background and key skills. <br />
            If you need some fresh ideas, try CV Wizard – it can refine your
            profile or write you a new one based on your target role.
          </Typography.Text>
        </Col>
      </Row>
      <Row>
        <Form
          name="personal_info"
          onFinish={onSave}
          initialValues={{
            professionalSummary: professionalSummary,
          }}
          form={form}
          scrollToFirstError
        >
          <Form.Item
            name="professionalSummary"
            label=""
            rules={[
              {
                required: true,
                message: "Please add a summary!",
              },
            ]}
          >
            <DummyInput resumeId={resume.resume?.id} onAdd={onAdd} />
          </Form.Item>

          <Form.Item>
            <Button type="primary"  htmlType="submit" loading={state.loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};

export default ProfessionalSummaryFlow;

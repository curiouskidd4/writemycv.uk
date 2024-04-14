import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Skeleton,
  Popover,
  Space,
  Modal,
} from "antd";
import EditorJsInput from "../../../components/editor";
import { useAuth } from "../../../contexts/authContext";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";
import { MagicWandIcon, MagicWandLoading } from "../../../components/faIcons";

const FormLabelWithAIActions = ({ resumeId, description, onAdd }) => {
  // AI Actions helper
  const [state, setState] = useState({
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

  const onSelectDescription = (value) => {
    onAdd(value);
    onModalClose();
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
                openai.data?.result.map((item, key) => (
                  <div
                    key={key}
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item)}
                  >
                    {item.split("\n").map(
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
                openai.data?.result.map((item) => (
                  <div
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item)}
                  >
                    {item.split("\n").map(
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
      </Modal>
      <FormLabel
        action={
          <Popover
            placement="bottomRight"
            trigger={["click"]}
            content={
              <div>
                <Space direction="vertical">
                  <Typography.Text type="secondary">
                    Write with CV Wizard
                  </Typography.Text>
                  <Button
                    type="link"
                    size="small"
                    disabled={
                      description && description.length > 20 ? false : true
                    }
                    onClick={handleRewrite}
                  >
                    Rephrase and Optimise
                  </Button>

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
        }
        label={""}
        required={true}
      />
    </>
  );
};

const DummyInput = ({ resumeId, value, onAdd, ...rest }) => {
  return (
    <>
      <FormLabelWithAIActions
        description={value}
        onAdd={onAdd}
        resumeId={resumeId}
      />
      {/* <Input.TextArea rows={3} {...rest} value={value} />
       */}
      <EditorJsInput value={value} {...rest} />
    </>
  );
};

const ProfessionalSummaryForm = ({
  resumeId,
  onFinish,
  initialValues,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const onAdd = (value) => {
    form.setFieldsValue({
      professionalSummary: value,
    });
  };
  return (
    <Form
      name="personal_info"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
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
        {/* <Input /> */}
        {/* <EditorJsInput />
         */}
        <DummyInput resumeId={resumeId} onAdd={onAdd} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
const ProfessionalSummary = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const summary = useDoc("professionalSummary", user.uid, true);
  const updateSummary = useMutateDoc("professionalSummary", user.uid, true);
  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
    updateSummary
      .mutate(values)
      .then(() => {
        // console.log("Profile updated successfully");
        message.success("Summary updated successfully");
      })
      .catch((err) => {
        // console.log("Profile update failed");
        message.error("Summary update failed");
      });
  };

  return (
    <div>
      <div className="detail-form-header">
        <Typography.Title level={4}>Professional Summary</Typography.Title>
      </div>

      <div
        className="detail-form-body"
        style={{
          marginBottom: "0.5rem",
        }}
      >
        <Typography.Text type="secondary">
          Write 2-4 sentences that summarise your experience, skills and value
          to an employer. Begin your profile with a clear and concise title that
          reflects your professional identity, highlight your years of
          experience, and explain the impact you make on an organisation. You
          can also share your educational background and key skills. <br />
          If you need some fresh ideas, try CV Wizard – it can refine your
          profile or write you a new one based on your target role.
        </Typography.Text>
      </div>
      {summary.loading ? <Skeleton /> : null}
      {!summary.loading && (
        <ProfessionalSummaryForm
          onFinish={onFinish}
          initialValues={summary.data}
          isLoading={updateSummary.isLoading}
        />
      )}
    </div>
  );
};

export { ProfessionalSummary, ProfessionalSummaryForm };

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
import { useAuth } from "../../../authContext";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";

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
              <Typography.Title level={4}>Summary</Typography.Title>
              <Typography.Text type="secondary">
                Click one of following options to add
              </Typography.Text>
            </div>

            {openai.loading && (
              <div
                style={{
                  minHeight: "400px",
                }}
              >
                <Skeleton />
              </div>
            )}
            <Space direction="vertical">
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
              <Typography.Title level={4}>Rewrite</Typography.Title>
              <Typography.Text type="secondary">
                Click one of following options to add
              </Typography.Text>
            </div>

            {/* {JSON.stringify(openai.data)} */}
            {openai.loading && (
                <div
                  style={{
                    minHeight: "400px",
                  }}
                >
                  <Skeleton />
                </div>
              )}
            <Space direction="vertical">
              
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
                  <Typography.Text type="secondary">AI Actions</Typography.Text>
                  <Button
                    type="link"
                    size="small"
                    disabled={
                      description && description.length > 20 ? false : true
                    }
                    onClick={handleRewrite}
                  >
                    Rephrase
                  </Button>

                  <Button type="link" size="small" onClick={handleGenSummary}>
                    Generate new summary
                  </Button>
                </Space>
              </div>
            }
          >
            <Button type="link" size="small">
              Write with AI
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
      <Input.TextArea rows={3} {...rest} value={value} />
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
      onFinish={
        onFinish
      }
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
        <DummyInput
          resumeId={resumeId}
          onAdd={onAdd}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};
const ProfessionalSummary = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const summary = useDoc("professionalSummary", user.uid);
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
      <Typography.Title level={3}>Professional Summary</Typography.Title>
      <div
        style={{
          marginBottom: "0.5rem",
        }}
      >
        <Typography.Text type="secondary">
          Compose 2-4 concise and spirited sentences to captivate your audience!
          Highlight your position, expertise, and most crucially - your standout
          accomplishments, top attributes, and abilities.
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

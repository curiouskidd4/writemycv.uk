import {
  Button,
  Form,
  Modal,
  Input,
  Select,
  message,
  Typography,
  Upload,
} from "antd";
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import useResumeAPI from "../../api/resume";
import { AIWizardIcon, MagicWandIcon } from "../../components/faIcons";
import { InboxOutlined } from "@ant-design/icons";
import { isHowellEnv } from "../../config";

const ObjectId = require("bson-objectid");
export const NewResumeModal = ({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    loading: false,
    uploading: false,
    isSuccess: false,
    isError: false,
  });
  const [form] = Form.useForm();
  const auth = useAuth();
  const userId = auth.user.uid;
  const { copyProfileToResume, importResume, exportResume } = useResumeAPI();
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      uploading: isHowellEnv ? true : false,
    }));
    // uuid for resume
    let data = {
      ...values,
      id: ObjectId().toString(),
      userId,
      isDeleted: false,
      createdAt: new Date(),
      copyFromProfile: isHowellEnv? false : true,
      isComplete: false,
    };
    // Delete file 
    if (isHowellEnv) {
      delete data.file;
    }
    // Drop empty fields
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);
    try {
      await setDoc(doc(db, "resumes", data.id), data);
      // await copyProfileToResume(data.id);
      if (isHowellEnv) {
        let file = values.file.file.originFileObj;
        delete values.file;
    
        await importResume(data.id, file);
        await exportResume(data.id);
      } else {
        await copyProfileToResume(data.id);

      }

      setState((prev) => ({
        ...prev,
        loading: false,
        isSuccess: true,
      }));

      // Copy data from profile
      onConfirm(data.id);
      message.success("Resume created successfully");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setState((prev) => ({
        ...prev,
        loading: false,
        isError: true,
      }));
    }
  };

  return (
    <Modal
      // title="Give a name to your resume"
      visible={visible}
      width={620}
      footer={null}
      onCancel={onCancel}
      className="new-resume-modal"
    >
      {!state.loading && (
        <>
          <div className="header">
            <div className="wizard-logo">
              <MagicWandIcon /> CV Wizard
            </div>
            <Typography.Title level={4}>Create a new resume</Typography.Title>
            <div className="subtitle">
              Provide details to create a CV that aligns with your career goals.
              The more specific you are, the better we can tailor your CV.
            </div>
          </div>
          <Form
            name="basic"
            layout="vertical"
            form={form}
            style={{
              maxWidth: "600px",
              marginTop: "32px",
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Resume Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input resume name!",
                },
              ]}
            >
              <Input size="large" placeholder="Resume Name" />
            </Form.Item>

            <Form.Item label="Job Title (optional)" name="targetRole">
              <Input
                size="large"
                placeholder="Paste the job description of a position you aspire to"
              />
            </Form.Item>

            <Form.Item label="Job Description (optional)" name="jobDescription">
              <Input.TextArea
                style={{
                  minHeight: "100px",
                }}
                size="large"
                placeholder="Paste the job description of a position you aspire to"
              />
            </Form.Item>

            {isHowellEnv ? (
              <Form.Item name="file" label="Upload your resume">
                <Upload.Dragger>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined
                      style={{
                        fontSize: "16px",
                      }}
                    />
                  </p>
                  <p className="ant-upload-text">
                    Choose a file or drag it here
                  </p>
                </Upload.Dragger>
              </Form.Item>
            ) : null}
            <div className="submit-btn">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: "0px auto", width: "200px" }}
                  loading={loading}
                >
                  Create CV
                </Button>
              </Form.Item>
            </div>
          </Form>
        </>
      )}
      {state.loading && isHowellEnv && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              margin: "96px auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <i
              style={{ fontSize: "128px", color: "var(--primary)" }}
              className="fa-solid fa-circle fa-beat fa-2xl"
            ></i>
          </div>
          <div className="uploading-message">
            <Typography.Text
              type="secondary"
              style={{
                color: "var(--black)",
                font: "normal normal bold 30px/12px DM Sans",
                textAlign: "center",
              }}
            >
              Uploading your CV
            </Typography.Text>
            <br />
            <Typography.Text
              type="secondary"
              style={{
                color: "var(--black)",
                font: "normal normal normal 16px/24px DM Sans",
                textAlign: "center",
              }}
            >
              Please hold on a moment while we’re securely uploading your CV.
            </Typography.Text>
          </div>

          <Typography.Text
            type="secondary"
            style={{
              color: "var(--black)",
              font: "normal normal normal 16px/24px DM Sans",
              textAlign: "center",
              marginTop: "32px",
              fontWeight: 600,
            }}
          >
            Estimated time: 120 seconds
          </Typography.Text>
        </div>
      )}
      {state.loading && !isHowellEnv && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "96px auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <i
                style={{ fontSize: "128px", color: "var(--primary)" }}
                className="fa-solid fa-circle fa-beat fa-2xl"
              ></i>
            </div>
            <div className="uploading-message">
              <Typography.Text
                type="secondary"
                style={{
                  color: "var(--black)",
                  font: "normal normal bold 30px/12px DM Sans",
                  textAlign: "center",
                }}
              >
                Creating your CV
              </Typography.Text>
              <br />
              <Typography.Text
                type="secondary"
                style={{
                  color: "var(--black)",
                  font: "normal normal normal 16px/24px DM Sans",
                  textAlign: "center",
                }}
              >
                Please hold on a moment while we’re creating your CV from repository
              </Typography.Text>
            </div>

            <Typography.Text
              type="secondary"
              style={{
                color: "var(--black)",
                font: "normal normal normal 16px/24px DM Sans",
                textAlign: "center",
                marginTop: "32px",
                fontWeight: 600,
              }}
            >
            </Typography.Text>
          </div>
      )}
    </Modal>
  );
};

export default NewResumeModal;

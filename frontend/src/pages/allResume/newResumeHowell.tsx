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
import { useAuth } from "../../authContext";
import useResumeAPI from "../../api/resume";
import { AIWizardIcon, MagicWandIcon } from "../../components/faIcons";
import { InboxOutlined } from "@ant-design/icons";

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
    }));
    let file = values.file.file.originFileObj;
    delete values.file;
    // uuid for resume
    let data = {
      ...values,
      id: ObjectId().toString(),
      userId,
      isDeleted: false,
      createdAt: new Date(),
      copyFromProfile: false,
      isComplete: false,
    };
    // Drop empty fields
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);
    try {
      await setDoc(doc(db, "resumes", data.id), data);
      // await copyProfileToResume(data.id);
      await importResume(data.id, file);
      await exportResume(data.id);
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
      message.error("Something went wrong");
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

            <Form.Item name="file" label="Upload your resume">
              <Upload.Dragger>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </p>
                <p className="ant-upload-text">Choose a file or drag it here</p>
                {/* <p className="ant-upload-hint">
                    You can upload a PDF or Word document. You can also import
                    your profile from LinkedIn, just export from LinkedIn and
                    upload here.
                  </p> */}
              </Upload.Dragger>
            </Form.Item>
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
      {state.loading && (
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
              Importing your CV
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
              Please hold on a moment while we securely import your CV. This may
              take a few seconds.
            </Typography.Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default NewResumeModal;

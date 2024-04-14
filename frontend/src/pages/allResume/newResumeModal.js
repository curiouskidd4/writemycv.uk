import { Button, Form, Modal, Input, Select, message, Typography } from "antd";
import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import useResumeAPI from "../../api/resume";
import { AIWizardIcon, MagicWandIcon } from "../../components/faIcons";

const ObjectId = require("bson-objectid");
export const NewResumeModal = ({ visible, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();
  const userId = auth.user.uid;
  const { copyProfileToResume } = useResumeAPI();
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    // uuid for resume
    let data = {
      ...values,
      id: ObjectId().toString(),
      userId,
      isDeleted: false,
      createdAt: new Date(),
      // copyFromProfile: true,
      isComplete: false,
    };
    // Drop empty fields
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);
    try {
      await setDoc(doc(db, "resumes", data.id), data);
      await copyProfileToResume(data.id);
      setLoading(false);

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
      <div className="header">
        <div className="wizard-logo">
          <MagicWandIcon /> CV Wizard
        </div>
        <Typography.Title level={4}>Create a new resume</Typography.Title>
        <div className="subtitle">
          Provide details to create a CV that aligns with your career goals. The
          more specific you are, the better we can tailor your CV.
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
              minHeight: "200px",
            }}
            size="large"
            placeholder="Paste the job description of a position you aspire to"
          />
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
    </Modal>
  );
};

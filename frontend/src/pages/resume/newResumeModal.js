import { Button, Form, Modal, Input, Select, message, Checkbox } from "antd";
import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import useResumeAPI from "../../api/resume"

const ObjectId = require("bson-objectid");
export const NewResumeModal = ({ visible, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const auth = useAuth();
  const userId = auth.user.uid;
  const { copyProfileToResume } = useResumeAPI()
  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
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
      await copyProfileToResume(data.id)
      // Copy data from profile
      onConfirm(data.id);
      message.success("Resume created successfully");
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title="Give a name to your resume"
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
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
          // label="Resume Name"
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "20px" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

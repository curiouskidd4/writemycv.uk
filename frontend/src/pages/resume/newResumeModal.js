import {
  Button, Form,
  Modal, Input,
  Select,
  message, Checkbox
} from "antd";
import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
const ObjectId = require("bson-objectid");

export const NewResumeModal = ({ visible, onCancel, onConfirm, userId }) => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    // uuid for resume
    let data = {
      ...values,
      id: ObjectId().toString(),
      userId,
      deleted: false,
      createdAt: new Date(),
    };
    // Drop empty fields
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);
    try {
      await setDoc(doc(db, "resumes", data.id), data);
      onConfirm();
      message.success("Resume created successfully");
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title="New Resume"
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Mention roles you are targeting ( The roles you mention  are used to customize CV wizard suggestions for those specific roles. )"
          name="role"
          rules={[]}
        >
          <Input
            style={{ width: "100%" }}
            placeholder="Roles"
          ></Input>
        </Form.Item>

        <Form.Item label="Sector" name="sector" rules={[]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Mention the sector you are targeting, e.g. Finance, Tech, etc."
          ></Input>
        </Form.Item>
        <Form.Item label="Geographic Location" name="geography" rules={[]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Mention the geographic location you are targeting, e.g. UK, Europe, etc."
          ></Input>
        </Form.Item>
        <Form.Item label="For companies (optional)" name="companies" rules={[]}>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Mention companies you are targeting"
          ></Select>
        </Form.Item>

        <Form.Item
          label="Job Description (Paste job description or link to job posting)"
          name="jobDescription"
          rules={[]}
        >
          <Input.TextArea
            placeholder="Mention job description you are targeting"
            autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>

        <Form.Item
          // label="Copy from your profile"
          name="copyFromProfile"
          rules={[]}
          valuePropName="checked"
        >
          <Checkbox>Copy data from your profile</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "20px" }}
          >
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

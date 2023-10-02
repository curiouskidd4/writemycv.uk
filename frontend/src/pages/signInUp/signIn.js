import React, { useState } from "react";
import { Form, Input, Button, notification, Radio, Typography } from "antd";
import { Link } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CustomInput = (props) => {
  return (
    <div>
      <Input.Password {...props} />
      <Link to="/forgot-password">
        <Button size="small" type="link">
          Forgot Password?
        </Button>
      </Link>
    </div>
  );
};

const SignInForm = (props) => {
  const [form] = Form.useForm();
  const [loading, updateLoading] = useState(false);

  const openNotification = (type, title, description) => {
    notification[type]({
      message: title,
      description: description,
    });
  };

  const onFinish = (values) => {
    updateLoading(true);
    props
      .onSubmit(values.username, values.password)
      .then(() => {
        openNotification("success", "Login Successful");
        updateLoading(false);
      })
      .catch((err) => {
        debugger
        openNotification(
          "error",
          "Login Failed",
          JSON.stringify(err.response.data?.detail)
        );
        updateLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        size="large"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <CustomInput />
        </Form.Item>

        <div style={{ marginTop: "2rem" }}>
          <Form.Item>
            <Button
              loading={loading}
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
        </div>
      </Form>
      <Typography.Text type="secondary">
        Don't have an account?
        <Link to="/signup">
          {" "}
          <a style={{ color: "var(--primary)" }}>Sign Up</a>
        </Link>
      </Typography.Text >
    </>
  );
};

export default SignInForm;

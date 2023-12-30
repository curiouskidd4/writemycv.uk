import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Radio,
  Typography,
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import { GoogleOutlined, LockOutlined } from "@ant-design/icons";
import { auth } from "../../services/firebase";
import { useAuth } from "../../authContext";
import { NotificationConfig } from "antd/es/notification/interface";
import { ArgsProps } from "antd/es/message";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CustomInput = (props: any) => {
  return (
    <div>
      <Input.Password {...props} />
      <Link to="/forgot-password">
        <Button
          size="small"
          type="link"
          style={{
            marginLeft: "auto",
          }}
        >
          Forgot Password?
        </Button>
      </Link>
    </div>
  );
};

const SignInForm = ({
  onSubmit,
}: {
  onSubmit: (username: string, password: string) => Promise<void>;
}) => {
  const [form] = Form.useForm();
  const auth = useAuth();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: "success" | "error",
    title: string,
    description?: string
  ) => {
    if (type == "success") {
      api.success({
        message: title,
        description: description,
      });
    } else {
      api.error({
        message: title,
        description: description,
      });
    }
  };

  const [loading, updateLoading] = useState(false);

  // const openNotification = (type : any, title: string, description?: string) => {
  //   let notificationFn = notification[type as keyof typeof notification];
  //   let config: ArgsProps = {
  //     message: title,
  //     description: description,
  //   };

  //   notificationFn({
  //     message: title,
  //     description: description,
  //   });
  // };

  const onFinish = (values: any) => {
    updateLoading(true);
    onSubmit(values.username, values.password)
      .then(() => {
        openNotification("success", "Login Successful");
        updateLoading(false);
      })
      .catch((err: any) => {
        openNotification(
          "error",
          "Login Failed",
          JSON.stringify(err.response.data?.detail)
        );
        updateLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
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
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>

      <div
        style={{
          marginTop: "2rem",
        }}
      >
        <Divider>Or</Divider>

        <Button
          style={{
            height: "64px",
            width: "100%",
            borderRadius: "12px",
            marginTop: "12px",
          }}
          onClick={() => {
            auth.signInWithGoogle();
          }}
          icon={
            <img
              src="/googleIconV2.svg"
              style={{
                paddingTop: "6px",
              }}
            ></img>
          }
        ></Button>

        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
          }}
        >
          <Typography.Text type="secondary">
            Don't have an account?
            <Link to="/signup">
              {" "}
              <a style={{ color: "var(--primary)" }}>Sign Up</a>
            </Link>
          </Typography.Text>
        </div>
      </div>
    </>
  );
};

export default SignInForm;

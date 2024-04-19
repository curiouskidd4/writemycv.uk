import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Radio,
  Typography,
  Divider,
  message,
  Row,
} from "antd";
import { Link } from "react-router-dom";
import { GoogleOutlined, LockOutlined } from "@ant-design/icons";
import { auth } from "../../services/firebase";
import { useAuth } from "../../contexts/authContext";
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
    <>
      <Input.Password {...props} />
      <Row justify="end" style={{
        marginTop: "4px"
      }}>
      <Link to="/forgot-password" className="small-link-btn">
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
      </Row>
    </>
  );
};

const SignInForm = ({
  onSubmit,
}: {
  onSubmit: (username: string, password: string) => Promise<any>;
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

  const onFinish = async (values: any) => {
    updateLoading(true);
    try {
      let res = await onSubmit(values.username, values.password);
      if (res.error) {
        // openNotification("error", "Login Failed", res.error);
        let errorMessage = "";
        if (res.code == "auth/user-not-found") {
          errorMessage = "User not found";
        }
        if (res.code == "auth/wrong-password") {
          errorMessage = "Wrong password";
        }
        if (res.code == "auth/too-many-requests") {
          errorMessage =
            "Too many requests, User blocked, please try again later";
        }
        message.error("Login Failed: " + errorMessage);
        updateLoading(false);
      } else {
        // openNotification("success", "Login Successful");
        message.success("Login Successful");
        updateLoading(false);
      }
    } catch (err: any) {
      // openNotification("error", "Login Failed", JSON.stringify(err));
      message.error("Login Failed: " + err.message);
      updateLoading(false);
    }
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
          label="Email"
          name="username"
          
          rules={[{ required: true, message: "Please input your email!" }]}
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
              Sign In
            </Button>
          </Form.Item>
        </div>
      </Form>

      <div
        style={{
          marginTop: "0rem",
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
          className="google-btn"
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
            No Account?
            <Link to="/signup">
              {" "}
              <a style={{ color: "var(--primary)" }}>Join Now</a>
            </Link>
          </Typography.Text>
        </div>
      </div>
    </>
  );
};

export default SignInForm;

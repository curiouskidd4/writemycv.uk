import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  notification,
  Radio,
  Checkbox,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const SignUpForm = (props) => {
  const auth = useAuth();
  const [form] = Form.useForm();
  const [loading, updateLoading] = useState(false);

  const openNotification = (type, title, description) => {
    notification[type]({
      message: title,
      description: description,
    });
  };

  const onFinish = async (values) => {
    var name = values.name;
    var [first_name, ...last_names] = name.split(" ");
    var last_name = last_names.join(" ");

    updateLoading(true);

    try {
      let res = await auth.createUserWithEmail(
        first_name,
        last_name,
        values.email,
        values.password,
        values.email
      );
      if (res.error) {
        openNotification("error", "Signup Failed", JSON.stringify(res.message));
      } else {
        openNotification("success", "Signup Successful", "Please login now");
      }
      form.resetFields();
    } catch (err) {
      openNotification("error", "Signup Failed", JSON.stringify(err.message));
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="basic"
      size="large"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      // initialValues={{ role: "foodie" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item> */}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Renter Password"
        name="password2"
        rules={[{ required: true, message: "Please renter your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="accept"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("Please accept.")),
          },
        ]}
        // {...tailLayout}
      >
        <Checkbox>
          I accept the{" "}
          <Link to="/terms-service">
            <a style={{ color: "var(--primary)" }}>Terms & Conditions</a>
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy">
            <a style={{ color: "var(--primary)" }}>Privacy Policy</a>
          </Link>
        </Checkbox>
      </Form.Item>
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
      <Typography.Text type="secondary">
        Have an account?{" "}
        <Link to="/signin">
          {" "}
          <a style={{ color: "var(--primary)" }}>Sign In</a>
        </Link>
      </Typography.Text>
    </Form>
  );
};

export default SignUpForm;

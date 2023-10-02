import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { AuthService, ProjectService } from "../../services/dataService.js";
import { Button, DatePicker, Form, Input, Row } from "antd";
import { useAuth } from "../../authContext.js";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ForgotPassword = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const forgtPasswordMutation = useMutation((data) =>
    AuthService.forgotPasswordInitiate(data)
  );
  const onFinish = (values) => {
    // Check if passwords match
    if (values.password1 !== values.password2) {
      console.log("Passwords do not match");
      return;
    }
    forgtPasswordMutation.mutate({
      email: values.email,
      password: values.password1,
    });
  };

  const [form] = Form.useForm();

  return (
    <div className="reset-password">
      <div className="header">
        <h1>Forgot Password</h1>
        <Button type="link" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <div
        className="wrapper"
        style={{ maxWidth: "500px", margin: "0px auto", padding: "0px 25px" }}
      >
        <Form
          form={form}
          name="basic"
          size="large"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          {forgtPasswordMutation.isSuccess ? (
            <div style={{ marginBottom: "10px", color: "gray" }}>
              <p>
                If an account with that email exists, a password reset link has
                been sent to that email.
              </p>
            </div>
          ) : null}
          <Form.Item>
            <Button
              loading={forgtPasswordMutation.isLoading}
              type="primary"
              htmlType="submit"
              style={{ marginRight: "20px" }}
            >
              Submit
            </Button>
            {/* <Button htmlType="button" onClick={onReset}>
            Reset
          </Button> */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;

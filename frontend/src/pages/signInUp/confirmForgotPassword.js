import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { Button, DatePicker, Form, Input, Row, Spin, message } from "antd";
import { useAuth } from "../../authContext.js";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ForgotPasswordConfirm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  // Get token from  query params from URL
  const { search } = useLocation();
  let token = new URLSearchParams(search).get("token");

  const verifyToken = useQuery(
    "verifyToken",
    () => {},
    {
      enabled: token ? true : false,
    }
  );
  const forgtPasswordMutation = useMutation((data) =>
    {}, 
    {
        onSuccess: (data) => {
            message.success("Password reset successfully");
            navigate("/signIn");
        }, 
        onError: (error) => {
            message.error(error.response.data.detail);
        }
        
    }
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
      token,
    });
  };

  const [form] = Form.useForm();

  return (
    <div className="reset-password">
      <div className="header">
        <h1>Reset Password</h1>
        {/* <Button type="link" onClick={() => navigate(-1)}>
          Back
        </Button> */}
      </div>
      {verifyToken.isLoading ? <Spin /> : null}
      {verifyToken.isError || !token ? <div>Invalid token</div> : null}
      {verifyToken.isSuccess ? (
        <div
          className="wrapper"
          style={{ maxWidth: "500px", margin: "0px auto", padding: "0px 25px" }}
        >
          <Form
            form={form}
            name="basic"
            size="large"
            layout="vertical"
            initialValues={{ email: verifyToken.data.email }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="password1"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="password2"
              rules={[
                { required: true, message: "Please input your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password1") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                loading={forgtPasswordMutation.isLoading}
                type="primary"
                htmlType="submit"
                style={{ marginRight: "20px" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ForgotPasswordConfirm;

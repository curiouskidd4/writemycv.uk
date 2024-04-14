import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { AuthService, ProjectService } from "../../services/dataService.js";
import { Button, DatePicker, Form, Input, Row } from "antd";
import { useAuth } from "../../contexts/authContext.js";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ResetPassword = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const resetPasswordMutation = useMutation((data) =>
    AuthService.resetPassword(data)
  );
  const onFinish = (values) => {
    // Check if passwords match
    if (values.password1 !== values.password2) {
      console.log("Passwords do not match");
      return;
    }
    resetPasswordMutation.mutate({
      email: values.email,
      password: values.password1,
    });
  };

  const [form] = Form.useForm();

  return (
    <>
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

        <Form.Item
          label="New Password"
          name="password1"
          rules={[{ required: true, message: "Please input your password!" }]}
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
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button
            loading={resetPasswordMutation.isLoading}
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
    </>
  );
};


export default ResetPassword;
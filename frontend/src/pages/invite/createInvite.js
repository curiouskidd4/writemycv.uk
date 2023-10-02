import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { useMutation, useQuery } from "react-query";
import { AuthService, ProjectService } from "../../services/dataService.js";
import { Button, DatePicker, Form, Input, Row, Spin, message } from "antd";
import { useAuth } from "../../authContext.js";
import "./index.css";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CreateInvite = (props) => {
  const navigate = useNavigate();
  const createInvite = useMutation((data) => AuthService.createInvite(data), {
    onSuccess: (data) => {
      props.onSuccess()
      props.onClose && props.onClose();
    },
    onError: (error) => {
    //   message.error("Something went wrong");
    props.onError()
    },
  });
  const onFinish = (values) => {
    createInvite.mutate({
      email: values.email,
    });
  };

  const [form] = Form.useForm();

  return (
    <div className="create-invite">
      <div
        className="wrapper"
        style={{ maxWidth: "500px", margin: "0px auto", padding: "0px 25px" }}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          initialValues={{}}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              loading={createInvite.isLoading}
              type="primary"
              htmlType="submit"
              style={{ marginRight: "20px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateInvite;

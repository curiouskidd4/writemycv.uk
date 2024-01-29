import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { Button, DatePicker, Form, Input, Row, Col, Typography } from "antd";
import { useAuth } from "../../authContext.js";
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: null,
    loading: false,
    success: false,
  });
  const auth = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setState({ ...state, loading: true });
    await auth.sendResetPasswordEmail(values.email);
    setState({ ...state, loading: false, success: true });
  };

  const [form] = Form.useForm();

  return (
    <div className="login-signup-page">
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        {/* <Col span={12}>
          <img
            src="/undraw_online_cv_re_gn0a.svg"
            style={{ width: "100%", padding: "1rem" }}
          />
          <Typography.Title
            level={3}
            style={{
              textAlign: "center",
              fontWeight: 600,
              color: "#5C5470",
            }}
          >
            Crafted by AI, Tailored for Success.
          </Typography.Title>
        </Col> */}
        <Col
          span={12}
          style={{
            height: "100%",
            background: "#3e4040",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0px auto",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/undraw_online_cv_re_gn0a.svg"
                style={{
                  width: "80%",
                }}
              />
            </div>
            <div
              style={{
                margin: "1rem 1rem",
                width: "100%",
              }}
            >
              <div className="large-logo">RESU.ME</div>

              <Typography.Title
                level={3}
                style={{
                  // textAlign: "center",
                  fontWeight: 600,
                  color: "var(--accent-200)",
                }}
              >
                Crafted by AI, Tailored for Success.
              </Typography.Title>
            </div>
          </div>
        </Col>
        <Col
          span={12}
          style={{
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div
            style={{
            height: "100%",

              maxWidth: "600px",
              margin: "20px auto",
              padding: "0px 25px",
              display: "flex",
              flexDirection: "column",
              paddingTop: "8rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography.Title level={3}>Forgot Password</Typography.Title>
              <Button type="link" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",

                flexDirection: "column",
                justifyContent: "center",
              }}
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
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                {state.success ? (
                  <div style={{ marginBottom: "10px", color: "gray" }}>
                    <p>
                      If an account with that email exists, a password reset
                      link has been sent to that email.
                    </p>
                  </div>
                ) : null}
                <Form.Item>
                  <Button
                    loading={state.loading}
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
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useReducer, useEffect, Fragment } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import clsx from "clsx";
import { Button, DatePicker, Form, Input, Row, Col, Typography } from "antd";
import { useAuth } from "../../contexts/authContext.js";
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
    setState(prev => ({ ...prev, email: values.email, loading: true }));
    try {
      await auth.sendResetPasswordEmail(values.email);
      setState(prev => ({ ...prev, loading: false, success: true }));
    } catch (e) {
      console.log(e);
      setState(prev => ({...prev, loading: false, success: true }));
    }
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
              <div className="large-logo">WriteMyCV</div>

              <div className="logo-subtitle">Craft The Perfect CV</div>
            </div>
          </div>
        </Col>
        <Col
          span={12}
          style={{
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              // height: "100%",
              width: "100%",
              maxWidth: "600px",
              margin: "20px auto",
              padding: "0px 25px",
              display: "flex",
              flexDirection: "column",
              paddingTop: "8rem",
            }}
          >
            {state.success ? (
              <>
                {" "}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography.Title level={3} className="form-title">
                    Check your email
                  </Typography.Title>
                </div>
                <div
                  style={{
                    font: "normal normal normal 18px/24px DM Sans",
                  }}
                >
                  If there’s an account linked to {<strong>{state.email}</strong>}, we’ve
                  sent you a password reset link. Please check your inbox and
                  spam folder.
                </div>
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    type="link"
                    onClick={() => navigate(-1)}
                    className="black"
                  >
                    Back
                  </Button>
                  <Button
                    loading={state.loading}
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: "20px" }}
                  >
                    Resend Reset Link
                  </Button>
                </div>
              </>
            ) : null}
            {!state.success ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography.Title level={3} className="form-title">
                    Forgot Your Password?
                  </Typography.Title>
                </div>
                <div
                  style={{
                    font: "normal normal normal 18px/24px DM Sans",
                  }}
                >
                  Please enter your email and we’ll send you a link to reset
                  your password.
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",

                    flexDirection: "column",
                    // justifyContent: "center",
                    marginTop: "2rem",
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

                    <Form.Item>
                      <Button
                        loading={state.loading}
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: "20px" }}
                      >
                        Submit
                      </Button>
                      <Button
                        type="link"
                        onClick={() => navigate(-1)}
                        className="black"
                      >
                        Back
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </>
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;

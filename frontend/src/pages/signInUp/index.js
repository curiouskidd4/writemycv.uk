import React, { useState } from "react";

import LoginForm from "./signIn";
import SignUpForm from "./signUp";
import { Tabs, Row, Col, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./index.css";

const { TabPane } = Tabs;
const LoginSignupPage = ({ isSignup }) => {
  const [flags, updateFlags] = useState({ activeTab: "1" });
  // const auth = new Auth();
  const auth = useAuth();
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      let res = await auth.loginWithEmail(username, password);
    } catch (error) {
      debugger;
      throw error;
    }
  };

  const signUp = (
    first_name,
    last_name,
    username,
    password,
    password2,
    email,
    role
  ) => {
    return auth.signup(
      first_name,
      last_name,
      username,
      password,
      password2,
      email,
      role
    );
  };

  return (
    <React.Fragment>
      <div className="login-signup-page">
        <Row
          justify="center"
          align="middle"
          style={{
            // paddingBottom: "4rem",
            // maxWidth: "1200px",
            // margin: "0px auto",
            height: "100vh",
            width: "100%",
          }}
        >
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
          <Col span={12}>
            <div
              style={{
                maxWidth: "600px",
                margin: "0px auto",
                padding: "0px 25px",
              }}
            >
              <Typography.Title level={3}>
                {isSignup ? "Sign Up" : "Sign In"}
              </Typography.Title>

              {isSignup ? (
                <SignUpForm onSubmit={signUp} />
              ) : (
                <LoginForm onSubmit={login} />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default LoginSignupPage;

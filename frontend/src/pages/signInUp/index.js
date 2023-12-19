import React, { useState } from "react";

import LoginForm from "./signIn";
import SignUpForm from "./signUp";
import { Tabs, Row, Col, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
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
        <div className="header">
          {/* <Button type="link" onClick={() => navigate(-1)}>
            Back
          </Button> */}
        </div>
        <Row
          justify="center"
          align="middle"
          style={{
            paddingBottom: "4rem",
            maxWidth: "1200px",
            margin: "0px auto",
          }}
        >
          <Col span={12}>
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
              "Crafted by AI, Tailored for Success."
            </Typography.Title>
          </Col>
          <Col span={12}>
            <div
              style={{
                // maxWidth: "600px",
                margin: "0px auto",
                padding: "0px 25px",
              }}
            >
              <Typography.Title level={3}>
                {isSignup ? "Sign Up" : "Sign In"}
              </Typography.Title>
              {/* <Tabs
            value={flags.activeTab}
            onChange={(activeTab) => updateFlags({ ...flags, activeTab })}
          >
            {isSignup ? (
              <TabPane tab="Sign Up" key="2">
                <SignUpForm onSubmit={signUp} />
              </TabPane>
            ) : (
              <TabPane tab="Log In" key="1">
                <LoginForm onSubmit={login} />
              </TabPane>
            )}
          </Tabs> */}
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

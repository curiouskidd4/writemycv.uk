import React, { useState } from "react";

import LoginForm from "./signIn";
import SignUpForm from "./signUp";
import { Tabs, Row, Col, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import "./index.css";

const LoginSignupPage = ({ isSignup }) => {
  const [flags, updateFlags] = useState({ activeTab: "1" });
  // const auth = new Auth();
  const auth = useAuth();
  const navigate = useNavigate();

  const login = async (username, password) => {
    let res = await auth.loginWithEmail(username, password);
    return res;
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
          // justify="center"
          // align="middle"
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
              background: "#000000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
                          <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "-100"
                }}
              >
                <img
                  src="/Linev2.png"
                  style={{
                    width: "100%",
                    // maxWidth: "300px",
                  }}
                />


              </div>
            <div
              style={{
                width: "600px",
                margin: "0px auto",
              }}
            >
              {/* <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/undraw_online_cv_re_gn0a.svg"
                  style={{
                    // width: "60%",
                    maxWidth: "300px",
                  }}
                />
              </div> */}


              <div
                style={{
                  position: "absolute",
                  bottom: "-10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  margin: "1rem 1rem",

                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "100%",
                      paddingBottom: "1rem",
                    }}
                  >
                    <img
                      src="/Logo/WriteMyCV- dark background.png"
                      style={{ width: "100%", maxWidth: "280px" }}
                    />

                    <div className="logo-subtitle">Craft The Perfect CV</div>
                  </div>

                  <img src="/Dots.png" style={{ width: "450px" }} />
                </div>
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
                paddingTop: isSignup ? "4rem" : "8rem",
              }}
            >
              <Typography.Title level={3} className="form-title">
                {isSignup ? "Create new account" : "Welcome Back"}
              </Typography.Title>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                {isSignup ? (
                  <SignUpForm onSubmit={signUp} />
                ) : (
                  <LoginForm onSubmit={login} />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default LoginSignupPage;

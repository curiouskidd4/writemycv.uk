import { Button } from "antd";
import React, { useState, useReducer, useEffect, Fragment } from "react";
import "./index.css";
import ResetPassword from "./resetPassword";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  return (
    <div className="reset-password">
      <div className="header">
        <h1>Reset Password</h1>
        <Button type="link" onClick={() => navigate(-1)}>Back</Button>
      </div>
      <div
        className="wrapper"
        style={{ maxWidth: "500px", margin: "0px auto", padding: "0px 25px" }}
      >
        <ResetPassword />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import React from "react";
import { auth } from "../services/firebase";
import { applyActionCode } from "firebase/auth";
import { Button, Input, Result, Spin, Typography } from "antd";
import { Navigate, useNavigate } from "react-router-dom";

const ResetPassword = ({
  oobCode,
  apiKey,
  continueUrl,
  lang,
}: {
  oobCode: string | null;
  apiKey: string | null;
  continueUrl: string | null;
  lang: string | null;
}) => {
  const [state, setState] = React.useState({
    success: false,
    loading: false,
    error: "",
    newPassword: "",
    newPassword2: "",
    linkVerified: false,
    generateNewLink: false,
  });

  const navigate = useNavigate();
  const handlePasswordReset = async (
    oobCode: string,
    continueUrl: string,
    lang: string,
    newPassword: string
  ) => {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setState((prev) => ({ ...prev, loading: false, success: true }));
    } catch (error: any) {
      console.log(error);
      // setState((prev) => ({ ...prev, error: error.message, loading: false }));

      let code = error.code;
      let message = "";
      if (code === "auth/expired-action-code") {
        message = "The link has expired, please generate a new link.";
      }
      if (code === "auth/invalid-action-code") {
        message = "The link is invalid, please generate a new link.";
      }
      if (code === "auth/user-disabled") {
        message =
          "The user corresponding to the given action code has been disabled.";
      }

      setState((prev) => ({
        ...prev,
        error: message,
        loading: false,
        generateNewLink: true,
      }));
    }
  };

  return (
    <div className="container">
      <Typography.Title level={3}>Reset Password</Typography.Title>
      {/* {state.loading && (
        <>
          <div className="spinner">
            <Spin />
          </div>
          <div className="spinner-text">
            <Typography.Text type="secondary">
              Resetting your password
            </Typography.Text>
          </div>
        </>
      )} */}

      {!state.error  && !state.success && <>
        <Input.Password
          onChange={(e) =>
            setState((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          placeholder="New password"
          style={{ marginBottom: "1rem" }}
        />
        <Input.Password
          placeholder="Re-enter password"
          onChange={(e) =>
            setState((prev) => ({ ...prev, newPassword2: e.target.value }))
          }
          style={{ marginBottom: "1rem" }}
        />

        {state.newPassword != state.newPassword2 && state.newPassword2 && (
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Typography.Text type="danger">
              {" "}
              Passwords do not match{" "}
            </Typography.Text>
          </div>
        )}
        <Button
        loading={state.loading}
          type="primary"
          onClick={() =>
            handlePasswordReset(
              oobCode!,
              continueUrl!,
              lang!,
              state.newPassword
            )
          }
        >
          Reset Password
        </Button>
      </>
}
      {state.error && (
        <div className="error">
          <Result
            status="error"
            title="Reset Password Failed"
            subTitle={state.error}
          />
        </div>
      )}
      {state.success && (
        <div className="success">
          <Result status="success" title="Password Changed Successfully!" />
          <div className="action">
          <Button
            onClick={() => {
              navigate("/signin");
            }}
            type="primary"
            style={{ margin: "0px auto" }}
          >
            Back to Login
            </Button>
        </div>
          </div>)}
      {state.generateNewLink && (
        <div className="action">
          <Button
            onClick={() => {
              navigate("/forgot-password");
            }}
            type="primary"
            style={{ margin: "0px auto" }}
          >
            Generate New Link
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;

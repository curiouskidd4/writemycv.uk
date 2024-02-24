import React from "react";
import { auth } from "../services/firebase";
import { applyActionCode } from "firebase/auth";
import { Button, Result, Row, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const VerifyEmail = ({
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
    loading: true,
    error: "",
    generateNewLink: false,
  });
  const navigate = useNavigate();
  React.useEffect(() => {
    if (oobCode) {
      handleVerifyEmail(oobCode!, continueUrl!, lang!);
    }
  }, [oobCode, continueUrl, lang]);

  const handleVerifyEmail = async (
    oobCode: string,
    continueUrl: string,
    lang: string
  ) => {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.

    try {
      await applyActionCode(auth, oobCode);
      setState((prev) => ({ ...prev, loading: false, success: true }));
    } catch (error: any) {
      console.log(error);
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
        success: false,
        generateNewLink:
          code === "auth/expired-action-code" ||
          code === "auth/invalid-action-code",
      }));
    }
  };

  return (
    <div className="container">
      <div>
        <Typography.Title level={3}>Email Verification</Typography.Title>
      </div>
      {state.loading && (
        <>
          <div className="spinner">
            <Spin />
          </div>
          <div className="spinner-text">
            <Typography.Text type="secondary">
              Verifying your link
            </Typography.Text>
          </div>
        </>
      )}
      {state.success && (
        <div className="success">
          <Result status="success" title="Email Verified" />

          <Row
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => {
                // Refresh the page
                window.location.reload();
              }}
              type="primary"
              style={{ margin: "0px auto" }}
            >
              Start your Repository
            </Button>
          </Row>
        </div>
      )}

      {state.error && (
        <div className="error">
          <Result
            status="error"
            title="Email Verification Failed"
            subTitle={state.error}
          />
        </div>
      )}

      {state.generateNewLink && (
        <div className="action">
          <Button
            onClick={() => {
              navigate("/verification");
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

export default VerifyEmail;

import React from "react";
import VerifyEmail from "./verifyEmail";
import ResetPassword from "./resetPassword";
import RecoveryEmail from "./recoveryEmail";
import "./index.css"
const FirebaseUserMangement = () => {
  // Get all query params
  const queryParams = new URLSearchParams(window.location.search);
  const mode = queryParams.get("mode");
  const oobCode = queryParams.get("oobCode");
  const apiKey = queryParams.get("apiKey");
  const continueUrl = queryParams.get("continueUrl");
  const lang = queryParams.get("lang");

  if (mode == "verifyEmail") {
    return (
      <VerifyEmail
        oobCode={oobCode}
        apiKey={apiKey}
        continueUrl={continueUrl}
        lang={lang}
      />
    );
  } else if (mode == "resetPassword") {
    return (
      <ResetPassword
        oobCode={oobCode}
        apiKey={apiKey}
        continueUrl={continueUrl}
        lang={lang}
      />
    );
  } else if (mode == "recoverEmail") {
    return (
      <RecoveryEmail
        oobCode={oobCode}
        apiKey={apiKey}
        continueUrl={continueUrl}
        lang={lang}
      />
    );
  } else {
    return <div>Invalid mode</div>;
  }
};


export default FirebaseUserMangement;
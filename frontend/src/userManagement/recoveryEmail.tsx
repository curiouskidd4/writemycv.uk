import React, { useEffect } from "react";

import {
  checkActionCode,
  applyActionCode,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebase";
// function handleRecoverEmail(auth, actionCode, lang) {
//   // Localize the UI to the selected language as determined by the lang
//   // parameter.
//   let restoredEmail = null;
//   // Confirm the action code is valid.
//   checkActionCode(auth, actionCode).then((info) => {
//     // Get the restored email address.
//     restoredEmail = info['data']['email'];

//     // Revert to the old email.
//     return applyActionCode(auth, actionCode);
//   }).then(() => {
//     // Account email reverted to restoredEmail

//     // TODO: Display a confirmation message to the user.

//     // You might also want to give the user the option to reset their password
//     // in case the account was compromised:
//     sendPasswordResetEmail(auth, restoredEmail).then(() => {
//       // Password reset confirmation sent. Ask user to check their email.
//     }).catch((error) => {
//       // Error encountered while sending password reset code.
//     });
//   }).catch((error) => {
//     // Invalid code.
//   });
// }

const RecoveryEmail = ({
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
  });

  useEffect(() => {
    if (oobCode) {
      handleRecoverEmail(oobCode!, continueUrl!, lang!);
    }
  }, [oobCode, continueUrl, lang]);

  const handleRecoverEmail = async (
    oobCode: string,
    continueUrl: string,
    lang: string
  ) => {
    // Localize the UI to the selected language as determined by the lang
    // parameter.
    // Try to apply the email verification code.

    try {
      let data = await checkActionCode(auth, oobCode);
      await applyActionCode(auth, oobCode);
      await sendPasswordResetEmail(auth, data.data.email!);
      setState((prev) => ({ ...prev, loading: false, success: true }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Recover Email</h1>

      {state.loading && <p>Loading...</p>}
      {state.success && <p>Success</p>}
      {state.error && <p>{state.error}</p>}
    </div>
  );
};

export default RecoveryEmail;

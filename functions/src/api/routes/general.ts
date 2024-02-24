import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types/requests";
import { ActionCodeSettings, DecodedIdToken } from "firebase-admin/auth";
import { HOST_URL, RESEND_API_KEY } from "../../utils/vars";
import { admin, db } from "../../utils/firebase";
import { sendEmail } from "../../utils/email";
const router = Router();
const oldTemplate = `
<p>Hello %DISPLAY_NAME%,</p>
<p>Follow this link to verify your email address.</p>
<p><a href='%LINK%'>%LINK%</a></p>
<p>If you didn’t ask to verify this address, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your %APP_NAME% team</p>
`;
const actiionUrl = "https://resu-me-a5cff.firebaseapp.com/__/auth/action";
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  
    <div style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 20px auto; padding: 2rem 20px; text-align: center;">
      <div >
        <img src="https://resu-me-a5cff.web.app/logo.png" style="height:67px"/>
      </div>
      
       
        <p style="margin: 0; margin-top: 2rem;text-align: left; font: normal normal bold 25px/12px Arial; height: 34px ">Hi {displayName},</p>
        <p style="margin: 0; margin-top: 1rem; text-align: left; font:normal normal normal 16px/22px Arial;">Welcome to WriteMyCV. You are one step away from creating the perfect CV. Click below to verify your email.</p>
        
<a href="{link_to_verification}" style="text-decoration: none; color: black; background-color: #37fdaa; padding: 10px 20px; border-radius: 12px; font-size: 16px; font-weight: bold; margin-top: 2rem; display: inline-block;">Verify Email</a>

      <p style="margin: 0; text-align: left; font:normal normal normal 16px/22px Arial;">If you did not create an account, please ignore this email or contact us at <a href="emailto:support@writemycv.uk" style="color:#a774ff">support@writemycv.uk</a></p>
        <p style="margin: 0; text-align: left;"><br>WriteMyCV Team</p>
        <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #666666;">
            
        </div>
    </div>
</body>
</html>
`;

const resetPasswordTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100;0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;0,9..40,1000;1,9..40,100;1,9..40,200;1,9..40,300;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700;1,9..40,800;1,9..40,900;1,9..40,1000&display=swap" rel="stylesheet">

</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  
    <div style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 20px auto; padding: 2rem 20px; text-align: center;">
      <div >
    <img src="https://resu-me-a5cff.web.app/logo.png" style="height:67px"/>
  </div>
      
       
        <p style="margin: 0; margin-top: 2rem;text-align: left; font: normal normal bold 25px/12px Arial; height: 34px ">Hi {displayName},</p>
        <p style="margin: 0; margin-top: 1rem; text-align: left; font:normal normal normal 16px/22px Arial;">You recently requested to reset your password for your account. Click the link below to set up a new password:</p>
        

        <a href="{link_to_verification}" style="text-decoration: none; color: black; background-color: #37fdaa; padding: 10px 20px; border-radius: 12px; font-size: 16px; font-weight: bold; margin-top: 2rem; display: inline-block;">Reset Password</a>
      <p style="margin: 0; text-align: left; font:normal normal normal 16px/22px Arial;">If you did not request a password reset, please ignore this email or contact us at <a href="emailto:support@writemycv.uk" style="color:#a774ff">support@writemycv.uk</a></p>
        <p style="margin: 0; text-align: left;"><br>WriteMyCV Team</p>
        <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #666666;">
            
        </div>
    </div>
</body>
</html>
`;

const sendVerificationEmail = async (user: DecodedIdToken, name: string) => {
  // Load user from firebase 
  let firebaseUser = await db.collection("users").doc(user.uid).get() ;
  const email = user.email;
  if (!email) {
    throw new Error("Email not found");
  }

  console.log(firebaseUser.data()!.first_name, user.name)
  const displayName = firebaseUser.data()!.first_name || user.name;
  const actionCodeSettings: ActionCodeSettings = {
    url: `${HOST_URL.value()}/resumes`,
    handleCodeInApp: true,
  };
  console.log(actionCodeSettings);

  let link = await admin
    .auth()
    .generateEmailVerificationLink(email, actionCodeSettings);
  // Replace the host url
  console.log(link);
  link = HOST_URL.value()+ "/usermgmt/"  + "?apiKey=" + link.split("?apiKey=")[1];

  const emailHTML = template
    .replace("{displayName}", displayName!)
    .replace("{link_to_verification}", link);
  await sendEmail(email, "Verify your email address", emailHTML);
};


const sendResetPasswordEmail = async (email: string) => {

  const displayName = "User";
  const actionCodeSettings: ActionCodeSettings = {
    url: `${HOST_URL.value()}/resumes`,
    handleCodeInApp: true,
  };
  console.log(actionCodeSettings);

  let link = await admin
    .auth()
    .generatePasswordResetLink(email, actionCodeSettings);
  // Replace the host url
  console.log(link);
  link = HOST_URL.value() + "/usermgmt/" + "?apiKey=" + link.split("?apiKey=")[1];

  const emailHTML = resetPasswordTemplate
    .replace("{displayName}", displayName!)
    .replace("{link_to_verification}", link);
  await sendEmail(email, "Reset your password", emailHTML);
}

router.post(
  "/send-reset-password-email",
  async (req: CustomRequest, res: Response) => {
    let email = req.body.email;
    if (!email) {
      res.status(400).send("User not found");
      return;
    }

    try {
      await sendResetPasswordEmail(email);
      res.status(200).send({
        status: "success",
        message: "Email sent",
      
      });
      return;
    } catch (error: any) {
      let info = error.errorInfo;
      res.status(400).send({
        status: "error",
        message:  info.message,
        code: info.code
      });
      return;
    }
  }
);
router.post(
  "/send-verification-email",
  async (req: CustomRequest, res: Response) => {
    let user = req.user;
    let name = req.body.name as any;
    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    try {
      await sendVerificationEmail(user, name);
      res.status(200).send("Email sent");
      return;
    } catch (error) {
      console.log(error);
      res.status(400).send("Error sending email");
      return;
    }
  }
);

export default router;

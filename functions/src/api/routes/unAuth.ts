import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types/requests";
import { ActionCodeSettings, DecodedIdToken } from "firebase-admin/auth";
import { HOST_URL, RESEND_API_KEY } from "../../utils/vars";
import { admin } from "../../utils/firebase";
import { sendEmail } from "../../utils/email";
const router = Router();


const resetPasswordTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; width: 100%; max-width: 600px; margin: 20px auto; padding: 2rem 20px; text-align: center;">
      
        <h1 style="margin: 0;text-align: left;">Reset Password</h1>
        <p style="margin: 0;text-align: left;">Hi {displayName},</p>
        <p style="margin: 0; text-align: left;">Please click the button below to reset your password</p>
        <p style="margin: 0; text-align: left;">If you did not request this, please ignore this email or contact us at support@writemycv.uk</p>
        <a href="{link_to_verification}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #009688; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">Verify Email</a>
        <p style="margin: 0; text-align: left;"><br>Resu.me Team</p>
        <div style="text-align: center; margin-top: 20px; font-size: 0.8em; color: #666666;">
            <p style="margin: 0;">Need Support?</p>
            <p style="margin: 0;">Feel free to email us if you have any questions, comments or suggestions. We'll be happy to resolve your issues.</p>
        </div>
    </div>
</body>
</html>
`;



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
  link = HOST_URL.value() + "/usermgmt?apiKey=" + link.split("?apiKey=")[1];

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

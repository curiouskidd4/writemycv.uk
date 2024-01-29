import { Resend } from "resend";
import { RESEND_API_KEY } from "./vars";


const sendEmail = async (email: string, subject: string, html: string) => {
    const resend = new Resend(RESEND_API_KEY.value());

  await resend.emails.send({
    from: "support@writemycv.uk",
    to: email,
    subject: subject,
    html: html,
  });
};

export { sendEmail };
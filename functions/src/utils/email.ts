import { Resend } from "resend";
import { RESEND_API_KEY } from "./vars";


const sendEmail = async (email: string, subject: string, html: string) => {
    const resend = new Resend(RESEND_API_KEY.value());

  let response = await resend.emails.send({
    from: "support@writemycv.uk",
    to: email,
    subject: subject,
    html: html,
  });

  console.log(response.data, response.error?.message, response.error?.name);
};

export { sendEmail };
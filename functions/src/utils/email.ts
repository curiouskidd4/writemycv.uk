import { Resend } from "resend";
import { RESEND_API_KEY } from "./vars";
import { captureException } from "./sentry";

const sendEmail = async (email: string, subject: string, html: string) => {
  const resend = new Resend(RESEND_API_KEY.value());

  let response = await resend.emails.send({
    from: "support@writemycv.uk",
    to: email,
    subject: subject,
    html: html,
  });

  if (response.error) {
    captureException(new Error(`Error sending email`), {
      message: response.error.message,
      context: { name: response.error.name, subject: subject },
    });
  }
  console.log(response.data, response.error?.message, response.error?.name);
};

export { sendEmail };

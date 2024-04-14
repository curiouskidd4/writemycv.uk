import { Button, Input, Row, Space, Typography, message } from "antd";
import { useAuth } from "../../contexts/authContext";
import { useState } from "react";
import { Link } from "react-router-dom";

const EmailVerification = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const onLogout = () => {
    auth.logout();
  };

  const onResendEmail = () => {
    setLoading(true);
    auth.sendVerificationEmailCustom()
      .then(() => {
        setLoading(false);
        message.success("Email sent successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        message.error("Error sending email");
      });

    // auth.sendVerificationEmailCustom() .then(() => {
    //   setLoading(false);
    //   message.success("Email sent successfully");
    // })
    // .catch((err) => {
    //   setLoading(false);
    //   console.log(err);
    //   message.error("Error sending email");
    // });
  }
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div>
        <div>
          <Typography.Title level={3}>
            Verify your email address
          </Typography.Title>

          <Row style={{marginTop: "1rem"}}>
            <Typography.Text type="secondary">
              We have sent you an email. Please click on the link in the email
              to verify your email address. Make sure to check your spam folder if you don't see the email in your inbox.
            </Typography.Text>
          </Row>

          <Row style={{marginTop: "1rem"}}>
            {/* <Typography.Text>{auth.user?.email}</Typography.Text>
             */}
             <Input size="large" value={auth.user?.email} disabled />
          </Row>
          <Row style={{marginTop: "1.5rem"}}>
            <Space>
          <Button
          
            loading={loading}
            type="primary"
            onClick={onResendEmail}
          >
            Resend email
          </Button>
          <Button type="text" onClick={onLogout}>
            Logout
          </Button>
          </Space>
          </Row>

          {/* <Typography.Text type="secondary">
        Need help with email verification?{" "}
        <Link to="/contact-us">Contact us</Link>
      </Typography.Text> */}

          {/* <Typography.Text type="secondary">
        <Button onClick={onLogout}>Logout</Button>
      </Typography.Text> */}
        </div>
      </div>
    </div>
  );
};
export default EmailVerification;

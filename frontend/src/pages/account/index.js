import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Typography,
  message,
} from "antd";
import { PhoneInput } from "../coolForm/inputs/phoneInput";
import { useAuth } from "../../authContext";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrownOutlined } from "@ant-design/icons";

let stripeDashboardURL =
  "https://billing.stripe.com/p/login/test_28o3fYaln3oTenC7ss";
const ProfileDetails = ({ user, firestoreUser }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await userMutation.mutate(values);
      message.success("Profile updated successfully");
    } catch (err) {
      message.error("Error updating profile");
    }
  };

  const userMutation = useMutateDoc("users", user.uid, true);
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          firstName: firestoreUser.firstName || user.displayName?.split(" ")[0],
          lastName: firestoreUser.lastName || user.displayName?.split(" ")[1],
          email: user.email,
          phoneNumber: firestoreUser.phoneNumber,
        }}
      >
        <Row
          wrap
          style={{
            width: "100%",
          }}
          gutter={[12, 12]}
        >
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please enter your first name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please enter your last name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
                {
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input type="email" disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Form.Item name="phoneNumber" label="Phone Number">
              <PhoneInput size="middle" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button htmlType="submit" loading={userMutation.loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const DeleteConfirmModal = ({ visible, onOk, onCancel, email, user }) => {
  const [state, setState] = useState({
    email: "",
    deleteCompleted: false,
  });
  const navigate = useNavigate();

  const { logout } = useAuth();

  useEffect(() => {
    if (state.deleteCompleted) {
      setTimeout(async () => {
        // Logout the user
        await logout();
        navigate("/");
        // Redirect to home page
      }, 3000);
      // Also logout the user
    }
  }, [state]);

  const onDelete = async () => {
    try {
      await userMutation.mutate({
        delete: true,
        deletedOn: new Date(),
      });
      setState((prevState) => ({
        ...prevState,
        deleteCompleted: true,
      }));
    } catch (err) {}
  };

  const userMutation = useMutateDoc("users", user.uid, true);

  return (
    <>
      {" "}
      {state.deleteCompleted && (
        <Modal visible={visible} title="Account Deleted">
          <Typography.Text type="secondary">
            Your account has been successfully deleted. We are sorry to see you
            go. You will be redirected to the home page. You would be logged out
            in 3 seconds.
          </Typography.Text>
        </Modal>
      )}
      {!state.deleteCompleted && (
        <Modal
          visible={visible}
          onCancel={onCancel}
          title="Delete Account"
          footer={[
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>,
            <Button
              key="delete"
              danger
              disabled={state.email != email}
              onClick={() => {
                if (state.email == email) {
                  onDelete();
                } else {
                  message.error("Email does not match");
                }
              }}
            >
              Delete
            </Button>,
          ]}
        >
          <Typography.Text type="secondary">
            Are you sure you want to delete your account?
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            This action is irreversible. We will delete all your data from our
            servers.
          </Typography.Text>

          <div
            style={{
              marginTop: "1rem",
            }}
          >
            <Typography.Text type="secondary">
              Please enter your email address to confirm that you want to delete
              your account.
            </Typography.Text>
            <Input
              value={state.email}
              onChange={(e) => {
                setState((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }));
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

const AccountSettings = () => {
  const [state, setState] = useState({
    deleteModalVisible: false,
  });
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();

  const firestoreUser = useDoc("users", auth.user.uid);

  const toggleDeleteModal = () => {
    setState((prevState) => ({
      ...prevState,
      deleteModalVisible: !prevState.deleteModalVisible,
    }));
  };

  let currentTimestamp = new Date();
  let isExpired = firestoreUser.data?.expiry
    ? firestoreUser.data?.expiry.toDate() < currentTimestamp
    : true;

  console.log(firestoreUser.data?.subscriptionId, isExpired);
  return (
    <div>
      <DeleteConfirmModal
        user={user}
        visible={state.deleteModalVisible}
        onOk={() => {
          // auth.deleteUser();
        }}
        onCancel={toggleDeleteModal}
        email={user.email}
      />
      <Typography.Title level={2}>Account Settings</Typography.Title>
      {firestoreUser.loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spin />
        </div>
      )}
      {!firestoreUser.loading && (
        <>
          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Typography.Text type="secondary">Your Plan</Typography.Text>
            </div>
            <Card>
              {firestoreUser.data?.subscriptionId && !isExpired && (
                <Row align="middle" justify="space-between" gutter={[12, 12]}>
                  <Col>
                    <Typography.Text>
                      You are currently on the{" "}
                      <CrownOutlined
                        style={{
                          padding: "0px 5px",
                        }}
                      />
                      Pro plan. Your plan will expire on{" "}
                      {firestoreUser.data?.expiry.toDate().toDateString()}.
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => window.open(stripeDashboardURL, "_blank")}
                    >
                      Manage Subscription
                    </Button>
                  </Col>
                </Row>
              )}
              {(!firestoreUser.data?.subscriptionId || isExpired) && (
                <Row align="middle" justify="space-between" gutter={[12, 12]}>
                  <Col>
                    <Typography.Text>
                      You are currently on the Free plan. Upgrade to the Pro
                      plan to get access to all pro features. Pro features
                      include unlimited resumes, AI powered resume suggestions,
                      and more.
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Button onClick={() => navigate("/upgrade")} type="primary">
                      Upgrade
                    </Button>
                  </Col>
                </Row>
              )}
            </Card>
          </div>
          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Typography.Text type="secondary">Account</Typography.Text>
            </div>
            <Card>
              <ProfileDetails user={user} firestoreUser={firestoreUser.data} />
            </Card>
          </div>
          <div>
            <div
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Typography.Text type="secondary">Danger Zone</Typography.Text>
            </div>
            <Card>
              <Row align="middle" justify="space-between" gutter={[12, 12]}>
                <Col>
                  <Typography.Text>
                    Select this option to delete your account. This action is
                    irreversible. We will delete all your data from our servers.
                  </Typography.Text>
                </Col>
                <Col>
                  <Button danger onClick={toggleDeleteModal}>
                    Delete Account
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountSettings;

import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tabs,
  Typography,
  message,
} from "antd";
import { PhoneInput } from "../../components/phoneInput";
import { useAuth } from "../../contexts/authContext";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrownOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import UpdatableProfilePic from "../../components/profilePic/updatableProfilePic";
import "./index.css"
import YourPlan from "./plan";
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
      <Row gutter={24}>
        <Col>
        <UpdatableProfilePic />
        </Col>
        <Col flex="auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            firstName:
              firestoreUser.firstName || user.displayName?.split(" ")[0],
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
            <Button
              htmlType="submit"
              loading={userMutation.loading}
              type="primary"
              style={{
                float: "right",
              }}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
        </Col>
      </Row>
    </div>
  );
};

const ChangePassword = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();

  const onFinish = async (values) => {
    // Check if new password and confirm new password match
    if (values.newPassword != values.confirmNewPassword) {
      message.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await auth.reautheticate(values.currentPassword);
      await auth.resetPassword(values.newPassword);
      form.resetFields();
      message.success("Password updated successfully");
    } catch (err) {
      debugger;
      message.error("Error updating password");
    }
    setLoading(false);
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row
          wrap
          style={{
            width: "100%",
          }}
          gutter={[12, 12]}
        >
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your new password",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              label="Confirm New Password"
              name="confirmNewPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password",
                },
                // Match passwords
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button htmlType="submit" loading={loading} type="primary" style={{
            float: "right",
          
          }}>
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
        <Modal
          visible={visible}
          title="Account Deleted"
          className="default-modal"
        >
          <Typography.Text type="secondary">
            Your account has been successfully deleted. We are sorry to see you
            go. You will be redirected to the home page. You would be logged out
            in 3 seconds.
          </Typography.Text>
        </Modal>
      )}
      {!state.deleteCompleted && (
        <Modal
          className="default-modal"
          visible={visible}
          onCancel={onCancel}
          // title="Delete Account"
          footer={[
            <Button
              type="link"
              key="cancel"
              onClick={onCancel}
              className="black"
            >
              Cancel
            </Button>,
            <Button
              type="primary"
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
          <Typography.Title level={3}>
            Are you sure you want to delete your account?
          </Typography.Title>
          <br />
          <div
            style={{
              padding: "20px 20px",
              borderRadius: "10px",
              backgroundColor: "var(--accent-2-light)",
            }}
          >
            <Typography.Text>
              This action is irreversible. We will delete all your data from our
              servers.
            </Typography.Text>
          </div>

          <div
            style={{
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                marginBottom: "0.5rem",
              }}
            >
              <Typography.Text>
                Please enter your email address to confirm that you want to
                delete your account.
              </Typography.Text>
            </div>
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
    <div className="settings-view">
      <DeleteConfirmModal
        user={user}
        visible={state.deleteModalVisible}
        onOk={() => {
          // auth.deleteUser();
        }}
        onCancel={toggleDeleteModal}
        email={user.email}
      />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={<Typography.Title level={5}>Account Settings</Typography.Title>}
          key="1"
        >
          <div>
            {!firestoreUser.loading && (
              <>
                <div
                  style={{
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      margin: "1.5rem 0rem",
                    }}
                  >
                    {/* <Typography.Text type="secondary">Account</Typography.Text> */}
                    <ProfileDetails
                      user={user}
                      firestoreUser={firestoreUser.data}
                    />
                  </div>
                  
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
                    <Typography.Text type="secondary" className="section-header">
                      Change Password
                    </Typography.Text>
                  </div>
                  <div className="section">
                    <ChangePassword
                      user={user}
                      firestoreUser={firestoreUser.data}
                    />
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Typography.Text type="secondary" className="section-header danger">
                      Danger Zone
                    </Typography.Text>
                  </div>
                  <Card>
                    <Row
                      align="middle"
                      justify="space-between"
                      gutter={[12, 12]}
                    >
                      <Col>
                        <Typography.Text>
                          Select this option to delete your account. This action
                          is irreversible. We will delete all your data from our
                          servers.
                        </Typography.Text>
                      </Col>
                      <Col>
                        <Button
                          danger
                          onClick={toggleDeleteModal}
                          type="primary"
                        >
                          Delete Account
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<Typography.Title level={5}>Plan & Billing</Typography.Title>}
          key="2"
        >
          <div>
            {!firestoreUser.loading && (
              <>
                <div
                  style={{
                    marginBottom: "1.5rem",
                  }}
                >
                 
                    {/* {firestoreUser.data?.subscriptionId && !isExpired && (
                      <Row
                        align="middle"
                        justify="space-between"
                        gutter={[12, 12]}
                      >
                        <Col>
                          <Typography.Text>
                            You are currently on the{" "}
                            <CrownOutlined
                              style={{
                                padding: "0px 5px",
                              }}
                            />
                            Pro plan. Your plan will expire on{" "}
                            {firestoreUser.data?.expiry.toDate().toDateString()}
                            .
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Button
                            onClick={() =>
                              window.open(stripeDashboardURL, "_blank")
                            }
                          >
                            Manage Subscription
                          </Button>
                        </Col>
                      </Row>
                    )}
                    {(!firestoreUser.data?.subscriptionId || isExpired) && (
                      <Row
                        align="middle"
                        justify="space-between"
                        gutter={[12, 12]}
                      >
                        <Col>
                          <Typography.Text>
                            You are currently on the Free plan. Upgrade to the
                            Pro plan to get access to all pro features. Pro
                            features include unlimited resumes, AI powered
                            resume suggestions, and more.
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Button
                            onClick={() => navigate("/upgrade")}
                            type="primary"
                          >
                            Upgrade
                          </Button>
                        </Col>
                      </Row>
                    )} */}
                    <YourPlan />
                </div>
              </>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>

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
    </div>
  );
};

export default AccountSettings;

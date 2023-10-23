import React from "react";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Typography,
  Skeleton,
  message,
} from "antd";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import { useAuth } from "../../../authContext";
import { PhoneInput } from "../../coolForm/inputs/phoneInput";

const PersonalInfoForm = ({ onFinish, initialValues, isLoading }) => {
  const [form] = Form.useForm();
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  return (
    <Form
      name="personal_info"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
      }}
      scrollToFirstError
      layout="vertical"
    >
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* </Row>
          <Row gutter={24}> */}
        <Col {...colSpan}>
          <Form.Item
            name="currentRole"
            label="Current Role"
            rules={[
              {
                required: true,
                message: "Please input your current role!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            {/* <Input
              addonBefore="+91"
              style={{
                width: "100%",
              }}
            /> */}
            <PhoneInput size="medium" />
          </Form.Item>
        </Col>
        {/* </Row>
          <Row gutter={24}> */}
        <Col {...colSpan}>
          <Form.Item
            name="linkedin"
            label="LinkedIn"
            rules={[
              {
                type: "url",
                message: "The input is not valid url!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item name="location" label="Your Location">
            <Input
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col>
        {/* </Row>

          <Row> */}
        {/* <Col {...colSpan}>
          <Form.Item name="city" label="City">
            <Input
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Col> */}
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Save
        </Button>
        {/* <Button htmlType="button" onClick={onReset}>
          Reset
        </Button> */}
      </Form.Item>
    </Form>
  );
};

const PersonalInfoSection = () => {
  const { user } = useAuth();

  const personalInfo = useDoc("personalInfo", user.uid);
  const updateProfile = useMutateDoc("personalInfo", user.uid, true);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    updateProfile
      .mutate(values)
      .then(() => {
        // console.log("Profile updated successfully");
        message.success("Profile updated successfully");
      })
      .catch((err) => {
        // console.log("Profile update failed");
        message.error("Profile update failed");
      });
  };

  return (
    <div>
      <Typography.Title level={3}>Personal Information</Typography.Title>
      {personalInfo.loading ? <Skeleton /> : null}
      {!personalInfo.loading && (
        <PersonalInfoForm
          onFinish={onFinish}
          initialValues={personalInfo.data}
          isLoading={updateProfile.loading}
        />
      )}
    </div>
  );
};

export { PersonalInfoForm, PersonalInfoSection };

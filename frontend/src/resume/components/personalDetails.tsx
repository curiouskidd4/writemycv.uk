import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import React, { useCallback } from "react";
import { PhoneInput } from "../../pages/coolForm/inputs/phoneInput";
import _ from "lodash";

type PersonalDetailsProps = {
  initialValues?: any;
  onFinish?: (values: any) => Promise<void>;
  syncPersonalInfo: (values: any) => Promise<void>;
  showTitle?: boolean;
};

const PersonalDetails = ({
  initialValues,
  onFinish,
  syncPersonalInfo,
  showTitle = true,
}: PersonalDetailsProps) => {
  const [loading, setLoading] = React.useState(false);

  const debounceSave = useCallback(
    _.debounce(async (values: any) => {
      setLoading(true);
      await syncPersonalInfo(values);
      if (onFinish) {
        await onFinish(values);
      }
      setLoading(false);
    }, 1000),
    [syncPersonalInfo, onFinish]
  );

  const onSubmit = async (values: any) => {
    setLoading(true);
    await syncPersonalInfo(values);
    if (onFinish) {
      await onFinish(values);
    }
    setLoading(false);
  };

  const handleChange = async (value: any, changedValues: any) => {
    // Check if the value has changed

    if (JSON.stringify(initialValues) !== JSON.stringify(changedValues)) {
      setLoading(true);
      await debounceSave(changedValues);
    }
  };
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  return (
    <div className="personal-info-form resume-edit-detail padding">
        <div className="detail-form-header">
          {/* <Typography.Title level={4}>Personal Info</Typography.Title>
           */}
          <Row align="middle" justify="space-between" style={{ width: "70%" }}>
            <div className="profile-input-section-title">
              <Typography.Title level={4} style={{
                marginBottom: "0px"
              }}>Personal Info</Typography.Title>
            </div>
            {loading ? (
              <div className="auto-save-label-loading">
                Saving changes <i className="fa-solid fa-cloud fa-beat"></i>
              </div>
            ) : (
              <div className="auto-save-label-success">
                Saved <i className="fa-solid fa-cloud"></i>
              </div>
            )}
          </Row>
        </div>
      <div className="detail-form-body">
        <Form
          name="personal_info"
          // onFinish={onSubmit}
          initialValues={{
            ...initialValues,
          }}
          onValuesChange={handleChange}
          scrollToFirstError
          layout="vertical"
        >
          <div className="cv-input">
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
                <Form.Item name="location" label="Your Location">
                  <Input
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
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
            </Row>
          </div>
          {/* <div className="cv-submit">
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </div> */}
        </Form>
      </div>
    </div>
  );
};

export default PersonalDetails;

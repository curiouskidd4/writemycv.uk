import { Button, Col, Form, Input, Row, Select, Typography } from "antd";
import React, { useCallback } from "react";
import { PhoneInput } from "../../../pages/coolForm/inputs/phoneInput";
import _ from "lodash";
import EditorJsInput from "../../../components/editor";

type PersonalDetailsProps = {
  initialValues?: any;
  onFinish?: (values: any) => Promise<void>;
  syncPersonalInfo: (values: any) => Promise<void>;
  showTitle?: boolean;
};

const CandidateDetails = ({
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
    // Make sure required fields are there
    // console.log("Changed values", changedValues);

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
      <div className="detail-form-header" style={{
        marginBottom: "0px",
      }}>
        {/* <Typography.Title level={4}>Personal Info</Typography.Title>
         */}
        <Row align="middle" justify="space-between" style={{ width: "70%" }}>
          <div className="profile-input-section-title">
            <Typography.Title
              level={4}
              style={{
                marginBottom: "0px",

              }}
            >
              Candidate Details
            </Typography.Title>
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
      <div className="detail-form-body" style={{
        marginTop: "12px",
      }}>
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
                  label="Job title"
                  rules={[
                    {
                      required: true,
                      message: "Please input candidate's current job title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item name="location" label="Location" rules={[]}>
                  <Input />
                </Form.Item>
              </Col>

              {/* </Row>
          <Row gutter={24}> */}

              <Col {...colSpan}>
                <Form.Item name="salaryExpectation" label="Salary Expectation">
                  <Input
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col {...colSpan}>
                <Form.Item name="availability" label="Availability" rules={[]}>
                  <Input />
                </Form.Item>
              </Col>
              <div className="profile-input-section-title">
                <Typography.Title
                  level={4}
                  style={{
                    marginLeft: "8px",
                    marginTop: "24px",
                  }}
                >
                  Candidate Summary
                </Typography.Title>
              </div>
              <Col span={24}>
                <Form.Item name="summary" label="" rules={[]}>
                  <EditorJsInput
                    name="summary"
                    value={initialValues?.summary}
                    onChange={(summary: string) =>
                      handleChange("summary", { summary })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>{/* <Input.TextArea rows={10} /> */}</div>
        </Form>
      </div>
    </div>
  );
};

export default CandidateDetails;

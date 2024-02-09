import { Button, Form, Input, Select, Typography } from "antd";
import React from "react";

type CVGoalsProps = {
  initialValues?: any;
  onFinish?: (values: any) => Promise<void>;
  syncResumeDetails: (values: any) => Promise<void>;
//   saveLoading?: boolean;
};
const CVGoals = ({ initialValues, onFinish, syncResumeDetails }: CVGoalsProps) => {
  const [form] = Form.useForm();
    const [saveLoading, setSaveLoading] = React.useState(false);

  const onSubmit = async (values: any) => {
    setSaveLoading(true);
    await syncResumeDetails(
        {
            name: values.name,
            targetRole: values.targetRole || null,
            jobDescription: values.jobDescription || null,
        }
    );
    if (onFinish) {
      await onFinish(values);
    }
    setSaveLoading(false);
  }

  return (
    <div className="resume-edit-detail padding">
      <div className="detail-form-header">
        <Typography.Title level={4}>CV Goals</Typography.Title>
      </div>
      <div className="detail-form-body">
        <Form
          name="basic"
          layout="vertical"
          form={form}
          style={{
            maxWidth: "600px",
          }}
          initialValues={initialValues}
          onFinish={onSubmit}
        >
          <div className="cv-input">
            <Form.Item
              label="Resume Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input resume name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mention roles you are targeting"
              name="targetRole"
              rules={[]}
            >
              <Input style={{ width: "100%" }} placeholder="Roles"></Input>
            </Form.Item>

            <Form.Item
              label="Job Description (Paste job description or link to job posting)"
              name="jobDescription"
              rules={[]}
            >
              <Input.TextArea
                placeholder="Mention job description you are targeting"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </div>
          <div className="cv-submit">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "20px" }}
                loading={saveLoading}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default CVGoals;

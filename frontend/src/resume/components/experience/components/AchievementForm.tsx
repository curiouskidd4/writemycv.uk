import {
  Button,
  Col,
  Form, Row
} from "antd";
import React, { useEffect } from "react";
import Achievements from "./achievements";
import { fullColSpan } from "./experienceEditForm";

type AchievementFormProps = {
  initialValues?: any;
  position: string;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};
export const AchievementForm = ({
  initialValues, position, onFinish,
}: AchievementFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
  }, [initialValues]);

  return (
    <Form
      name="basic"
      layout="vertical"
      form={form}
      style={{
        // maxWidth: "600px",
      }}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={fullColSpan}>
          <Form.Item name={["achievements"]} rules={[]}>
            <Achievements jobTitle={position} />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

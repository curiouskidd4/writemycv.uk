import React, { useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import dayjs from "dayjs";

const fullColSpan = 24;
type DetailFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

export const DetailForm = ({ initialValues, onFinish }: DetailFormProps) => {
  const [form] = Form.useForm();
  if (initialValues?.date){
    initialValues = {...initialValues, date: dayjs(initialValues.date.toDate())}

  }
  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date : dayjs(initialValues.date?.toDate())
      });
    }
    
  }, [initialValues]);

  // Correct the date
  
  return (
    <Form
      name="basic"
      layout="vertical"
      form={form}
      style={{
        maxWidth: "600px",
      }}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={fullColSpan}>
          <Form.Item
            name={["title"]}
            label="Award Title"
            rules={[
              {
                required: true,
                message: "Please enter a title!",
              },
            ]}
          >
            <Input placeholder="Award title" />
          </Form.Item>
        </Col>
        <Col span={fullColSpan}>
          <Form.Item
            name={["date"]}
            label="Date"
            rules={[
              {
                required: true,
                message: "Please input Degree!",
              },
            ]}
          >
            <DatePicker picker="month" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={fullColSpan}>
        <Form.Item
          name={["description"]}
          label="Description"
          rules={[
            {
              required: true,
              message: "Please enter a description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default DetailForm;

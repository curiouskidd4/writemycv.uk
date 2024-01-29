import React, { useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import CustomDateRange from "../../../../components/dateRange";

const fullColSpan = 24;
type DetailFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

export const DetailForm = ({ initialValues, onFinish }: DetailFormProps) => {
  const [form] = Form.useForm();

  if (initialValues?.startDate) {
    let startDate = initialValues?.startDate;
      let endDate = initialValues?.endDate;
      startDate = dayjs(startDate.toDate());
      endDate = endDate ? dayjs(endDate.toDate()) : null;
    initialValues = {
      ...initialValues,
      dateRange: [startDate, endDate],
    };
  }

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      // Correct the date
      let startDate = initialValues?.startDate;
      let endDate = initialValues?.endDate;
      startDate = dayjs(startDate.toDate());
      endDate = endDate ? dayjs(endDate.toDate()) : null;

      
      form.setFieldsValue({
        ...initialValues,
        dateRange: [startDate, endDate],
      });
    }
  }, [initialValues]);

  const onSave = (values: any) => {
    let startDate = values.dateRange[0];
    let endDate = values.dateRange[1];
    values.startDate = startDate;
    values.endDate = endDate;
    delete values.dateRange;
    if (onFinish) {
      onFinish(values);
    }
  };


  return (
    <Form
      name="basic"
      layout="vertical"
      form={form}
      style={{
        maxWidth: "600px",
      }}
      initialValues={initialValues}
      onFinish={onSave}
    >
      <Row gutter={24}>
        <Col span={fullColSpan}>
          <Form.Item
            name={["title"]}
            label="Title"
            rules={[
              {
                required: true,
                message: "Please enter a title!",
              },
            ]}
          >
            <Input placeholder="Title" />
          </Form.Item>
        </Col>
        <Col span={fullColSpan}>
          <Form.Item
            name={["dateRange"]}
            label="Start & End Date"
            rules={[
              {
                required: true,
                message: "Please enter start & end date!",
              },
            ]}
          >
            <CustomDateRange
              checkBoxText="Currently Working Here"
              picker="month"
              allowEmpty={[false, true]}
            />
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

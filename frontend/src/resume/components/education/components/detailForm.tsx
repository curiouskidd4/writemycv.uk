import {
  Button, Col,
  Form,
  Input, Row
} from "antd";
import React, { useEffect } from "react";
import CustomDateRange from "../../../../components/dateRange";

const colSpan = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};
const fullColSpan = 24;
type DetailFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};
export const DetailForm = ({ initialValues, onFinish }: DetailFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // console.log(initialValues);
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
        maxWidth: "600px",
      }}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={fullColSpan}>
          <Form.Item
            name={["school"]}
            label="School/College/University"
            rules={[
              {
                required: true,
                message: "Please input School!",
              },
            ]}
          >
            <Input placeholder="School" />
          </Form.Item>
        </Col>
        <Col span={fullColSpan}>
          <Form.Item name={["degree"]} label="Degree/Major" rules={[
            {
              required: true,
              message: "Please input Degree!",
            },
          ]}>
            <Input placeholder="Degree" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            name={["dateRange"]}
            label="Start & End Date"
            rules={[
              {
                required: true,
                message: "Start & End Date!",
              },
            ]}
          >
            <CustomDateRange
              checkBoxText="Currently Studying"
              picker="year"
              allowEmpty={[false, true]} />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item name={["location"]} label="City" rules={[]}>
            <Input />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item name={["grade"]} label="GPA/Grade" rules={[]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

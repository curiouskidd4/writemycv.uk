import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect } from "react";
import CustomDateRange from "../../../../components/dateRange";
import { fullColSpan, colSpan } from "./experienceEditForm";

type DetailFormProps = {
  initialValues?: any;
  onChange: (values: any) => void;
  saveLoading?: boolean;
};
export const DetailForm = ({ initialValues, onChange }: DetailFormProps) => {
  useEffect(() => {

    form.setFieldsValue({
      ...initialValues,
    });
  }, []);

  const handleChange = (changedValues: any, values: any) => {
    // Check if value has changed only then push

    onChange(values);
  };

  const [form] = Form.useForm();
  return (
    <div className="user-input-area">
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onValuesChange={handleChange}
        style={
          {
            // maxWidth: "600px",
          }
        }
        initialValues={initialValues}
        // onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={fullColSpan}>
            <Form.Item
              name={["position"]}
              label="Job Title"
              rules={[
                {
                  required: true,
                  message: "Please input Job Title!",
                },
              ]}
            >
              <Input placeholder="Job Title" />
            </Form.Item>
          </Col>
          <Col span={fullColSpan}>
            <Form.Item
              name={["employerName"]}
              label="Employer"
              rules={[
                {
                  required: true,
                  message: "Please input employer!",
                },
              ]}
            >
              <Input placeholder="Employer" />
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
              {/* <DatePicker.RangePicker picker="month" allowEmpty={[false, true]} />
               */}
              <CustomDateRange
                checkBoxText="Currently Working Here"
                picker="year"
                allowEmpty={[false, true]}
              />
            </Form.Item>
          </Col>
          <Col {...colSpan}>
            <Form.Item name={["location"]} label="City" rules={[]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* <Button type="primary" htmlType="submit">
        Save
      </Button> */}
      </Form>
    </div>
  );
};

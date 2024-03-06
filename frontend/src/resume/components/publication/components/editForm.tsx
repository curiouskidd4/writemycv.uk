import React, { useCallback, useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row, Typography } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import ConfirmItemDelete from "../../../../components/itemDelete";

const fullColSpan = 24;
type DetailFormProps = {
  isNewItem?: boolean;
  initialValues?: any;
  onFinish: (values: any) => void;
  onDelete?: () => void;
  saveLoading?: boolean;
};

export const DetailForm = ({isNewItem, initialValues, onFinish, onDelete }: DetailFormProps) => {
  const [state, setState] = React.useState({
    loading: false,
    showSaved: false,
  });
  const [form] = Form.useForm();

  // Correct the date
  if (initialValues?.date) {
    // initialValues.date = dayjs(initialValues.date.toDate());
    initialValues = {
      ...initialValues,
      date: dayjs(initialValues.date?.toDate()),
    };
  }

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: dayjs(initialValues.date?.toDate()),
      });
    }
  }, []);

  const debounceSave = useCallback(
    _.debounce(async (details: any) => {
      await onFinish({...initialValues, ...details});
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000),
    []
  );

  const handleChange = async (changedValues: any, values: any) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      showSaved: true,
    }));

    await debounceSave(values);
  };

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ width: "70%" }}>
        <div className="profile-input-section-title">
          {isNewItem ? <Typography.Text strong>New Publication</Typography.Text>: null}
          {/* <Typography.Text strong>Basic Details</Typography.Text> */}
        </div>
        {state.loading && state.showSaved ? (
          <div className="auto-save-label-loading">
            Saving changes <i className="fa-solid fa-cloud fa-beat"></i>
          </div>
        ) : state.showSaved ? (
          <div className="auto-save-label-success">
            Saved <i className="fa-solid fa-cloud"></i>
          </div>
        ) : null}
      </Row>
      <Form
        name="basic"
        layout="vertical"
        form={form}
        style={{
          maxWidth: "600px",
        }}
        initialValues={initialValues}
        onValuesChange={handleChange}
        // onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={fullColSpan}>
            <Form.Item
              name={["title"]}
              label="Publication Title"
              rules={[
                {
                  required: true,
                  message: "Please enter a title!",
                },
              ]}
            >
              <Input placeholder="Publication Title" />
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
              name={["link"]}
              label="Link"
              rules={[
                {
                  required: false,
                  message: "Please enter a title!",
                },
              ]}
            >
              <Input placeholder="Publication Link" />
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

        {/* <Button type="primary" htmlType="submit">
          Save
        </Button> */}
      </Form>
      <ConfirmItemDelete onDelete={onDelete}
      text="Delete Publication"
       />

    </div>
  );
};

export default DetailForm;

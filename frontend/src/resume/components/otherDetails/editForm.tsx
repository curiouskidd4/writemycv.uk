import React, { useCallback, useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row, Typography } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import EditorJsInput from "../../../components/editor";

const fullColSpan = 24;
type DetailFormProps = {
  isNewItem?: boolean;
  initialValues?: any;
  onFinish: (values: any) => void;
  saveLoading?: boolean;
};

export const DetailForm = ({isNewItem, initialValues, onFinish }: DetailFormProps) => {
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
          {isNewItem ? <Typography.Text strong>New Section</Typography.Text>: null}
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
              <EditorJsInput 
                data={initialValues?.description}
                onChange={(data: any) => {
                  form.setFieldsValue({ description: data });
                }}
              />
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

export default DetailForm;

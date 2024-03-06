import React, { useCallback, useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row, Typography } from "antd";
import dayjs from "dayjs";
import _, { set } from "lodash";
import ConfirmItemDelete from "../../../../components/itemDelete";

const fullColSpan = 24;
type DetailFormProps = {
  initialValues?: any;
  onFinish: (values: any) => void;
  saveLoading?: boolean;
  onDelete?: () => void;
};

export const DetailForm = ({ initialValues, onFinish , 
onDelete}: DetailFormProps) => {
  const [form] = Form.useForm();
  if (initialValues?.date) {
    initialValues = {
      ...initialValues,
      date: dayjs(initialValues.date.toDate()),
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

  const [state, setState] = React.useState({
    loading: false,
    showSaved: false,
  });

  // Correct the date
  const debounceSave = useCallback(
    _.debounce(async (details: any) => {
      await onFinish({...initialValues, ...details});
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
        showSaved: true,
      }));
    }, 1000),
    []
  );

  const onChange = (changedValues: any, allValues: any) => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    debounceSave(allValues);
  }

  return (
    <div className="user-input-area">
      <Row align="middle" justify="space-between" style={{ width: "70%" }}>
          <div className="profile-input-section-title">
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
        onValuesChange={onChange}
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

       
      </Form>

      <ConfirmItemDelete onDelete={onDelete} 
      text="Delete Award"/>
    </div>
  );
};

export default DetailForm;

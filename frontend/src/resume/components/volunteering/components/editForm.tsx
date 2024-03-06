import React, { useCallback, useEffect } from "react";

import { Button, Col, DatePicker, Form, Input, Row, Typography } from "antd";
import dayjs from "dayjs";
import CustomDateRange from "../../../../components/dateRange";
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

export const DetailForm = ({isNewItem, initialValues, onFinish, 
  onDelete
 }: DetailFormProps) => {
  const [state, setState] = React.useState({
    loading: false,
    showSaved: false,
  });
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

  // useEffect(() => {
  //   form.resetFields();
  //   if (initialValues) {
  //     // Correct the date
  //     let startDate = initialValues?.startDate;
  //     let endDate = initialValues?.endDate;
  //     startDate = dayjs(startDate.toDate());
  //     endDate = endDate ? dayjs(endDate.toDate()) : null;

  //     form.setFieldsValue({
  //       ...initialValues,
  //       dateRange: [startDate, endDate],
  //     });
  //   }
  // }, [initialValues]);

  const debounceSave = useCallback(
    _.debounce(async (details: any) => {
      delete initialValues.dateRange;

      await onFinish({ ...initialValues, ...details });
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000),
    []
  );

  const onSave = (values: any) => {
    let startDate = values.dateRange[0];
    let endDate = values.dateRange[1];
    values.startDate = startDate;
    values.endDate = endDate;
    delete values.dateRange;
    debounceSave(values);
  };

  const handleChange = async (changedValues: any, values: any) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      showSaved: true,
    }));

    await onSave(values);
  };

  return (
    <div>
      <Row
        align="middle"
        justify="space-between"
        style={{ width: "70%", maxWidth: "600px" }}
      >
        <div className="profile-input-section-title">
          {isNewItem? <Typography.Text strong>New Volunteering</Typography.Text> : null}
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
        // onFinish={onSave}
        onValuesChange={handleChange}
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
{/* 
        <Button type="primary" htmlType="submit">
          Save
        </Button> */}
      </Form>

      <ConfirmItemDelete onDelete={onDelete}
      text="Delete Volunteering"
       />
    </div>
  );
};

export default DetailForm;

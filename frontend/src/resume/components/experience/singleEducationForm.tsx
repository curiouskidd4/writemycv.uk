import { Button, Col, Form, Input, Menu, Row, Select, Typography } from "antd";
import React from "react";
import EditorJsInput from "../../../components/editor";
import CustomDateRange from "../../../components/dateRange";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CourseLabelWithAIActions from "./components/courseLabel";
import FormLabelWithAIActions from "./components/formLabel";
import { Education, EducationList } from "../../../types/resume";
import "./index.css";
type SingleEducationFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};
const SingleEducationForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleEducationFormProps) => {
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };

  let fullColSpan = 24
  const [form] = Form.useForm();

  const onAddDescription = (value: string) => {
    form.setFieldsValue({
      description: value,
    });
  };

  const onAddCourses = (value: string) => {
    form.setFieldsValue({
      modules: value,
    });
  };
  return (
    <div>
      {/* <Typography.Title level={4}>CV Goals</Typography.Title> */}

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
            <Form.Item name={["degree"]} label="Degree/Major" rules={[]}>
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
        <Row gutter={24}>
        <Col span={fullColSpan}>
            <CourseLabelWithAIActions
              degree={form.getFieldValue(["degree"])}
              school={form.getFieldValue(["school"])}
              onAddCourses={onAddCourses}
            />
            <Form.Item name={["modules"]} rules={[]}>
              <Input />
            </Form.Item>
          </Col>
          <Col {...colSpan}>
            <Form.Item name={["grade"]} label="GPA/Grade" rules={[]}>
              <Input />
            </Form.Item>
          </Col>
          
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <FormLabelWithAIActions
              description={form.getFieldValue(["description"])}
              degree={form.getFieldValue(["degree"])}
              school={form.getFieldValue(["school"])}
              modules={form.getFieldValue(["modules"])}
              onAddDescription={onAddDescription}
              label={
                <>
                  <div>
                    <Typography.Title level={5}>Description</Typography.Title>
                  </div>
                  <div>
                    <Typography.Text type="secondary">
                      <BulbOutlined />
                      List further achievements here, such as scholarships,
                      awards, the title of your dissertation and / or key
                      projects. Try CV wizard to get more ideas.
                    </Typography.Text>
                  </div>
                </>
              }
            />
            <Form.Item name={["description"]} rules={[]}>
              <EditorJsInput />
              {/* <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} /> */}
            </Form.Item>
          </Col>
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
        </Row>
      </Form>
    </div>
  );
};

const EducationCard = ({
  education,
  onClick,
}: {
  education: Education;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className="title">{education.degree}</div>
      <div className="subtitle">{education.school}</div>
      {/* <div className="date-range">
            {education.dateRange[0]} - {education.dateRange[1]}
        </div> */}
    </>
  );
};

type EducationProps = {
  educationList: Education[];
  saveLoading?: boolean;
  onFinish?: (values: any) => void;
};

type EducationState = {
  selectedEducation: Education | null;
  selectedEducationIdx: number;
};

const EducationForm = ({
  educationList,
  saveLoading,
  onFinish,
}: EducationProps) => {
  const [state, setState] = React.useState<EducationState>({
    selectedEducation: null,
    selectedEducationIdx: 0,
  });

  return (
    <>
      <Typography.Title level={4}>Education</Typography.Title>
      <Row gutter={24}>
        <Col span={8}>
          {/* <Typography.Title level={5}>Education Items</Typography.Title> */}
          <Typography.Text type="secondary">Your history</Typography.Text>

          <Menu
            className="education-menu"
            defaultSelectedKeys={[state.selectedEducationIdx.toString()]}
            style={{
            //   height: "100%",
              borderRight: 0,
              background: "transparent",
            }}
            onSelect={(item) => {
              setState({
                selectedEducation: educationList[parseInt(item.key)],
                selectedEducationIdx: parseInt(item.key),
              });
            }}
            items={educationList.map((edu, idx) => {
              return {
                key: idx.toString(),
                label: <EducationCard education={edu} />,
                //   label: edu.degree,
              };
            })}
          ></Menu>
          <Button style={{width: "100%"}}>
            <PlusOutlined /> Add Education
          </Button>
        </Col>
        <Col span={16}>
          {state.selectedEducation && (
            <SingleEducationForm
              initialValues={state.selectedEducation}
              onFinish={onFinish}
              saveLoading={saveLoading}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default EducationForm;

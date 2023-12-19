import {
  Button,
  Col,
  Form,
  Input,
  Menu,
  Row,
  Select,
  Steps,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import EditorJsInput from "../../../../components/editor";
import CustomDateRange from "../../../../components/dateRange";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CourseLabelWithAIActions from "../components/courseLabel";
import FormLabelWithAIActions from "../components/formLabel";
import { Education, EducationList } from "../../../../types/resume";
// import "./index.css";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

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

const DetailForm = ({ initialValues, onFinish }: DetailFormProps) => {
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
        <Col {...colSpan}>
          <Form.Item name={["grade"]} label="GPA/Grade" rules={[]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Button type="primary" htmlType="submit">Save</Button>
    </Form>
  );
};

type CourseFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

const CourseForm = ({ initialValues, onFinish }: CourseFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    // console.log(initialValues);
    form.setFieldsValue({
      ...initialValues,
    });
  }, [initialValues]);
  const onAddCourses = (value: string) => {
    form.setFieldsValue({
      modules: value,
    });
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
      onFinish={onFinish}
    >
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
      </Row>
      <Button type="primary" htmlType="submit">Save</Button>
    </Form>
  );
};

type DescriptionFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

const DescriptionForm = ({ initialValues, onFinish }: DescriptionFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    // console.log(initialValues);
    form.setFieldsValue({
      ...initialValues,
    });
  }, [initialValues]);
  const onAddDescription = (value: string) => {
    form.setFieldsValue({
      description: value,
    });
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
      onFinish={onFinish}
    >
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
      </Row>
      <Button type="primary" htmlType="submit">Save</Button>
    </Form>
  );
};

type SingleEducationFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => Promise<void>;
  saveLoading?: boolean;
};

const SingleEducationForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleEducationFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(initialValues);
    setState((prev) => ({
      ...prev,
      current: 0,
      finished: false,
    }));
    form.setFieldsValue({
      ...initialValues,
    });
  }, [initialValues]);

  let startDate = initialValues.startDate
    ? dayjs(initialValues.startDate.toDate())
    : null;
  let endDate = initialValues.endDate
    ? dayjs(initialValues.endDate.toDate())
    : null;
  initialValues = {
    ...initialValues,
    dateRange: [startDate, endDate],
  };
  const [state, setState] = React.useState({
    current: 0,
    finished: false,
    loading: false,
  });

  const [educationData, setEducationData] = React.useState(initialValues);
  let fullColSpan = 24;

  const onSave = async (
    key: "description" | "modules" | "details",
    details: any
  ) => {
    setEducationData((prev: any) => ({
      ...prev,
      ...details,
    }));
    console.log(details);
    if (key === "details") {
      setState((prev) => ({
        ...prev,
        current: 1,
      }));
    } else if (key === "modules") {
      setState((prev) => ({
        ...prev,
        current: 2,
      }));
    } else if (key === "description") {
      // Complete and move to next
      if (onFinish) {
        let finalData = {
          ...educationData,
          ...details,
        };
        setState((prev) => ({
          ...prev,
          loading: true,
        }));
        finalData.startDate = Timestamp.fromDate(
          finalData.dateRange[0].toDate()
        );
        finalData.endDate = finalData.dateRange[1]
          ? Timestamp.fromDate(finalData.dateRange[1].toDate())
          : null;

        delete finalData.dateRange;
        await onFinish(finalData);
        setState((prev) => ({
          ...prev,
          finished: true,
          loading: false,
        }));
      }
    }
  };

  return (
    <div>
      <Steps
        style={{
          marginTop: "12px",
        }}
        onChange={(current) => {
          setState({ ...state, current });
        }}
        direction="horizontal"
        size="small"
        current={state.current}
        items={[
          { title: "Basic Details" },
          {
            title: "Courses",
            // description,
          },
          {
            title: "Description",
            // description,
          },
        ]}
      />

      <Row
        style={{
          marginTop: "24px",
        }}
      >
        {
          {
            0: (
              <DetailForm
                initialValues={initialValues}
                onFinish={(details) => onSave("details", details)}
                saveLoading={saveLoading}
              />
            ),
            1: (
              <CourseForm
                initialValues={initialValues}
                onFinish={(details) => onSave("modules", details)}
                saveLoading={saveLoading}
              />
            ),
            2: (
              <DescriptionForm
                initialValues={initialValues}
                onFinish={(details) => onSave("description", details)}
                saveLoading={saveLoading}
              />
            ),
          }[state.current]
        }
      </Row>
    </div>
  );
};

export default SingleEducationForm;

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
import Achievements from "../../../../pages/profile/forms/achievements";
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
        <Col  span={fullColSpan}>
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

      <Button type="primary" htmlType="submit">Save</Button>
    </Form>
  );
};

type AchievementFormProps = {
  initialValues?: any;
  position: string;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

const AchievementForm = ({
  initialValues,
  position,
  onFinish,
}: AchievementFormProps) => {
  const [form] = Form.useForm();

  
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
          <Form.Item name={["achievements"]} rules={[]}>
            <Achievements jobTitle={position} />
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

type SingleExperienceFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

const SingleExperienceForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleExperienceFormProps) => {
  const [experienceData, setExperienceData] = React.useState(initialValues);

  useEffect(() => {
    console.log(initialValues);
    setState((prev) => ({
      ...prev,
      current: 0,
    }));
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
  });

  let fullColSpan = 24;
  const [form] = Form.useForm();

 

  const onSave = async (
    key: "description" | "achievements" | "details",
    details: any
  ) => {
    console.log(details);
    setExperienceData((prev: any) => ({
      ...prev,
      ...details,
    }));
    if (key === "details") {
      setState((prev) => ({
        ...prev,
        current: 1,
      }));
    } else if (key === "description") {
      setState((prev) => ({
        ...prev,
        current: 2,
      }));
    } else if (key === "achievements") {
      let finalData = {
        ...experienceData,
        ...details,
      };
      // Complete and move to next
      if (onFinish) {
        finalData.startDate = Timestamp.fromDate(
          finalData.dateRange[0].toDate()
        );
        finalData.endDate = finalData.dateRange[1]
          ? Timestamp.fromDate(finalData.dateRange[1].toDate())
          : null;

        delete finalData.dateRange;

        setState((prev) => ({
          ...prev,
          loading: true,
        }));
        await onFinish(details);
        setState((prev) => ({
          ...prev,
          finished: true,
          loading: false,
          //   current: 0,
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
            title: "Description",
            // description,
          },
          {
            title: "Achievements",
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
              <DescriptionForm
                initialValues={initialValues}
                onFinish={(details) => onSave("achievements", details)}
                saveLoading={saveLoading}
              />
            ),
            2: (
              <AchievementForm
                position={initialValues.position}
                initialValues={initialValues}
                onFinish={(details) => onSave("achievements", details)}
                saveLoading={saveLoading}
              />
              
            ),
          }[state.current]
        }
      </Row>
    </div>
  );
};

export default SingleExperienceForm;

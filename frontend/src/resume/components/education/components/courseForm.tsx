import {
  Button,
  Col,
  Input,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import openAI from "../../../../hooks/openai";
import {
  AIWizardIcon,
  DeleteIcon,
  MagicWandIcon,
} from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBoxV2";
import "./educationEditForm.css";
const CourseCard = ({ course }: { course: string }) => {
  return (
    <Row className="course-card">
      <div className="title">{course}</div>
      <div className="actions">
        <DeleteIcon />
      </div>
    </Row>
  );
};

type CourseFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};
export const CourseForm = ({ initialValues, onFinish }: CourseFormProps) => {
  if (typeof initialValues?.modules === "string") {
    initialValues.modules = initialValues.modules.replace("and", "").split(",");
  }
  // const [form] = Form.useForm();
  const [state, setState] = React.useState({
    loadingSuggestions: false,
    moduleText: "",
    existinModules: initialValues?.modules || [],
    newItemFlag: false,
  });

  const educationHelper = openAI.useEducationHelper();

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      existinModules: initialValues?.modules || [],
    }));
    if (initialValues?.school && initialValues?.degree) {
      loadSuggestions({
        school: initialValues?.school,
        degree: initialValues?.degree,
      });
    }
  }, [initialValues]);

  const onAddCourses = (value: string) => {
    // form.setFieldsValue({
    //   modules: ,
    // });
    setState((prev) => ({
      ...prev,
      existinModules: [...prev.existinModules, value],
      newItemFlag: false,
    }));
  };

  const onSave = () => {
    if (onFinish) {
      onFinish({
        modules: state.existinModules,
      });
    }
  };

  const loadSuggestions = async ({
    school,
    degree,
  }: {
    school: string;
    degree: string;
  }) => {
    setState((prev) => ({
      ...prev,
      loadingSuggestions: true,
    }));
    await educationHelper.suggestCourses({
      school: school,
      degree: degree,
    });

    setState((prev) => ({
      ...prev,
      loadingSuggestions: false,
    }));
  };

  return (
    <div className="profile-tab-detail">
      <div className="user-input-area">
        <div className="profile-input-section-title">
          <Typography.Text strong>Modules</Typography.Text>
          <Button type="link">
            <AIWizardIcon />
          </Button>
        </div>

        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
          }}
        >
          {/* <Row>
            <Input
              size="large"
              placeholder="Add your courses"
              style={{
                width: "300px",
              }}
              value={state.moduleText}
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  moduleText: e.target.value,
                }));
              }}
              suffix={<ArrowRightOutlined />}
              onPressEnter={(e) => {
                onAddCourses(e.currentTarget.value);
                setState((prev) => ({
                  ...prev,
                  moduleText: "",
                }));
              }}
            />
          </Row> */}

          {state.existinModules.map((module: string, index: number) => (
            // <Col key={index}>

            <CourseCard course={module} key={index} />
            // </Col>
            // <div
            //   key={index}
            //   style={{
            //     display: "flex",
            //     alignItems: "center",
            //     justifyContent: "space-between",
            //     marginBottom: "12px",
            //   }}
            // >
            //   <div>
            //     <Typography.Text>{module}</Typography.Text>
            //   </div>
            //   <div>
            //     <DeleteOutlined />
            //   </div>
            // </div>
          ))}
          {!state.newItemFlag && (
            <Button
              type="link"
              className="small-link-btn"
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  newItemFlag: true,
                }));
              }}
            >
              <PlusOutlined />
              Add New
            </Button>
          )}
          {state.newItemFlag && (
            <Input
              size="large"
              placeholder="Add your courses"
              style={{
                width: "300px",
              }}
              value={state.moduleText}
              onChange={(e) => {
                setState((prev) => ({
                  ...prev,
                  moduleText: e.target.value,
                }));
              }}
              suffix={<ArrowRightOutlined />}
              onPressEnter={(e) => {
                onAddCourses(e.currentTarget.value);
                setState((prev) => ({
                  ...prev,
                  moduleText: "",
                }));
              }}
            />
          )}
        </Space>
      </div>
      <div className="ai-wizard-area">
        <CVWizardBox title="Add modules" subtitle="Highlighting relevant courses in your ‘Education’ section.">
          <Typography.Text type="secondary">
            CV Wizard Suggestions:
          </Typography.Text>
          {educationHelper.loading && <Skeleton active></Skeleton>}

          {educationHelper.courseSuggestions &&
            educationHelper.courseSuggestions!.results.length > 0 && (
              <Row
                style={{
                  marginTop: "12px",
                }}
                gutter={[6, 6]}
              >
                {educationHelper
                  .courseSuggestions!.results.filter(
                    (s) => !state.existinModules.includes(s)
                  )
                  .map((item: any, idx: number) => (
                    <Col key={idx}>
                      <Button
                        size="small"
                        onClick={() => {
                          onAddCourses(item);
                        }}
                      >
                        {/* <PlusOutlined /> */}
                        {item}
                      </Button>
                    </Col>
                  ))}
              </Row>
            )}
        </CVWizardBox>
      </div>
    </div>
  );
};

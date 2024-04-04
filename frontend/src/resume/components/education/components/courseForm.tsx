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

const CourseCard = ({
  course,
  onDelete,
}: {
  course: string;
  onDelete: () => void;
}) => {
  return (
    <Row className="course-card">
      <div className="title">{course}</div>
      <div className="actions large">
        <Button
          type="link"
          style={
            {
              // fontSize: "16x",
            }
          }
          onClick={onDelete}
        >
          <i
            className="fa-solid fa-trash-can"
            style={{
              height: "16px",
            }}
          ></i>
        </Button>
      </div>
    </Row>
  );
};

type CourseFormProps = {
  value?: any;
  onChange: (values: any) => void;
  saveLoading?: boolean;
  courseSuggestions: any;
  suggestionsLoading: boolean;
};
export const CourseForm = ({
  value,
  courseSuggestions,
  suggestionsLoading,
  onChange,
}: CourseFormProps) => {
  if (typeof value?.modules === "string") {
    value.modules = value.modules.replace("and", "").split(",");
  }
  // const [form] = Form.useForm();
  const [state, setState] = React.useState({
    loadingSuggestions: false,
    moduleText: "",
    existinModules: value?.modules || [],
    newItemFlag: false,
  });

  const educationHelper = openAI.useEducationHelper();

  const onAddCourses = (value: string) => {
    // form.setFieldsValue({
    //   modules: ,
    // });
    setState((prev) => ({
      ...prev,
      existinModules: [...prev.existinModules, value],
      newItemFlag: false,
    }));
    onChange({
      modules: [...state.existinModules, value],
    });
  };


  const onDelete = (index: number) => {
    let newModules = state.existinModules;
    newModules.splice(index, 1);
    setState((prev) => ({
      ...prev,
      existinModules: newModules,
    }));
    onChange({
      modules: newModules,
    });
  };

  let finalSuggestions =
    educationHelper.courseSuggestions?.results ||
    courseSuggestions?.results ||
    [];
  let loading = educationHelper.loading || suggestionsLoading;
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
          {state.existinModules.map((module: string, index: number) => (
            <CourseCard
              course={module}
              key={index}
              onDelete={() => onDelete(index)}
            />
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
        <CVWizardBox
          title="Experienced professionals can skip this step"
          subtitle="Tip: If you are a graduate or early professional, including modules is an effective way of demonstrating your expertise and improving your ATS success."
        >
          <Typography.Text type="secondary">
            CV Wizard Suggestions:
          </Typography.Text>
          {loading && <Skeleton active></Skeleton>}

          {!loading && <Row
            style={{
              marginTop: "12px",
            }}
            gutter={[6, 6]}
          >
            {finalSuggestions
              .filter((s: any) => !state.existinModules.includes(s))
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
          }
        </CVWizardBox>
      </div>
    </div>
  );
};

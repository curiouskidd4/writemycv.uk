import {
  Button, Col,
  Input, Row, Skeleton,
  Space, Tag,
  Typography
} from "antd";
import React, { useEffect } from "react";
import { ArrowRightOutlined, PlusOutlined } from "@ant-design/icons";
import openAI from "../../../../hooks/openai";
import { MagicWandIcon } from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBox";

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
    school, degree,
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
    <>
      <Space
        direction="vertical"
        size="large"
        style={{
          width: "100%",
        }}
      >
        <Row>
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
            }} />
        </Row>

        <Row
          style={{
            width: "100%",
          }}
        >
          <CVWizardBox>
            <Typography.Text type="secondary">
              <MagicWandIcon /> CV Wizard Suggestions:
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
                          <PlusOutlined />
                          {item}
                        </Button>
                      </Col>
                    ))}
                </Row>
              )}
          </CVWizardBox>
        </Row>

        <Row gutter={[6, 6]}>
          {state.existinModules.length > 0 && (
            <>
              <Row
                style={{
                  width: "100%",
                  // marginBottom: "8px",
                }}
              >
                <Typography.Text strong>Added Courses:</Typography.Text>{" "}
              </Row>
            </>
          )}
          {state.existinModules.map((module: string, index: number) => (
            <Col key={index}>
              <Tag
                className="education-course-tag"
                color=" var(--primary-400)"
                closable
              >
                <span>{module}</span>
              </Tag>
            </Col>
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
        </Row>
        <Row>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Row>
      </Space>
    </>
  );
};

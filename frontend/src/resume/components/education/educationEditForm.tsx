import {
  Button,
  Col,
  Form,
  Input,
  Menu,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Education, EducationList } from "../../../types/resume";
import "./index.css";
import SingleEducationForm from "./components/educationEditForm";
import { Timestamp } from "firebase/firestore";

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
  onFinish?: (values: any) => Promise<void>;
  syncEducation: (values: any) => Promise<void>;
  showTitle: boolean;
};

type EducationState = {
  selectedEducation: Education | null;
  selectedEducationIdx: number | null;
};

const EducationForm = ({
  educationList,
  saveLoading,
  onFinish,
  syncEducation,
  showTitle = true,
}: EducationProps) => {
  educationList = educationList || [];
  const [state, setState] = React.useState<EducationState>({
    selectedEducation: educationList.length > 0 ? educationList[0] : null,
    selectedEducationIdx: educationList.length > 0 ? 0 : null,
  });

  const onSave = async (experience: Education) => {
    educationList[state.selectedEducationIdx!] = experience;
    await syncEducation(educationList);
    message.success("Education saved!");
    if (onFinish) {
      await onFinish(educationList);
    }
  };

  const addNew = () => {
    const newItem: Education = {
      id: (educationList.length + 1).toString(),
      school: "",
      degree: "",
      description: "",
      startDate: Timestamp.now(),
      endDate: null,
      dissertation: null,
      aiSuggestions: null,
      grade: "",
      modules: [],
    };
    setState((prev) => ({
      selectedEducation: newItem,
      selectedEducationIdx: educationList.length,
    }));
  };

  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Education</Typography.Title>
      ) : null}
      <Row gutter={24} style={{ height: "100%" }}>
        <Col span={4} className="education-history-selector selector-col">
          {/* <Typography.Title level={5}>Education Items</Typography.Title> */}
          {/* <Typography.Text type="secondary">Your history</Typography.Text> */}

          <Menu
            className="education-menu"
            defaultSelectedKeys={
              state.selectedEducationIdx != null
                ? [state.selectedEducationIdx.toString()]
                : []
            }
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
          <Row justify="start">
            <Button
              style={{ margin: "8px 24px" }}
              onClick={addNew}
            >
              <PlusOutlined /> Add Education
            </Button>
          </Row>
        </Col>
        <Col span={20} style={{ paddingLeft: "24px" }}>
          {state.selectedEducation != null &&
          state.selectedEducationIdx != null ? (
            <>
              <div>
                <Typography.Title level={5}>
                  Education #{state.selectedEducationIdx + 1}
                </Typography.Title>
              </div>
              <SingleEducationForm
                initialValues={state.selectedEducation}
                onFinish={onSave}
                saveLoading={saveLoading}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default EducationForm;

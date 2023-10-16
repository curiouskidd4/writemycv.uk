import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BulbOutlined } from "@ant-design/icons";
import { useHotkeys } from "react-hotkeys-hook";
import PersonalDetailForm from "./personalDetails";
import EducationForm from "./education";
import ExperienceForm from "./experience";
import SkillForm from "./skills";

const SectionCard = ({ title, onClick }) => {
  return (
    <Col span={12}>
      <Card hoverable onClick={onClick}>
        <Typography.Title
          level={5}
          style={{ textAlign: "center", marginBottom: "0px" }}
        >
          {title}
        </Typography.Title>
      </Card>
    </Col>
  );
};
const ResumeEditForm = ({
  resumeId
}) => {
  const [state, setState] = useState({
    currentSection: "",
  });

  let sections = [
    { title: "Personal Information", key: "personalInfo" },
    { title: "Education", key: "education" },
    { title: "Experience", key: "experience" },
    { title: "Skills", key: "skills" },
  ];

  let onStart = () => {
    setState({ ...state, currentSection: null });
  };
  return (
    <>
      {!state.currentSection && (
        <div
          style={{
            // height: "80vh",
            display: "flex",
            width: "100%",
          }}
        >
          <div
            style={{
              margin: "auto auto",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            {/* <Typography.Title level={3}>
              Select a section to edit
            </Typography.Title> */}
            <Typography.Text type="secondary">
              Hi, I am your AI assistant. I can help you with your resume.
              Please select a section you want help with. Optionally, for adding
              or updating any section you can use the details tab
            </Typography.Text>
            <Row style={{ marginTop: "1rem" }} gutter={[12, 12]}>
              {sections.map((item) => (
                <SectionCard
                  key={item.key}
                  title={item.title}
                  onClick={() => {
                    setState({ ...state, currentSection: item.key });
                  }}
                />
              ))}
            </Row>
          </div>
        </div>
      )}
      {state.currentSection == "personalInfo" && (
        <PersonalDetailForm goToStart={onStart}  />
      )}
      {state.currentSection == "education" && (
        <EducationForm goToStart={onStart} />
      )}
      {state.currentSection == "experience" && (
        <ExperienceForm goToStart={onStart}  />
      )}
      {state.currentSection == "skills" && <SkillForm goToStart={onStart} />}
    </>
  );
};

export default ResumeEditForm;

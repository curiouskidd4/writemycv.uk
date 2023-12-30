import React, { useEffect } from "react";
import { ResumeProvider, useResume } from "../contexts/resume";
import { Typography, Steps, Row, Col, Button, Space } from "antd";
import "./index.css";
import Navigation from "./components/navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { CollapseLeft, CollapseRight } from "../components/faIcons";

type ResumeEditStepsProps = {
  current?: number;
  setCurrent?: (current: number) => void;
  editMode: boolean;
};
const ResumeEditSteps = ({
  current,
  setCurrent,
  editMode,
}: ResumeEditStepsProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  let orgSteps = [
    {
      title: "CV Goals",
      description: (
        <div className="step-description">Why are you creating the CV?</div>
      ),
    },
    {
      title: "Personal Details",
      description: (
        <div className="step-description">
          Your details needed to optimize the CV
        </div>
      ),
    },
    {
      title: "Education",
      description: (
        <div className="step-description">Let's add your education details</div>
      ),
    },
    {
      title: "Work Experience",
      description: (
        <div className="step-description">
          Our AI will help you highlight all achievements here{" "}
        </div>
      ),
    },
    {
      title: "Skills",
      description: (
        <div className="step-description">Highlight your key skills</div>
      ),
    },
    {
      title: "Professional Summary",
      description: (
        <div className="step-description">
          Let's write a cool summary about you
        </div>
      ),
    },
    {
      title: "Finished",
      description: <div className="step-description">You're Done!</div>,
    },
  ];
  let steps;

  if (isCollapsed) {
    steps = orgSteps.map((step) => {
      return {
        title: "       ",
        description: "        ",
      };
    });
  } else {
    steps = orgSteps;
  }

  if (editMode) {
    steps = steps.slice(0, steps.length - 1);
  }
  const [_current, _setCurrent] = React.useState(0);
  useEffect(() => {
    if (current) {
      _setCurrent(current);
    }
  }, [current]);

  useEffect(() => {
    if (setCurrent) {
      setCurrent(_current);
    }
  }, [_current]);

  return (
    <Space direction="vertical">
      {editMode && !isCollapsed ? (
        <Row style={{ height: "20px", marginBottom: "12px" }}>
          <Col>
            <Typography.Text
              type="secondary"
              style={{
                color: "var(--accent-400)",
              }}
            >
              Select a section to edit
            </Typography.Text>
          </Col>
        </Row>
      ) : (
        <Row style={{ height: "20px", marginBottom: "12px" }}>
          <Col>
            <Typography.Text
              type="secondary"
              style={{
                color: "var(--accent-400)",
              }}
            >
              {" "}
            </Typography.Text>
          </Col>
        </Row>
      )}
      <Space direction="vertical" align="center">
        <Steps
          onChange={(current) => {
            _setCurrent(current);
          }}
          className="resume-edit-steps"
          progressDot
          current={current}
          direction="vertical"
          size="small"
          items={steps.map((step, idx) => {
            return {
              title: step.title,
              description: step.description,
              disabled: editMode ? false : idx > _current,
              status: editMode
                ? "finish"
                : idx === _current
                ? "process"
                : idx > _current
                ? "wait"
                : "finish",
              // status: _current === steps.length - 1 ? "finish"  : "process",
            };
          })}
        />
        {/* 
        {isCollapsed ? (
          <Button
            type="text"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            icon={<CollapseRight />}
          ></Button>
        ) : (
          <Button
            type="text"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
            icon={<CollapseLeft />}
          >
            Collapse
          </Button>
        )} */}
      </Space>
    </Space>
  );
};

const ResumeEditV2Loader = () => {
  const resumeData = useResume();
  const [current, setCurrent] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode ? true : false;
  const toResumes = () => {
    navigate("/resumes");
  };

  const toThisResume = () => {
    navigate(`/resumes/${resumeData.resume?.id}`);
  };

  if (resumeData.loading) {
    return <div>Loading...</div>;
  }

  if (!resumeData.resume) {
    return <div>Resume not found</div>;
  }
  return (
    <div className="content">
      <Row
        style={{
          height: "64px",
          marginBottom: "12px",
        }}
        align="middle"
      >
        <Col>
          <Typography.Text type="secondary">
            <Button className="cv-link-button" type="link" onClick={toResumes}>
              Resumes
            </Button>{" "}
            /
            <Button
              className="cv-link-button"
              type="link"
              onClick={toThisResume}
            >
              {resumeData.resume?.name}{" "}
            </Button>
            / Edit
          </Typography.Text>
        </Col>
        {editMode && (
          <Col style={{ marginLeft: "auto" }}>
            <Button
              onClick={() => {
                navigate(`/resumes/${resumeData.resume?.id}`, {
                  state: {
                    editMode: true,
                  },
                });
              }}
            >
              Preview
            </Button>
          </Col>
        )}
      </Row>
      <Row gutter={48} style={{ margin: "0px 16px" }}>
        <Col span={6} className="resume-steps-col">
          <ResumeEditSteps
            current={current}
            setCurrent={setCurrent}
            editMode={editMode}
          />
        </Col>
        <Col
          span={18}
          style={{
            paddingLeft: "24px",
          }}
        >
          <Navigation
            current={current}
            setCurrent={setCurrent}
            resume={resumeData.resume}
            editMode={editMode}
          />
        </Col>
      </Row>
    </div>
  );
};

const ResumeEditV2 = () => {
  return (
    <ResumeProvider>
      <ResumeEditV2Loader />
    </ResumeProvider>
  );
};

export default ResumeEditV2;

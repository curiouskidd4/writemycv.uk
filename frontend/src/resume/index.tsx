import React, { useEffect } from "react";
import { ResumeProvider, useResume } from "../contexts/resume";
import { Typography, Steps, Row, Col, Button, Space, Modal, message } from "antd";
import "./index.css";
import Navigation from "./navigation";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CollapseLeft,
  CollapseRight,
  DownloadIcon,
} from "../components/faIcons";
import PDFViewer from "../components/pdfViewer";

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
    },
    {
      title: "Personal Details",
    },
    {
      title: "Education",
    },
    {
      title: "Work Experience",
    },
    {
      title: "Skills",
    },

    {
      title: "Professional Summary",
    },
    {
      title: "Other Information",
    },
    {
      title: "Awards",
    },
    {
      title: "Publications",
    },
    {
      title: "Volunteering",
    },
    {
      title: "Languages",
    },
    {
      title: "Adjustments",
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

  // if (editMode) {
  //   steps = steps.slice(0, steps.length - 1);
  // }
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
    <div>
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
                description: "",
                // disabled: editMode ? false : idx > _current,
                status: editMode
                  ? "finish"
                  : idx === _current
                  ? "process"
                  : idx > _current
                  ? "wait"
                  : ("finish" as any),
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
    </div>
  );
};

const ResumeEditV2Loader = () => {
  const resumeData = useResume();
  const [current, setCurrent] = React.useState(0);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode ? true : false;
  const toResumes = () => {
    navigate("/resumes");
  };

  const toThisResume = () => {
    navigate(`/resumes/${resumeData.resume?.id}`);
  };

  const downloadResume = async () => {
    await resumeData.downloadResume();
  };

  const showPreview = async () => {
    let url = await resumeData.getResumeURL();
    setPreviewUrl(url);
  };

  const getPublicUrl = async () => {
    let url = await resumeData.copyPublicLink();
    navigator.clipboard.writeText(url);
    message.success("Link copied to clipboard");
    return url;
  }

  if (resumeData.loading) {
    return <div>Loading...</div>;
  }

  if (!resumeData.resume) {
    return <div>Resume not found</div>;
  }

  return (
    <div className="resume">
      <>
        <Modal
          title="Preview"
          open={previewUrl ? true : false}
          onCancel={() => {
            setPreviewUrl("");
          }}
          footer={null}
          width={800}
        >
          <Row
            justify="center"
            style={{ marginBottom: "16px", height: "80vh", 
            overflowY: "auto"}}
          >
            <PDFViewer documentURL={previewUrl} />
          </Row>
        </Modal>
      </>
      <Row align="middle" className="title-header">
        <Col>
          <Typography.Title
            level={3}
            style={{
              marginBottom: "0px",
            }}
          >
            Your CVs / {resumeData.resume?.name}
          </Typography.Title>
        </Col>
        <Col
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Button
            onClick={() => {
              showPreview();
            }}
          >
            <i className="fa-solid fa-eye"></i>
            Preview
          </Button>

          <Button onClick={downloadResume}>
            <i className="fa-solid fa-download"></i>
            Download{" "}
          </Button>

          <Button
            onClick={() => {
              getPublicUrl()
            }}
          >
            <i className="fa-solid fa-share-nodes"></i>
            {/* <PlusIcon /> */}
            Share
          </Button>
        </Col>
      </Row>

      <Row gutter={48} style={{ margin: "0px 0px" }} className="resume-body">
        <Col
          // span={6}
          className="resume-steps-col"
          style={{ height: "100%", overflowY: "auto", minWidth: "220px" }}
        >
          <ResumeEditSteps
            current={current}
            setCurrent={setCurrent}
            editMode={editMode}
          />
        </Col>
        <Col
          flex={1}
          style={{
            paddingLeft: current === 0 ? "0px" : "0px",
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
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

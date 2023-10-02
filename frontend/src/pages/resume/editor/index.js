import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  Form,
  Input,
  Button,
  Row,
  DatePicker,
  Typography,
  Col,
  Skeleton,
  message,
  Tabs,
  Space,
  Card,
} from "antd";
import EditorJsInput from "../../../components/editor";
import { useAuth } from "../../../authContext";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
  RobotOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import dayjs from "dayjs";
import { objectId, downloadStorageContent } from "../../../helpers";
import { useNavigate, useParams } from "react-router-dom";
import { merge } from "antd/es/theme/util/statistic";
import { storage } from "../../../services/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import ChatBot from "../../../components/restChatbot";
import UserOptionsButton from "../../../components/userOptionsButton";
import DetailForm from "./forms/detail";

const AIHelpSelector = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <Space
        direction="vertical"
        style={{
          textAlign: "center",
        }}
      >
        
        <Button type="text" onClick={() => onChange("education")}>
          Education
        </Button>
        <Button type="text" onClick={() => onChange("experience")}>
          Experience
        </Button>
        <Button type="text" onClick={() => onChange("professionalSummary")}>
          Professional Summary
        </Button>

        <Typography.Text type="secondary">
          Hi, I am your AI assistant. I can help you with your resume. Please
          select a section you want help with. Optionally, for adding or updating any section you can use the details sections
        </Typography.Text>
      </Space>
    </div>
  );
};

const ResumePreview = ({ resumeHTML }) => {
  const targetRef = useRef();
  const iframeRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    if (targetRef.current) {
      // targetRef.current.innerHTML = resumeHTML;
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });

      // Scale the iframe html to fit the iframe
      if (iframeRef.current) {
        // get iframe html document
        resize();
      }
    }
  }, [resumeHTML, targetRef.current, iframeRef.current]);

  const resize = () => {
    let iframeDocument = iframeRef.current.contentDocument;
    // scale html
    iframeDocument.body.style.transformOrigin = "top left";
    let newScale =
      targetRef.current.offsetWidth / iframeDocument.body.offsetWidth;

    iframeDocument.body.style.transform = `scale(${newScale})`;

    // Set iframe  height to body height
    iframeRef.current.style.height = `${
      iframeDocument.body.offsetHeight * newScale
    }px`;

    // Force rerender of iframe
    // setCount(count + 1);
    if (newScale !== scale) {
      setScale(newScale);
    }

    console.log(
      "scale",
      newScale,
      targetRef.current.offsetWidth,
      iframeDocument.body.offsetWidth
    );
  };
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "4px",
        //   overflowY: "scroll",
        overflow: "auto",
      }}
      ref={targetRef}
    >
      <iframe
        ref={iframeRef}
        key={scale}
        onLoad={() => {
          console.log("iframe loaded");
          resize();
        }}
        //   width="100%"
        //   height="100%"
        className="resume-preview-frame"
        srcDoc={resumeHTML}
        style={{
          // width: "500px",
          // height: "100%",
          border: "none",
        }}
      ></iframe>
    </div>
  );
};
const EditResume = () => {
  const { resumeId } = useParams();

  const [state, setState] = useState({});

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, []);

  const loadResume = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const gsRef = ref(
      storage,
      `userData/${auth.user.uid}/resumes/${resumeId}/resume.html`
    );

    // The data blob contains resume in html format
    let data = await downloadStorageContent(gsRef);
    let resumeHTML = await data.text();

    setState((prev) => ({ ...prev, loading: false, resumeHTML: resumeHTML }));
  };

  const auth = useAuth();
  const resume = useDoc("resumes", resumeId);

  const sectionOrder = [
    "personal",
    "education",
    "experience",
    "skills",
    "summary",
  ];

  const navigate = useNavigate();

  return (
    <>
      <Row
        style={
          {
            //   height: "90vh",
          }
        }
        gutter={24}
      >
        <Col span={12}>
          <Row align="middle" style={{ marginBottom: "1rem" }}>
            <Col>
              <Button type="text" onClick={() => navigate(-1) }>
                <LeftOutlined />
              </Button>
            </Col>
            <Col>
              <Typography.Title
                level={4}
                style={{
                  marginBottom: "0px",
                }}
              >
                {resume.data?.name}
              </Typography.Title>
              <Typography.Text type="secondary">
                {resume.data?.role}
              </Typography.Text>
            </Col>
          </Row>
          <Card>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane
              tab={
                <>
                  <RobotOutlined />
                  AI assistant
                </>
              }
              key="1"
            >
              {state.helpSection ? (
                <ChatBot helpSection={state.helpSection} />
              ) : (
                <AIHelpSelector
                  onChange={(value) =>
                    setState((prev) => ({ ...prev, helpSection: value }))
                  }
                />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Details" key="2">
                <DetailForm resumeId={resumeId} />
            </Tabs.TabPane>
          </Tabs>
          </Card>
        </Col>
        <Col span={12}>
          <Row style={{ marginBottom: "1rem" }} justify="space-between">
            <Col>
              <Typography.Title level={4}>Preview</Typography.Title>
            </Col>
            <Col>
              <UserOptionsButton />
            </Col>
          </Row>
          <Row
            justify="center"
            style={{
              //   height: "100%",
              width: "100%",
              padding: "1rem",
              backgroundColor: "rgb(178 179 181)",

              //   backgroundColor: "#f0f2f5",
            }}
          >
            <ResumePreview resumeHTML={state.resumeHTML} />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default EditResume;

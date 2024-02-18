import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

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
import dayjs from "dayjs";
import { downloadStorageContent } from "../../helpers";
import { useParams } from "react-router-dom";
import { storage, db } from "../../services/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

const ResumePreview = () => {
  const { publicResumeId } = useParams();

  const [state, setState] = useState({});

  useEffect(() => {
    if (publicResumeId) {
      loadResume();
    }
  }, []);

  const loadResume = async () => {
    setState((prev) => ({ ...prev, loading: true }));

    // Load from public resume
    let resumeRef = doc(db, "publicResume", publicResumeId);
    let resumeData = await getDoc(resumeRef);
    let resumeId = resumeData.data().resumeId;
    let userId = resumeData.data().userId;
    // Populate this to public resumes
    const gsRef = ref(
      storage,
      `userData/${userId}/resumes/${resumeId}/resume.html`
    );

    // The data blob contains resume in html format
    let data = await downloadStorageContent(gsRef);
    let resumeHTML = await data.text();

    setState((prev) => ({ ...prev, loading: false, resumeHTML: resumeHTML }));
  };

  const sectionOrder = [
    "personal",
    "education",
    "experience",
    "skills",
    "summary",
  ];

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
  }, [state.resumeHTML, targetRef.current, iframeRef.current]);

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
    <Row
      justify="center"
      style={{
        width: "100%",
        borderRadius: "4px",
        //   overflowY: "scroll",
        overflow: "auto",
        backgroundColor: "grey",
        padding: "1.5rem"
      }}
    >
      <div
        style={{
          height: "100%",
          width: "800px",
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
          srcDoc={state.resumeHTML}
          style={{
            // width: "500px",
            // height: "100%",
            border: "none",
          }}
        ></iframe>
      </div>
    </Row>
  );
};

export default ResumePreview;

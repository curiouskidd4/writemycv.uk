import React, { useEffect } from "react";
import { Checkbox, Col, Row, Spin, Tabs, Typography } from "antd";
import "./index.css";
import SortableComponent from "../../../components/sortableList";
import PDFViewer from "../../../components/pdfViewer";
import { useResume } from "../../../contexts/resume";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../services/firebase";
import Template from "../../../types/template";
import { isHowellUser } from "../../../config";

let templates = [
  {
    name: "Template 1",
    img: "/template/template.png",
  },
  {
    name: "Template 2",
    img: "/template/template.png",
  },
  {
    name: "Template 3",
    img: "/template/template.png",
  },
  {
    name: "Template 4",
    img: "/template/template.png",
  },
  {
    name: "Template 5",
    img: "/template/template.png",
  },
];

let sections = [
  {
    name: "Personal Details",
    key: "personalDetails",
    disabled: false,
  },
  {
    name: "Professional Summary",
    key: "professionalSummary",
    disabled: false,
  },
  {
    name: "Education",
    key: "education",
    disabled: false,
  },
  {
    name: "Experience",
    key: "workExperience",
    disabled: false,
  },
  {
    name: "Skills",
    key: "skills",
    disabled: false,
  },

  {
    name: "Awards",
    key: "awards",
    disabled: false,
  },
  {
    name: "Publications",
    key: "publications",
    disabled: false,
  },
  {
    name: "Volunteering",
    key: "volunteering",
    disabled: false,
  },
  {
    name: "Languages",
    key: "languages",
    disabled: false,
  },
];

const Adjustment = () => {
  const [currentOrder, setCurrentOrder] = React.useState(sections);
  const [resumeURL, setResumeURL] = React.useState("");
  const [templates, setTemplates] = React.useState<Template[]>([]); // [
  const { getResumeURL, exportResume } = useResume();
  const [updatingPreview, setUpdatingPreview] = React.useState(true);
  const { resume, updateTemplate, saveResumeOrder } = useResume();

  React.useEffect(() => {
    const fetchResumeURL = async () => {
      const url = await getResumeURL();
      setResumeURL(url);
    };
    fetchResumeURL();
    loadTemplates();
  }, []);

  const updatePreview = async () => {
    setUpdatingPreview(true);
    await exportResume();
    const url = await getResumeURL();
    setResumeURL(url);
    setUpdatingPreview(false);
  };

  useEffect(() => {
    if (currentOrder) {
      saveResumeOrder(currentOrder.map((item) => item.key));
      updatePreview();
    }
  }, [currentOrder]);

  const loadTemplates = async () => {
    // Howell Specific changes
    const queryRef = query(
      collection(db, "templates"),
      where("isPublic", "==", isHowellUser ? false : true)
    );

    const querySnapshot = await getDocs(queryRef);
    let templateList: any = [];
    querySnapshot.forEach((doc) => {
      let template = doc.data() as Template;
      templateList.push(template);
    });
    setTemplates(templateList);
  };

  const onReorder = (newOrder: any) => {
    setCurrentOrder(newOrder);
  };

  const onDisable = (key: string) => {
    let newOrder = currentOrder.map((item) => {
      if (item.key === key) {
        return {
          ...item,
          disabled: !item.disabled,
        };
      }
      return item;
    });
    setCurrentOrder(newOrder);
  };
  const itemRenderFn = (item: any, dragHandle: any) => {
    return (
      <div className="section-item">
        {/* <dragHandle className="drag-handle">:::</dragHandle> */}
        <Row align="middle">
          <span style={{ width: "12px", marginRight: "8px" }}>
            {dragHandle}
          </span>
          <Typography.Text>{item.name}</Typography.Text>
        </Row>
        <Checkbox
          checked={!item.disabled}
          onChange={() => {
            onDisable(item.key);
          }}
        />
      </div>
    );
  };

  const handleTemplateSelect = async (templateId: string) => {
    await updateTemplate(templateId);
    updatePreview();
  };

  return (
    <div className="personal-info-form resume-edit-detail">
      <Row className="adjustment-section">
        <Col span={10} className="left">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Templates" key="1">
              <div className="detail-form-header">
                <Row wrap gutter={[24, 24]}>
                  {templates.map((template, idx) => {
                    return (
                      <Col
                        span={12}
                        key={idx}
                        className={
                          resume?.templateId === template.id
                            ? "template-card selected"
                            : "template-card"
                        }
                      >
                        <div
                          className="template-card-container"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <img src={template.imgUrl} alt={template.name} />
                          <div className="name">
                            <Typography.Text>{template.name}</Typography.Text>
                          </div>
                          {/* <div className="tags">Tags, Keywords</div> */}
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Customize" key="2">
              <div className="detail-form-header">
                {/* <Typography.Title level={4}>Education</Typography.Title> */}
                <SortableComponent
                  items={currentOrder}
                  onReorder={onReorder}
                  renderFn={itemRenderFn}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Col>
        <Col
          span={14}
          style={{
            overflow: "scroll",
            height: "100%",
          }}
        >
          <div
            className=""
            style={{
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              // height: "100%",
              zIndex: 1000,
              // Overlay
              position: "absolute",
              top: "50%",
              left: "50%",
            }}
          >
            
            {updatingPreview ? (
              <i
                className="fa-solid fa-spinner fa-circle fa-spin-pulse"
                style={{
                  fontSize: "32px",
                  color: "var(--accent-1)",
                }}
              ></i>
            ) : null}
          </div>
          <div
            style={{
              overflow: "scroll",
              height: "100%",
            }}
          >
            {resumeURL ? <PDFViewer documentURL={resumeURL} /> : null}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Adjustment;

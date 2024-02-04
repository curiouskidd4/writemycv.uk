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
import EditorJsInput from "../../../components/editor";
import CustomDateRange from "../../../components/dateRange";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Experience, ExperienceList } from "../../../types/resume";
import "./index.css";
import SingleExperienceForm from "./components/experienceEditForm";
import { Timestamp } from "firebase/firestore";

const ExperienceCard = ({
  experience,
  onClick,
}: {
  experience: Experience;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className="title">
        {experience.employerName || "(New Experience)"}
      </div>
      <div className="subtitle">{experience.position}</div>
      {/* <div className="date-range">
            {experience.dateRange[0]} - {experience.dateRange[1]}
        </div> */}
    </>
  );
};

type ExperienceProps = {
  experienceList: Experience[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncExperience: (values: any) => Promise<void>;
  showTitle: boolean;
};

type ExperienceState = {
  selectedExperience: Experience | null;
  selectedExperienceIdx: number;
};

const ExperienceForm = ({
  experienceList,
  saveLoading,
  onFinish,
  syncExperience,
  showTitle = true,
}: ExperienceProps) => {
  const [state, setState] = React.useState<ExperienceState>({
    selectedExperience:
      experienceList && experienceList.length > 0 ? experienceList[0] : null,
    selectedExperienceIdx: 0,
  });

  const onSave = async (experience: Experience) => {
    experienceList[state.selectedExperienceIdx] = experience;
    await syncExperience(experienceList);
    if (onFinish) {
      await onFinish(experience);
    }
    message.success("Experience saved");
  };

  const addNewExperience = () => {
    const newExperience: Experience = {
      id: (experienceList.length + 1).toString(),
      employerName: "",
      position: "",
      description: "",
      startDate: Timestamp.now(),
      endDate: null,
      achievements: [],
      aiSuggestions: null,
    };
    setState((prev) => ({
      selectedExperience: newExperience,
      selectedExperienceIdx: experienceList.length,
    }));
  };

  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Experience</Typography.Title>
      ) : null}
      <Row gutter={24} style={{ height: "100%" }}>
        <Col span={4} className="education-history-selector selector-col">
          <Menu
            className="experience-menu"
            defaultSelectedKeys={[state.selectedExperienceIdx.toString()]}
            style={{
              //   height: "100%",
              borderRight: 0,
              background: "transparent",
            }}
            onSelect={(item) => {
              setState({
                selectedExperience: experienceList[parseInt(item.key)],
                selectedExperienceIdx: parseInt(item.key),
              });
            }}
            items={experienceList.map((exp, idx) => {
              return {
                key: idx.toString(),
                label: <ExperienceCard experience={exp} />,
                //   label: edu.degree,
              };
            })}
          ></Menu>

          <Row justify="start">
            <Button style={{ margin: "8px 24px" }} onClick={addNewExperience}>
              <PlusOutlined /> Add Experience
            </Button>
          </Row>
        </Col>
        <Col
          span={20}
          style={{
            paddingLeft: "24px",
            overflowY: "scroll",
            height: "100%",
            paddingBottom: "12px",
          }}
        >
          <div>
            <Typography.Title level={5}>
              Experience #{state.selectedExperienceIdx + 1}
            </Typography.Title>
          </div>
          {state.selectedExperience && (
            <SingleExperienceForm
              initialValues={state.selectedExperience}
              onFinish={onSave}
              saveLoading={saveLoading}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ExperienceForm;

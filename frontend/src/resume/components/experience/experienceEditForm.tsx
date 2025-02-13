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
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";

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
  // onFinish: (values: any) => Promise<void>;
  syncExperience: (values: any) => Promise<void>;
  showTitle: boolean;
};

type ExperienceState = {
  selectedExperience: Experience | null;
  selectedId: string | null;
};

const ExperienceForm = ({
  experienceList,
  saveLoading,
  // onFinish,
  syncExperience,
  showTitle = true,
}: ExperienceProps) => {
  const [newItem, setNewItem] = React.useState<Experience | null>(null);
  const [state, setState] = React.useState<ExperienceState>({
    selectedExperience:
      experienceList && experienceList.length > 0 ? experienceList[0] : null,
    selectedId:
      experienceList && experienceList.length > 0 ? experienceList[0].id : null,
  });

  const onSave = async (experience: Experience) => {
    if (newItem) {
      setNewItem(null);

      await syncExperience([...experienceList, experience]);
      // await onFinish(experience);
      message.success("Experience saved");
    } else {
      experienceList = experienceList.map((item) => {
        if (item.id === experience.id) {
          return { ...experience };
        }
        return item;
      });
      await syncExperience(experienceList);
      // await onFinish(experience);
      message.success("Experience saved");
    }
  };

  const addNewExperience = () => {
    debugger;
    const newExperience: Experience = {
      id: ObjectID().toHexString(),
      employerName: "",
      position: "",
      description: "",
      startDate: Timestamp.now(),
      endDate: null,
      achievements: [],
      aiSuggestions: null,
    };
    setNewItem(newExperience);
    setState((prev) => ({
      selectedExperience: newExperience,
      selectedId: "new",
    }));
  };

  const onDelete = async (id: string | undefined) => {
    if (id == newItem?.id) {
      // Remove new item 
      setNewItem(null);
    }else{
      let newExperienceList = experienceList.filter((item) => item.id !== id);
      await syncExperience(newExperienceList);
    }

    setState((prev) => ({
      ...prev,
      selectedExperience: null,
      selectedId: null,
    }));
  };
  const detailExtractor = (education: Experience) => {
    return { title: education.employerName, subtitle: education.position };
  };

  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Experience</Typography.Title>
      ) : null}
      <Row style={{ height: "100%", flexWrap: "nowrap" }}>
        <Col
          style={{
            width: "250px",
            minWidth: "250px",
          }}
          className="education-history-selector selector-col"
        >
          <SelectorSidebar
            items={experienceList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Experience[]) => {
              syncExperience(newOrder);
            }}
            addNew={addNewExperience}
            entityTitle="Experience"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState((prev) => ({
                ...prev,
                selectedExperience: experienceList.filter(
                  (item) => item.id === key
                )[0],
                selectedId: key,
              }));
              setNewItem(null);
            }}
            newItem={newItem ? true : false}
          />
        </Col>
        <Col
          // flex="auto"
          style={{
            paddingTop: "24px",

            paddingLeft: "24px",
            overflowY: "scroll",
            height: "100%",
            paddingBottom: "12px",
          }}
        >
          {state.selectedExperience && (
            <SingleExperienceForm
              key={state.selectedExperience.id}
              initialValues={state.selectedExperience}
              onFinish={onSave}
              saveLoading={saveLoading}
              onDelete={() => onDelete(state.selectedExperience?.id)}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default ExperienceForm;

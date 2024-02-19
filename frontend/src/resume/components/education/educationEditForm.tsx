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
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";

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
  selectedId: string | null;
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
    selectedId: educationList.length > 0 ? educationList[0].id : null,
  });

  const onSave = async (education: Education) => {
    // Update based on id
    let newEducationList = educationList.map((item) => {
      if (item.id === education.id) {
        return { ...education };
      }
      return item;
    }
    );


    await syncEducation(newEducationList);
    if (onFinish) {
      await onFinish(education);
    }
    message.success("Education saved");
  };

  const addNew = () => {
    const newItem: Education = {
      id: ObjectID().toHexString(),
      school: "",
      degree: "",
      description: "",
      startDate: Timestamp.now(),
      endDate: null,
      dissertation: null,
      aiSuggestions: null,
      grade: "",
      modules: [],
      isNew: true,
    };
    setState((prev) => ({
      selectedEducation: newItem,
      selectedEducationIdx: educationList.length,
      selectedId: newItem.id,
    }));
  };

  const detailExtractor = (education: Education) => {
    return { title: education.degree, subtitle: education.school };
  };

  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Education</Typography.Title>
      ) : null}
      <Row style={{ height: "100%", flexWrap: "nowrap" }}>
        <Col
          style={{
            minWidth: "250px",
            width: "250px",
          }}
          className="education-history-selector selector-col"
        >
          <SelectorSidebar
            items={educationList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Education[]) => {
              syncEducation(newOrder);
            }}
            addNew={addNew}
            entityTitle="Education"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState({
                selectedEducation: educationList.filter(
                  (item) => item.id === key
                )[0],
                selectedEducationIdx: parseInt(key),
                selectedId: key,
              });
            }}
          />
        </Col>
        <Col
          flex="auto"
          style={{
            paddingLeft: "24px",
            paddingTop: "24px",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "2rem",
          }}
        >
          {state.selectedEducation != null ? (
            <>
              <SingleEducationForm
                key={state.selectedEducation.id}
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

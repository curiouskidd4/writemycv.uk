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
  // onFinish?: (values: any) => Promise<void>;
  syncEducation: (values: any) => Promise<void>;
  showTitle: boolean;
};

type EducationState = {
  selectedEducation: Education | null;
  selectedId: string | null;
};

const EducationForm = ({
  educationList,
  saveLoading,
  // onFinish,
  syncEducation,
  showTitle = true,
}: EducationProps) => {
  const [newItem, setNewItem] = React.useState<Education | null>(null);

  educationList = educationList || [];
  const [state, setState] = React.useState<EducationState>({
    selectedEducation: educationList.length > 0 ? educationList[0] : null,
    selectedId: educationList.length > 0 ? educationList[0].id : null,
  });

  const onSave = async (education: Education) => {
    if (newItem) {
      setNewItem(null);

      await syncEducation([...educationList, education]);
      // await onFinish(experience);
      message.success("Experience saved");
    }else{
    // Update based on id
    let newEducationList = educationList.map((item) => {
      if (item.id === education.id) {
        return { ...education };
      }
      return item;
    });

    await syncEducation(newEducationList);
  

    message.success("Education saved");
  }
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
    setNewItem(newItem);
    setState((prev) => ({
      selectedEducation: newItem,
      selectedId: newItem.id,
    }));
  };

  const detailExtractor = (education: Education) => {
    return { title: education.degree, subtitle: education.school };
  };

  const onDelete = async (id: string | undefined) => {
    if (id == newItem?.id) {
      // Remove new item 
      setNewItem(null);
    }else{
      let newEducationList = educationList.filter((item) => item.id !== id);
      await syncEducation(newEducationList);
    }

    setState((prev) => ({
      ...prev,
      selectedEducation: null,
      selectedId: null,
    }));
  }

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
                selectedId: key,
              });
              setNewItem(null);

            }}
            newItem={newItem ? true : false}
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
                onDelete={() => onDelete(state.selectedEducation?.id)}

              />
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default EducationForm;

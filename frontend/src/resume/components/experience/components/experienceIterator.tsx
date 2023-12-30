import React, { useEffect } from "react";
import { Experience } from "../../../../types/resume";
import ExperienceFporm from "./experienceEditForm";
import SingleExperienceForm from "./experienceEditForm";
import { Button, Row, Space, Typography, Col, Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ExperienceCard = ({
  experience,
  onClick,
}: {
  experience: Experience;
  onClick?: () => void;
}) => {
  return (
    <>
      <div className="title">{experience.position}</div>
      <div className="subtitle">{experience.employerName}</div>
      {/* <div className="date-range">
            {education.dateRange[0]} - {education.dateRange[1]}
        </div> */}
    </>
  );
};

const ExperienceMenu = ({
  selectedIdx,
  educationList,
  addNew,
}: {
  selectedIdx?: number;
  educationList: Experience[];
  addNew: () => void;
}) => {
  useEffect(() => {
    if (selectedIdx === null || selectedIdx === undefined || selectedIdx == state.selectedEducationIdx) {
      return;
    }
    if (selectedIdx < educationList.length) {
      setState((prev) => ({
        ...prev,
        selectedEducation: educationList[selectedIdx],
        selectedEducationIdx: selectedIdx,
      }));
    }
  });
  type EducationState = {
    selectedEducation: Experience | null;
    selectedEducationIdx: number | null;
  };
  const [state, setState] = React.useState<EducationState>({
    selectedEducation: null,
    selectedEducationIdx: null,
  });

  return (
    <div className="education-history-selector">
      {/* <Typography.Title level={5}>Education Items</Typography.Title> */}
      <Typography.Text type="secondary">Your history</Typography.Text>

      <Menu
        className="education-menu"
        defaultSelectedKeys={
          state.selectedEducationIdx != null
            ? [state.selectedEducationIdx.toString()]
            : []
        }
        style={{
          //   height: "100%",
          borderRight: 0,
          background: "transparent",
        }}
        onSelect={(item) => {
          setState({
            selectedEducation: educationList[parseInt(item.key)],
            selectedEducationIdx: parseInt(item.key),
          });
        }}
        selectedKeys={state.selectedEducationIdx != undefined? [state.selectedEducationIdx.toString()]: undefined}
        items={educationList.map((edu, idx) => {
          return {
            key: idx.toString(),
            label: <ExperienceCard experience={edu} />,
            //   label: edu.degree,
          };
        })}
      ></Menu>
      <Row justify="center">
        <Button style={{ width: "90%", margin: "8px auto" }} onClick={addNew}>
          <PlusOutlined /> Add Education
        </Button>
      </Row>
    </div>
  );
};


type ExperienceIteratorProps = {
  experienceList: Experience[];
  onFinish: () => void;
  syncExperience: (experienceList: Experience[]) => Promise<void>; 
};

type ExperienceIteratorState = {
  currentEditIdx: number | null;
  finished: boolean;
};
const ExperienceIterator = ({
  experienceList,
  onFinish,
  syncExperience
}: ExperienceIteratorProps) => {
  const [state, setState] = React.useState<ExperienceIteratorState>({
    currentEditIdx: null,
    finished: false,
  });

  const saveExperience = async (experience: Experience) => {
    console.log(experience);
    if (state.currentEditIdx === null) {
      return;
    }
    experienceList[state.currentEditIdx] = experience;
    await syncExperience(experienceList);
    setState((prev) => ({
      ...prev,
      finished: prev.currentEditIdx === experienceList.length - 1,
      currentEditIdx:
        prev.currentEditIdx === null
          ? null
          : prev.currentEditIdx == experienceList.length - 1
          ? null
          : prev.currentEditIdx + 1,
    }));
  };

  if (state.currentEditIdx === null && !state.finished) {
    return (
      <div className="detail-form-body">
        <Space direction="vertical">
          <div className="cv-message">
            <Typography.Text>
              Let's go through your experience and refine them to make them look
              better
            </Typography.Text>
          </div>

          <Button
            type="primary"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                currentEditIdx: 0,
              }));
            }}
          >
            Let's Start
          </Button>
        </Space>
      </div>
    );
  } else if (state.finished) {
    return (
      <div className="detail-form-body">
        <Space direction="vertical">
          <div className="cv-message">
            <Row>
              <Typography.Text>All done!</Typography.Text>
            </Row>
          </div>
          <Button
            type="primary"
            onClick={() => {
              onFinish();
            }}
          >
            {" "}
            Finish{" "}
          </Button>
        </Space>
      </div>
    );
  } else if (state.currentEditIdx !== null) {
    return (
      <Row gutter={16}>
        <Col span={8}>
          <ExperienceMenu
            selectedIdx={state.currentEditIdx}
            educationList={experienceList}
            addNew={() => {
              setState((prev) => ({
                ...prev,
                currentEditIdx: experienceList.length,
              }));
            }}
          />
        </Col>
        <Col span={16}>
      <div className="detail-form-body">
        <Space direction="vertical">
          <Row>
            <Col>
              <Typography.Text strong>
                {experienceList[state.currentEditIdx].position}
              </Typography.Text>
            </Col>
            <Col style={{ marginLeft: "auto" }}>
              <Typography.Text strong>
                {state.currentEditIdx + 1} / {experienceList.length}
              </Typography.Text>
            </Col>
          </Row>
          <SingleExperienceForm
            initialValues={experienceList[state.currentEditIdx]}
            onFinish={saveExperience}
          />
        </Space>
      </div>
      </Col>
      </Row>
    );
  }
};

export default ExperienceIterator;

import React from "react";
import { Experience } from "../../../../types/resume";
import ExperienceFporm from "./experienceEditForm";
import SingleExperienceForm from "./experienceEditForm";
import { Button, Row, Space, Typography, Col } from "antd";

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
    );
  }
};

export default ExperienceIterator;

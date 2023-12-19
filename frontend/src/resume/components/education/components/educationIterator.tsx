import React from "react";
import { Education } from "../../../../types/resume";
import EducationForm from "./educationEditForm";
import SingleEducationForm from "./educationEditForm";
import { Button, Row, Space, Typography, Col } from "antd";

type EducationIteratorProps = {
  educationList: Education[];
  onFinish: () => void;
  syncEducation: (educationList: Education[]) => Promise<void>;
};

type EducationIteratorState = {
  currentEditIdx: number | null;
  finished: boolean;
  loading: boolean;
};
const EducationIterator = ({
  educationList,
  onFinish,
  syncEducation,
}: EducationIteratorProps) => {
  const [state, setState] = React.useState<EducationIteratorState>({
    currentEditIdx: null,
    finished: false,
    loading: false,
  });

  const saveEducation = async (education: Education) => {
    if (state.currentEditIdx === null) {
      return;
    }
    educationList[state.currentEditIdx] = education;
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    await syncEducation(educationList);
    setState((prev) => ({
      ...prev,
      loading: false,
      finished: prev.currentEditIdx === educationList.length - 1,
      currentEditIdx:
        prev.currentEditIdx === null
          ? null
          : prev.currentEditIdx == educationList.length - 1
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
              Let's go through your education and refine them to make them look
              better
            </Typography.Text>
          </div>

          <div className="cv-submit">
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
          </div>
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
          <div className="cv-submit">
            <Button
              onClick={() => {
                onFinish();
              }}
              type="primary"
            >
              {" "}
              Finish{" "}
            </Button>
          </div>
        </Space>
      </div>
    );
  } else if (state.currentEditIdx !== null) {
    return (
      <div className="detail-form-body">
        <div className="cv-input">
          <Space direction="vertical">
            <Row>
              <Col>
                <Typography.Text strong>
                  {educationList[state.currentEditIdx].degree}
                </Typography.Text>
              </Col>
              <Col style={{ marginLeft: "auto" }}>
                <Typography.Text strong>
                  {state.currentEditIdx + 1} / {educationList.length}
                </Typography.Text>
              </Col>
            </Row>
            <SingleEducationForm
              initialValues={educationList[state.currentEditIdx]}
              onFinish={saveEducation}
            />
          </Space>
        </div>
      </div>
    );
  }
};

export default EducationIterator;

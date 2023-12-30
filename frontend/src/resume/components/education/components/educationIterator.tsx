import React, { useEffect } from "react";
import { Education } from "../../../../types/resume";
import EducationForm from "./educationEditForm";
import SingleEducationForm from "./educationEditForm";
import { Button, Row, Space, Typography, Col, Menu } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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

const EducationMenu = ({
  selectedIdx,
  educationList,
  addNew,
}: {
  selectedIdx?: number;
  educationList: Education[];
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
    selectedEducation: Education | null;
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
            label: <EducationCard education={edu} />,
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
              Next
            </Button>
          </div>
        </Space>
      </div>
    );
  } else if (state.currentEditIdx !== null) {
    return (
      <Row gutter={16}>
        <Col span={8}>
          <EducationMenu
            selectedIdx={state.currentEditIdx}
            educationList={educationList}
            addNew={() => {
              setState((prev) => ({
                ...prev,
                currentEditIdx: educationList.length,
              }));
            }}
          />
        </Col>
        <Col span={16}>
          <div className="detail-form-body">
            <div className="cv-input">
              <Space direction="vertical">
                <Row>
                  <Col>
                    <Typography.Text strong>
                      {educationList[state.currentEditIdx].school}
                    </Typography.Text>
                  </Col>
                  {/* <Col style={{ marginLeft: "auto" }}>
                    <Typography.Text strong>
                      {state.currentEditIdx + 1} / {educationList.length}
                    </Typography.Text>
                  </Col> */}
                </Row>
                <SingleEducationForm
                  initialValues={educationList[state.currentEditIdx]}
                  onFinish={saveEducation}
                />
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
};

export default EducationIterator;

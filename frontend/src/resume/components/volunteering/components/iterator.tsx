import React, { useEffect } from "react";
import { Volunteering } from "../../../../types/resume";
import SingleVolunteerForm from "./editForm";
import { Button, Row, Space, Typography, Col, Menu, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
const VolunteerCard = ({ volunteer }: { volunteer: Volunteering }) => {
  let volunteerStart = volunteer.startDate ? moment(volunteer.startDate.toDate()).format("MMM YYYY") : "";
  let volunteerEnd = volunteer.endDate ? moment(volunteer.endDate.toDate()).format("MMM YYYY") : "Current";
  return (
    <Row className="menu-card-details">
      <div className="title">{volunteer.title}</div>
      <div className="subtitle">{volunteerStart}-{volunteerEnd}</div>
    </Row>
  );
};

const VolunteerMenu = ({
  selectedIdx,
  volunteerList,
  addNew,
  onChange,

}: {
  selectedIdx?: number | null;
  volunteerList: Volunteering[];
  addNew: () => void;
  onChange: (idx: number) => void;
}) => {
  useEffect(() => {
    if (selectedIdx === null || selectedIdx === undefined || selectedIdx == state.selectedVolunteerIdx) {
      return;
    }
    if (selectedIdx < volunteerList.length) {
      setState((prev) => ({
        ...prev,
        selectedVolunteer: volunteerList[selectedIdx],
        selectedVolunteerIdx: selectedIdx,
      }));
    }
    if (selectedIdx == volunteerList.length) {
      setState((prev) => ({
        ...prev,
        selectedAward: null,
        selectedAwardIdx: null,
      }));
    }
  }, [selectedIdx, volunteerList]
  );
  type VolunteerState = {
    selectedVolunteer: Volunteering | null;
    selectedVolunteerIdx: number | null;
  };
  const [state, setState] = React.useState<VolunteerState>({
    selectedVolunteer: null,
    selectedVolunteerIdx: null,
  });

  return (
    <div className="volunteer-history-selector menu-selector">
      {/* <Typography.Title level={5}>Volunteer Items</Typography.Title> */}
      <Typography.Text type="secondary">Your history</Typography.Text>
      {volunteerList.length == 0 ? (
        <Empty
          className="empty-content"
          description={
            <Typography.Text type="secondary">Nothing here</Typography.Text>
          }
        />
      ) : (
      <Menu
        className="volunteer-menu"
        defaultSelectedKeys={
          state.selectedVolunteerIdx != null
            ? [state.selectedVolunteerIdx.toString()]
            : []
        }
        style={{
          //   height: "100%",
          borderRight: 0,
          background: "transparent",
        }}
        onSelect={(item) => {
          setState({
            selectedVolunteer: volunteerList[parseInt(item.key)],
            selectedVolunteerIdx: parseInt(item.key),
          });
          onChange(parseInt(item.key));
        }}
        selectedKeys={state.selectedVolunteerIdx != undefined? [state.selectedVolunteerIdx.toString()]: undefined}
        items={volunteerList.map((edu, idx) => {
          return {
            key: idx.toString(),
            label: <VolunteerCard volunteer={edu} />,
            //   label: edu.degree,
          };
        })}
      ></Menu>)}
      <Row justify="center" className="menu-action">
        <Button style={{ width: "90%", margin: "8px auto" }} onClick={addNew}>
          <PlusOutlined /> Add Volunteer
        </Button>
      </Row>
    </div>
  );
};

type VolunteerIteratorProps = {
  volunteerList: Volunteering[];
  onFinish: () => void;
  syncVolunteer: (volunteerList: Volunteering[]) => Promise<void>;
};

type VolunteerIteratorState = {
  currentEditIdx: number | null;
  finished: boolean;
  loading: boolean;
};
const VolunteerIterator = ({
  volunteerList,
  onFinish,
  syncVolunteer,
}: VolunteerIteratorProps) => {
  const [state, setState] = React.useState<VolunteerIteratorState>({
    currentEditIdx: null,
    finished: false,
    loading: false,
  });

  const saveVolunteer = async (volunteer: Volunteering) => {
    if (state.currentEditIdx === null) {
      return;
    }
    let newVolunteerList = [...volunteerList];
    // Add new case
    if (state.currentEditIdx === volunteerList.length) {
      newVolunteerList = [...volunteerList, volunteer];
    }
    newVolunteerList = newVolunteerList.map((item, idx) => {
      if (idx === state.currentEditIdx) {
        return {
          ...volunteer,
          startDate:  Timestamp.fromDate(volunteer.startDate.toDate()) ,
          endDate: volunteer.endDate ? Timestamp.fromDate(volunteer.endDate.toDate()) : null,
        };
      }
      return item;
    });
    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    await syncVolunteer(newVolunteerList);
    setState((prev) => ({
      ...prev,
      loading: false,
      finished: prev.currentEditIdx === volunteerList.length - 1,
      currentEditIdx:
        prev.currentEditIdx === null
          ? null
          : prev.currentEditIdx ,
    }));
  };



    return (
      <Row gutter={16}>
        <Col span={8}>
          <VolunteerMenu
            selectedIdx={state.currentEditIdx}
            volunteerList={volunteerList}
            addNew={() => {
              setState((prev) => ({
                ...prev,
                currentEditIdx: volunteerList.length,
              }));
            }}
            onChange={(idx) => {
              setState((prev) => ({
                ...prev,
                currentEditIdx: idx,
              }));
            }}
          />
        </Col>
        <Col span={16}>
        {state.currentEditIdx != null ? (

          <div className="detail-form-body">
            <div className="cv-input">
              <Space direction="vertical">
                <Row>
                  <Col>
                    <Typography.Text strong>
                      {volunteerList[state.currentEditIdx]?.title || "New Volunteer"}
                    </Typography.Text>
                  </Col>
                  {/* <Col style={{ marginLeft: "auto" }}>
                    <Typography.Text strong>
                      {state.currentEditIdx + 1} / {volunteerList.length}
                    </Typography.Text>
                  </Col> */}
                </Row>
                <SingleVolunteerForm
                  initialValues={volunteerList[state.currentEditIdx]}
                  onFinish={saveVolunteer}
                />
              </Space>
            </div>
          </div>
        ) : null}
        </Col>
      </Row>
    );
  
};

export default VolunteerIterator;

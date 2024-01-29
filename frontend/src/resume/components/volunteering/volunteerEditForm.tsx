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
import { Volunteering, VolunteeringList } from "../../../types/resume";
import "./index.css";
import SingleVolunteersFrom from "./components/editForm";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

const VolunteerCard = ({ volunteer }: { volunteer: Volunteering }) => {
  let volunteerStart = volunteer.startDate ? moment(volunteer.startDate.toDate()).format("MMM YYYY") : "";
  let volunteerEnd = volunteer.endDate ? moment(volunteer.endDate.toDate()).format("MMM YYYY") : "Current";
  return (
    <>
      <div className="title">{volunteer.title}</div>
      <div className="subtitle">{volunteerStart}-{volunteerEnd}</div>
    </>
  );
};

type VolunteerProps = {
  volunteerList: Volunteering[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncVolunteers: (values: any) => Promise<void>;
  showTitle: boolean;
};

type VolunteerState = {
  selectedVolunteer: Volunteering | null;
  selectedVolunteerIdx: number | null;
};

const VolunteerForm = ({
  volunteerList,
  saveLoading,
  onFinish,
  syncVolunteers,
  showTitle = true,
}: VolunteerProps) => {
  volunteerList = volunteerList || [];
  const [state, setState] = React.useState<VolunteerState>({
    selectedVolunteer: volunteerList.length > 0 ? volunteerList[0] : null,
    selectedVolunteerIdx: volunteerList.length > 0 ? 0 : null,
  });

  const onSave = async (volunteer: Volunteering) => {
    
    volunteer.startDate = Timestamp.fromDate(
      volunteer.startDate.toDate()
    );
    volunteer.endDate = volunteer.endDate?  Timestamp.fromDate(
      volunteer.endDate.toDate()
    ) : null;
    volunteerList[state.selectedVolunteerIdx!] = volunteer;
    await syncVolunteers(volunteerList);
    setState((prev) => ({
      ...prev,
      selectedVolunteer: volunteer,
    }));
    message.success("Volunteer saved!");
    if (onFinish) {
      await onFinish(volunteerList);
    }
  };

  const addNew = () => {
    const newItem: Volunteering = {
      id: (volunteerList.length + 1).toString(),
      title: "",
      startDate: Timestamp.fromDate(new Date()),
      endDate: null,
      description: "",
    };
    setState((prev) => ({
      selectedVolunteer: newItem,
      selectedVolunteerIdx: volunteerList.length,
    }));
  };


  return (
    <>
      {showTitle ? <Typography.Title level={4}>Volunteer</Typography.Title> : null}
      <Row gutter={24} style={{ height: "70vh" }}>
        <Col span={8} className="volunteer-history-selector">
          {/* <Typography.Title level={5}>Volunteer Items</Typography.Title> */}
          <Typography.Text type="secondary">Your history</Typography.Text>

          <Menu
            className="volunteer-menu"
            selectedKeys={
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
            }}
            items={volunteerList.map((edu, idx) => {
              return {
                key: idx.toString(),
                label: <VolunteerCard volunteer={edu} />,
                //   label: edu.degree,
              };
            })}
          ></Menu>
          <Row justify="center">
            <Button
              style={{ width: "90%", margin: "8px auto" }}
              onClick={addNew}
            >
              <PlusOutlined /> Add Volunteer
            </Button>
          </Row>
        </Col>
        <Col span={16} style={{ paddingLeft: "24px" }}>
          {/* {state.selectedVolunteer && (
              <SingleVolunteerForm
                initialValues={state.selectedVolunteer}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedVolunteer != null && state.selectedVolunteerIdx != null ? (
            <>
              <div>
                <Typography.Title level={5}>
                  Volunteering #{state.selectedVolunteerIdx + 1}
                </Typography.Title>
              </div>
              <SingleVolunteersFrom
                initialValues={{...state.selectedVolunteer}}
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

export default VolunteerForm;

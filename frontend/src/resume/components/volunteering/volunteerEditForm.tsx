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
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";

type VolunteerProps = {
  volunteerList: Volunteering[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncVolunteers: (values: any) => Promise<void>;
  showTitle: boolean;
};

type VolunteerState = {
  selectedVolunteer: Volunteering | null;
  selectedId: string | null;
  isNewItem?: boolean;
};

const VolunteerForm = ({
  volunteerList,
  saveLoading,
  syncVolunteers,
  showTitle = true,
}: VolunteerProps) => {
  volunteerList = volunteerList || [];
  const [newItem, setNewItem] = React.useState<Volunteering | null>(null);

  const [state, setState] = React.useState<VolunteerState>({
    selectedVolunteer: volunteerList.length > 0 ? volunteerList[0] : null,
    selectedId: volunteerList.length > 0 ? volunteerList[0].id : null,
  });

  const onSave = async (volunteer: Volunteering) => {
    if (state.isNewItem) {
      setNewItem(null);
      volunteer.startDate = Timestamp.fromDate(volunteer.startDate.toDate());
      volunteer.endDate = volunteer.endDate
        ? Timestamp.fromDate(volunteer.endDate.toDate())
        : null;
      await syncVolunteers([...volunteerList, volunteer]);
    } else {
      volunteer.startDate = Timestamp.fromDate(volunteer.startDate.toDate());
      volunteer.endDate = volunteer.endDate
        ? Timestamp.fromDate(volunteer.endDate.toDate())
        : null;

      // publicationList[state.selectedPublicationIdx!] = publication;
      let newVolunteerList = [...volunteerList];
      let idx = newVolunteerList.findIndex((item) => item.id === volunteer.id);
      if (idx > -1) {
        newVolunteerList[idx] = volunteer;
      } else {
        newVolunteerList.push(volunteer);
      }

      await syncVolunteers(newVolunteerList);
      message.success("Volunteer item saved!");
    }
  };

  const addNew = () => {
    const newItem: Volunteering = {
      id: ObjectID().toHexString(),
      title: "",
      startDate: Timestamp.fromDate(new Date()),
      endDate: null,
      description: "",
    };
    setNewItem(newItem);
    setState((prev) => ({
      selectedVolunteer: newItem,
      selectedId: newItem.id,
      isNewItem: true,
    }));
  };

  const onDelete = async (id: string | undefined) => {
    if (id === newItem?.id) {
      setNewItem(null);
    } else {
      let newVolunteerList = volunteerList.filter((item) => item.id !== id);
      await syncVolunteers(newVolunteerList);
      message.success("Volunteer item deleted!");
    }
    setState((prev) => ({
      ...prev,

      selectedVolunteer: null,
      selectedId: null,
    }));
  };

  const detailExtractor = (volunteer: Volunteering) => {
    return { title: volunteer.title, subtitle: "" };
  };

  console.log("VolunteerList", volunteerList);
  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Volunteer</Typography.Title>
      ) : null}
      <Row
        style={{
          height: "100%",
        }}
      >
        <Col
          style={{
            width: "250px",
            minWidth: "250px",
          }}
          className="volunteer-history-selector selector-col"
        >
          {/* <Typography.Title level={5}>Volunteer Items</Typography.Title> */}
          {/* <Typography.Text type="secondary">Your history</Typography.Text> */}

          {/* <Menu
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
           <Row justify="start">
            <Button style={{ margin: "8px 24px" }} onClick={addNew}>
              <PlusOutlined /> Add Volunteer
            </Button>
          </Row> */}

          <SelectorSidebar
            items={volunteerList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Volunteering[]) => {
              syncVolunteers(newOrder);
            }}
            addNew={addNew}
            entityTitle="Volunteering"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState({
                selectedVolunteer: volunteerList.filter(
                  (item) => item.id === key
                )[0],
                selectedId: key,
              });
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
          {/* {state.selectedVolunteer && (
              <SingleVolunteerForm
                initialValues={state.selectedVolunteer}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedVolunteer != null ? (
            <>
              {/* <div>
                <Typography.Title level={5}>
                  Volunteering #{state.selectedVolunteerIdx + 1}
                </Typography.Title>
              </div> */}
              <SingleVolunteersFrom
                isNewItem={state.isNewItem}
                key={state.selectedVolunteer.id}
                initialValues={{ ...state.selectedVolunteer }}
                onFinish={onSave}
                saveLoading={saveLoading}
                onDelete={() => onDelete(state.selectedVolunteer?.id)}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default VolunteerForm;

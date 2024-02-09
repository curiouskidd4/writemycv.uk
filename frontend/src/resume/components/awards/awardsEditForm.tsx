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
import { Award, AwardList } from "../../../types/resume";
import "./index.css";
import SingleAwardsFrom from "./components/editForm";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

const AwardCard = ({ award }: { award: Award }) => {
  let awardDateStr = moment(award.date.toDate()).format("MMM YYYY");
  return (
    <>
      <div className="title">{award.title}</div>
      <div className="subtitle">{awardDateStr}</div>
    </>
  );
};

type AwardProps = {
  awardList: Award[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncAwards: (values: any) => Promise<void>;
  showTitle: boolean;
};

type AwardState = {
  selectedAward: Award | null;
  selectedAwardIdx: number | null;
};

const AwardForm = ({
  awardList,
  saveLoading,
  onFinish,
  syncAwards,
  showTitle = true,
}: AwardProps) => {
  awardList = awardList || [];
  const [state, setState] = React.useState<AwardState>({
    selectedAward: awardList.length > 0 ? awardList[0] : null,
    selectedAwardIdx: awardList.length > 0 ? 0 : null,
  });

  const onSave = async (award: Award) => {
    award.date = Timestamp.fromDate(award.date.toDate());
    awardList[state.selectedAwardIdx!] = award;

    await syncAwards(awardList);
    message.success("Award saved!");
    if (onFinish) {
      await onFinish(awardList);
    }
  };

  const addNew = () => {
    const newItem: Award = {
      id: (awardList.length + 1).toString(),
      title: "",
      date: Timestamp.fromDate(new Date()),
      description: "",
      organization: "",
    };
    setState((prev) => ({
      selectedAward: newItem,
      selectedAwardIdx: awardList.length,
    }));
  };

  return (
    <>
      {showTitle ? <Typography.Title level={4}>Award</Typography.Title> : null}
      <Row
        style={{
          height: "100%",
        }}
      >
        <Col
          style={{
            minWidth: "250px",
            width: "250px",
          }}
          className="award-history-selector selector-col"
        >
          {/* <Typography.Title level={5}>Award Items</Typography.Title> */}
          {/* <Typography.Text type="secondary">Your history</Typography.Text> */}

          <Menu
            className="award-menu"
            defaultSelectedKeys={
              state.selectedAwardIdx != null
                ? [state.selectedAwardIdx.toString()]
                : []
            }
            style={{
              //   height: "100%",
              borderRight: 0,
              background: "transparent",
            }}
            onSelect={(item) => {
              setState({
                selectedAward: awardList[parseInt(item.key)],
                selectedAwardIdx: parseInt(item.key),
              });
            }}
            items={awardList.map((edu, idx) => {
              return {
                key: idx.toString(),
                label: <AwardCard award={edu} />,
                //   label: edu.degree,
              };
            })}
          ></Menu>
          <Row justify="start">
            <Button style={{ margin: "8px 24px" }} onClick={addNew}>
              <PlusOutlined /> Add Award
            </Button>
          </Row>
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
          {/* {state.selectedAward && (
              <SingleAwardForm
                initialValues={state.selectedAward}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedAward != null && state.selectedAwardIdx != null ? (
            <>
              <div>
                <Typography.Title level={5}>
                  Award #{state.selectedAwardIdx + 1}
                </Typography.Title>
              </div>
              <SingleAwardsFrom
                initialValues={state.selectedAward}
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

export default AwardForm;

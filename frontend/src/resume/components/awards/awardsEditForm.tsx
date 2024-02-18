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
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";

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
  // selectedAwardIdx: number | null;
  selectedId: string | null;
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
    // selectedAwardIdx: awardList.length > 0 ? 0 : null,
    selectedId: awardList.length > 0 ? awardList[0].id : null,
  });


  const onSave = async (publication: Award) => {
    publication.date = Timestamp.fromDate(publication.date.toDate());
    // publicationList[state.selectedPublicationIdx!] = publication;
    let newAwardList = [...awardList];
    let idx = newAwardList.findIndex(
      (item) => item.id === publication.id
    );
    if (idx > -1) {
      newAwardList[idx] = publication;
    } else {
      newAwardList.push(publication);
    }

    await syncAwards(newAwardList);
    message.success("Awards saved!");
    // if (onFinish) {
    //   await onFinish(publicationList);
    // }
  };


  const addNew = () => {
    const newItem: Award = {
      id: ObjectID().toHexString(),
      title: "",
      date: Timestamp.fromDate(new Date()),
      description: "",
      organization: "",
    };
    setState((prev) => ({
      selectedAward: newItem,
      // selectedAwardIdx: awardList.length,
      selectedId: newItem.id,
    }));
  };

  const detailExtractor = (award: Award) => {
    return { title: award.title, subtitle: "" };
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

          {/* <Menu
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
          ></Menu> */}

          <SelectorSidebar
            items={awardList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Award[]) => {
              syncAwards(newOrder);
            }}
            addNew={addNew}
            entityTitle="Award"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState({
                selectedAward: awardList.filter((item) => item.id === key)[0],
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
          {/* {state.selectedAward && (
              <SingleAwardForm
                initialValues={state.selectedAward}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedAward != null  ? (
            <>
              {/* <div>
                <Typography.Title level={5}>
                  Award #{state.selectedAwardIdx + 1}
                </Typography.Title>
              </div> */}
              <SingleAwardsFrom
                key={state.selectedAward.id}
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

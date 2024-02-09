import React, { useEffect } from "react";
import { Award } from "../../../../types/resume";
import SingleAwardForm from "./editForm";
import { Button, Row, Space, Typography, Col, Menu, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { Timestamp } from "firebase/firestore";

const AwardCard = ({ award }: { award: Award }) => {
  let awardDateStr = moment(award.date.toDate()).format("MMM YYYY");
  return (
    <Row className="menu-card-details">
      <div className="title">{award.title}</div>
      <div className="subtitle">{awardDateStr}</div>
    </Row>
  );
};

const AwardMenu = ({
  selectedIdx,
  awardList,
  addNew,
  onChange,
}: {
  selectedIdx?: number | null;
  awardList: Award[];
  addNew: () => void;
  onChange: (idx: number) => void;
}) => {
  useEffect(() => {
    if (
      selectedIdx === null ||
      selectedIdx === undefined ||
      selectedIdx == state.selectedAwardIdx
    ) {
      return;
    }
    if (selectedIdx < awardList.length) {
      setState((prev) => ({
        ...prev,
        selectedAward: awardList[selectedIdx],
        selectedAwardIdx: selectedIdx,
      }));
    }
    if (selectedIdx == awardList.length) {
      setState((prev) => ({
        ...prev,
        selectedAward: null,
        selectedAwardIdx: null,
      }));
    }
  }, [selectedIdx, awardList]);
  type AwardState = {
    selectedAward: Award | null;
    selectedAwardIdx: number | null;
  };
  const [state, setState] = React.useState<AwardState>({
    selectedAward: null,
    selectedAwardIdx: null,
  });

  return (
    <div className="award-history-selector selector-col">
      {/* <Typography.Title level={5}>Award Items</Typography.Title> */}
      {/* <Typography.Text type="secondary">Your history</Typography.Text> */}

      {awardList.length == 0 ? (
        <Empty
          className="empty-content"
          description={
            <Typography.Text type="secondary">Nothing here</Typography.Text>
          }
        />
      ) : (
        <Menu
          className="award-menu menu-content"
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
            onChange(parseInt(item.key));
          }}
          selectedKeys={
            state.selectedAwardIdx != undefined
              ? [state.selectedAwardIdx.toString()]
              : undefined
          }
          items={awardList.map((edu, idx) => {
            return {
              key: idx.toString(),
              label: <AwardCard award={edu} />,
              //   label: edu.degree,
            };
          })}
        ></Menu>
      )}
      <Row justify="start" className="menu-action">
        <Button style={{  margin: "8px 24px" }} onClick={addNew}>
          <PlusOutlined /> Add Award
        </Button>
      </Row>
    </div>
  );
};

type AwardIteratorProps = {
  awardList: Award[];
  onFinish: () => void;
  syncAward: (awardList: Award[]) => Promise<void>;
};

type AwardIteratorState = {
  currentEditIdx: number | null;
  finished: boolean;
  loading: boolean;
};
const AwardIterator = ({
  awardList,
  onFinish,
  syncAward,
}: AwardIteratorProps) => {
  const [state, setState] = React.useState<AwardIteratorState>({
    currentEditIdx: awardList.length > 0 ? 0 : null,
    finished: false,
    loading: false,
  });

  const saveAward = async (award: Award) => {
    if (state.currentEditIdx === null) {
      return;
    }
    let newAwardList = [...awardList];
    // Add new case
    if (state.currentEditIdx === awardList.length) {
      newAwardList = [...awardList, award];
    }
    newAwardList = newAwardList.map((item, idx) => {
      if (idx === state.currentEditIdx) {
        return {
          ...award,
          date: Timestamp.fromDate(award.date.toDate()),
        };
      }
      return item;
    });
    setState((prev) => ({
      ...prev,
      loading: true,
    }));

    await syncAward(newAwardList);
    setState((prev) => ({
      ...prev,
      loading: false,
      finished: prev.currentEditIdx === awardList.length - 1,
      currentEditIdx: prev.currentEditIdx === null ? null : prev.currentEditIdx,
    }));
  };

  return (
    <Row style={{ width: "100%" }}>
      <Col span={4}>
        <AwardMenu
          selectedIdx={state.currentEditIdx}
          awardList={awardList}
          addNew={() => {
            setState((prev) => ({
              ...prev,
              currentEditIdx: awardList.length,
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
      <Col span={20}>
        {state.currentEditIdx != null ? (
          <div className="detail-form-body">
            <div className="cv-input">
              <Space direction="vertical" className="space">
                <Row>
                  <Col>
                    <Typography.Text strong>
                      {awardList[state.currentEditIdx]?.title || "New Award"}
                    </Typography.Text>
                  </Col>
                  {/* <Col style={{ marginLeft: "auto" }}>
                    <Typography.Text strong>
                      {state.currentEditIdx + 1} / {awardList.length}
                    </Typography.Text>
                  </Col> */}
                </Row>
                <SingleAwardForm
                  initialValues={awardList[state.currentEditIdx] || {}}
                  onFinish={saveAward}
                />
              </Space>
            </div>
          </div>
        ) : null}
      </Col>
    </Row>
  );
  // }
};

export default AwardIterator;

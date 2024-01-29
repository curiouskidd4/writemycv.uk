import React from "react";
import { Award, AwardList } from "../../../types/resume";
import { Button, Col, Menu, Row, Typography } from "antd";
import AwardIterator from "./components/iterator";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";

type AwardFlowProps = {
  awardList: Award[];
  onFinish: () => Promise<void>;
  syncAward: (awardList: Award[]) => Promise<void>;
};

type AwardFlowState = {
  selectedAwardItems: Award[] | null;
  currentEditIdx: number | null;
};

const AwardFlow = ({ awardList, onFinish, syncAward }: AwardFlowProps) => {
  const [state, setState] = React.useState<AwardFlowState>({
    selectedAwardItems: null,
    currentEditIdx: null,
  });

  awardList = awardList.map((item, idx) => {
    return {
      ...item,
      id: item.id || idx.toString(),
    };
  });

  return (
    <>
      <div className="detail-form-header">
        <Typography.Title level={4}>Award</Typography.Title>
      </div>
      <Row style={{ width: "100%" }}>
        <AwardIterator
          awardList={awardList}
          syncAward={syncAward}
          onFinish={onFinish}
        />
      </Row>
    </>
  );
};

export default AwardFlow;

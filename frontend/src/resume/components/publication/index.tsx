import React from "react";
import { Publication, PublicationList } from "../../../types/resume";
import { Button, Col, Menu, Row, Typography } from "antd";
import PublicationIterator from "./components/iterator";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";

type PublicationFlowProps = {
  publicationList: Publication[];
  onFinish: () => Promise<void>;
  syncPublication: (awardList: Publication[]) => Promise<void>;
};

type PublicationFlowState = {
  selectedPublicationItems: Publication[] | null;
  currentEditIdx: number | null;
};

const PublicationFlow = ({
  publicationList,
  onFinish,
  syncPublication,
}: PublicationFlowProps) => {
  const [state, setState] = React.useState<PublicationFlowState>({
    selectedPublicationItems: null,
    currentEditIdx: null,
  });

  publicationList = publicationList.map((item, idx) => {
    return {
      ...item,
      id: item.id || idx.toString(),
    };
  });

  return (
    <div className="resume-edit-detail">
      <div className="detail-form-header">
        <Typography.Title level={4}>Publication</Typography.Title>
      </div>
      <Row >
        <PublicationIterator
          publicationList={publicationList}
          syncPublication={syncPublication}
          onFinish={onFinish}
        />
      </Row>
    </div>
  );
};

export default PublicationFlow;

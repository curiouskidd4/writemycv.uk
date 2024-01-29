import React from "react";
import { Volunteering, VolunteeringList } from "../../../types/resume";
import { Button, Col, Menu, Row, Typography } from "antd";
import VolunteerIterator from "./components/iterator";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";

type VolunteerFlowProps = {
  volunteerList: Volunteering[];
  onFinish: () => Promise<void>;
  syncVolunteer: (volunteerList: Volunteering[]) => Promise<void>;
};

type VolunteerFlowState = {
  selectedVolunteerItems: Volunteering[] | null;
  currentEditIdx: number | null;
};

const VolunteerFlow = ({
  volunteerList,
  onFinish,
  syncVolunteer,
}: VolunteerFlowProps) => {
  const [state, setState] = React.useState<VolunteerFlowState>({
    selectedVolunteerItems: null,
    currentEditIdx: null,
  });

  volunteerList = volunteerList.map((item, idx) => {
    return {
      ...item,
      id: item.id || idx.toString(),
    };
  });

  return (
    <div className="resume-edit-detail">
      <div className="detail-form-header">
        <Typography.Title level={4}>Volunteer</Typography.Title>
      </div>
      <Row>
        <VolunteerIterator
          volunteerList={volunteerList}
          syncVolunteer={syncVolunteer}
          onFinish={onFinish}
        />
      </Row>
    </div>
  );
};

export default VolunteerFlow;

import React from "react";
import { Education } from "../../../types/resume";
import EducationSelector from "./components/selector";
import { Button, Col, Menu, Row, Typography } from "antd";
import EducationIterator from "./components/educationIterator";
import { PlusOutlined } from "@ant-design/icons";
import "./index.css";
import EducationForm from "./educationEditForm";

type EducationFlowProps = {
  editMode: boolean;
  educationList: Education[];
  onFinish: () => Promise<void>;
  syncEducation: (educationList: Education[]) => Promise<void>;
};

type EducationFlowState = {
  selectedEducationItems: Education[] | null;
  currentEditIdx: number | null;
};

const EducationFlow = ({
  editMode,
  educationList,
  onFinish,
  syncEducation,
}: EducationFlowProps) => {
  const [state, setState] = React.useState<EducationFlowState>({
    selectedEducationItems: null,
    currentEditIdx: null,
  });

  educationList = educationList.map((item, idx) => {
    return {
      ...item,
      id: item.id || idx.toString(),
    };
  });

  // if (editMode) {
  //   return (
  //     <>
  //       <Typography.Title level={4}>Education</Typography.Title>
  //       <div>Not implemented yet</div>
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <div className="detail-form-header">
  //         <Typography.Title level={4}>Education</Typography.Title>
  //       </div>
  //       <EducationSelector
  //         educationList={educationList}
  //         onSave={(educationList) => {
  //           setState((prev) => ({
  //             ...prev,
  //             selectedEducationItems: educationList,
  //           }));
  //         }}
  //       />
  //     </>
  //   );
  // // }

  // } else {
    return (
      <>
        {/* <EducationIterator
          educationList={educationList}
          syncEducation={syncEducation}
          onFinish={onFinish}
        /> */}
        <EducationForm educationList={educationList} syncEducation={syncEducation} showTitle={false} />
      </>
    );
  // }
  // }
};

export default EducationFlow;

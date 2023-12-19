import React from "react";
import { Education } from "../../../types/resume";
import EducationSelector from "./components/selector";
import { Typography } from "antd";
import EducationIterator from "./components/educationIterator";

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

  if (editMode) {
    return (
      <>
        <Typography.Title level={4}>Education</Typography.Title>
        <div>Not implemented yet</div>
      </>
    );
  } else {
    if (state.selectedEducationItems == null) {
      // Means show the selector
      return (
        <>
          {" "}
          <div className="detail-form-header">
            <Typography.Title level={4}>Education</Typography.Title>
          </div>
          <EducationSelector
            educationList={educationList}
            onSave={(educationList) => {
              setState((prev) => ({
                ...prev,
                selectedEducationItems: educationList,
              }));
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <div className="detail-form-header">
            <Typography.Title level={4}>Education</Typography.Title>
          </div>

          <EducationIterator
            educationList={educationList}
            syncEducation={syncEducation}
            onFinish={onFinish}
          />
        </>
      );
    }
  }
};

export default EducationFlow;

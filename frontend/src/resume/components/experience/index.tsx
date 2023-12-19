import React from "react";
import { Experience } from "../../../types/resume";
import ExperienceSelector from "./components/selector";
import { Typography } from "antd";
import ExperienceIterator from "./components/experienceIterator";

type ExperienceFlowProps = {
  editMode: boolean;
  experienceList: Experience[];
  onFinish: () => void;
  syncExperience: (experienceList: Experience[]) => Promise<void>;
};

type ExperienceFlowState = {
  selectedExperienceItems: Experience[] | null;
  currentEditIdx: number | null;
};

const ExperienceFlow = ({
  editMode,
  experienceList,
  onFinish,

  syncExperience,
}: ExperienceFlowProps) => {
  const [state, setState] = React.useState<ExperienceFlowState>({
    selectedExperienceItems: null,
    currentEditIdx: null,
  });

  experienceList = experienceList.map((item, idx) => {
    return {
      ...item,
      id: item.id || idx.toString(),
    };
  });

  if (editMode) {
    return (
      <>
        <Typography.Title level={4}>Experience</Typography.Title>
        <div>Not implemented yet</div>
      </>
    );
  } else {
    if (state.selectedExperienceItems == null) {
      // Means show the selector
      return (
        <>
          {" "}
          <div className="detail-form-header">
            <Typography.Title level={4}>Experience</Typography.Title>
          </div>
          <ExperienceSelector
            experienceList={experienceList}
            onSave={(educationList) => {
              setState((prev) => ({
                ...prev,
                selectedExperienceItems: educationList,
              }));
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <div className="detail-form-header">
            <Typography.Title level={4}>Experience</Typography.Title>
          </div>
          <ExperienceIterator
            experienceList={experienceList}
            onFinish={onFinish}
            syncExperience={syncExperience}
          />
        </>
      );
    }
  }
};

export default ExperienceFlow;

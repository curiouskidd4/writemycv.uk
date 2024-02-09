import React from "react";
import { Experience } from "../../../types/resume";
import ExperienceSelector from "./components/selector";
import { Typography } from "antd";
import ExperienceIterator from "./components/experienceIterator";
import ExperienceForm from "./experienceEditForm";

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


    // if (state.selectedExperienceItems == null) {
    //   // Means show the selector
    //   return (
    //     <div>
    //       {" "}
          
    //       <ExperienceSelector
    //         experienceList={experienceList}
    //         onSave={(educationList) => {
    //           setState((prev) => ({
    //             ...prev,
    //             selectedExperienceItems: educationList,
    //           }));
    //         }}
    //       />
    //     </div>
    //   );
    // } else {
      return (
        <>
          
          {/* <ExperienceIterator
            experienceList={experienceList}
            onFinish={onFinish}
            syncExperience={syncExperience}
          />
           */}
           <ExperienceForm
            experienceList={experienceList}
            syncExperience={syncExperience}
            // onFinish={onFinish}
            showTitle={false}
          />
        </>
      );
    // }
  
};

export default ExperienceFlow;

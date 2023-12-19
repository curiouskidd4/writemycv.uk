import React, { useState } from "react";
import SaveButton from "./saveButton";
import CVGoals from "./cvGoals";
import { Education, Experience, PersonalInfo, Resume, Skill } from "../../types/resume";
import PersonalDetails from "./personalDetails";
import EducationForm from "./education";
import EducationFlow from "./education";
import ExperienceFlow from "./experience";
import SkillFlow from "./skills";
import ProfessionalSummaryFlow from "./professionalSummary";
import FinishView from "./finish";
import { useResume } from "../../contexts/resume";

type NavigationProps = {
  current: number| null;
  setCurrent: (current: number ) => void;
  resume: Resume;
  editMode: boolean;
};

type NavigationState = {
  // current: number| null;
  isFinished: boolean;
};

type ResumeDetails = {
  name: string;
  targetRole: string| null;
  jobDescription: string | null;
};

const Navigation = ({ current, setCurrent, resume, editMode }: NavigationProps) => {
  const [state, setState] = useState<NavigationState>({
    isFinished: false,
  });


  const resumeContext = useResume();

  const syncResumeDetails = async (resume: Resume) => {
    await resumeContext.saveResumeDetails(resume);
  }
  const syncEducation = async (educationList: Education[]) => {
    await resumeContext.saveEducation(educationList);
  }



  const syncPersonalInfo = async (personalInfo: PersonalInfo) => {
    await resumeContext.savePersonalInfo(personalInfo);
  }

  const syncExperience = async (experienceList: Experience[]) => {
    await resumeContext.saveExperience(experienceList);
  }

  const syncSkills = async (skillList: Skill[]) => {
    await resumeContext.saveSkills(skillList);
  }
  const syncProfessionalSummary = async (professionalSummary: string) => {
    await resumeContext.saveProfessionalSummary(professionalSummary);
  }

  if (current === 0) {
    return (
      <>
        <CVGoals
          initialValues={{
            name: resume.name,
            targetRole: resume.targetRole,
            jobDescription: resume.jobDescription,
          }}
          onFinish={async (values) => {
            setCurrent(1);
          }}
          syncResumeDetails={syncResumeDetails}
        />
        {/* <SaveButton
          onDone={() => setCurrent(1)}
          nextDisabled={false}
          showPressEnter={true}
        /> */}
      </>
    );
  } else if (current === 1) {
    return (
      <PersonalDetails
        initialValues={resume.personalInfo}
        onFinish={async () => {
          setCurrent(2);
        }}
        syncPersonalInfo={syncPersonalInfo}
      />
    );
  } else if (current === 2) {
    return (
      <EducationFlow
        syncEducation={syncEducation}
        educationList={resume.educationList}
        editMode={false}
        onFinish={async () => {
          setCurrent(3);
        }}
      />
    );
  } else if (current == 3) {
    return (
      <ExperienceFlow
        experienceList={resume.experienceList}
        editMode={false}
        onFinish={async () => {
          setCurrent(4);
        }}
        syncExperience={syncExperience}
      />
    );
  }else if (current == 4) {
    return (
      <SkillFlow
        skillList={resume.skillList}
        onFinish={async () => {
          setCurrent(5);
        }}
        syncSkills={syncSkills}
      />
    );
  }else if (current == 5) {
    return (
      <ProfessionalSummaryFlow
        professionalSummary={resume.professionalSummary || ""}
        syncProfessionalSummary={syncProfessionalSummary}
        onFinish={async () => {
          setCurrent(6);
          setState((prev) => ({
            ...prev,
            isFinished: true,
            current: null,
          }));
        }}
      />
    );
  }
  else if (state.isFinished) {
    return (
      <FinishView
        // onFinish={() => {
          
        // }}
      />
    );
  } else {
    return <div>Page not found</div>;
  }
};

export default Navigation;

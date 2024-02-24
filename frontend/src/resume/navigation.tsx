import React, { useState } from "react";
import CVGoals from "./components/cvGoals";
import {
  Award,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Publication,
  Resume,
  Skill,
  Volunteering,
} from "../types/resume";
import PersonalDetails from "./components/personalDetails";
import EducationFlow from "./components/education";
import ExperienceFlow from "./components/experience";
import SkillFlow from "./components/skills";
import ProfessionalSummaryFlow from "./components/professionalSummary";
import FinishView from "./components/finish";
import { useResume } from "../contexts/resume";
import AwardFlow from "./components/awards";
import PublicationFlow from "./components/publication";
import VolunteerFlow from "./components/volunteering";
import LanguageFlow from "./components/languages";
import { message } from "antd";
import Adjustment from "./components/adjustment";
import AwardForm from "./components/awards/awardsEditForm";
import PublicationForm from "./components/publication/publicationEditForm";
import VolunteerForm from "./components/volunteering/volunteerEditForm";
import CandidateDetails from "./components/candidateSummary";
import OtherInformation from "./components/otherDetails";

type NavigationProps = {
  current: number | null;
  setCurrent: (current: number) => void;
  resume: Resume;
  editMode: boolean;
};

type NavigationState = {
  // current: number| null;
  isFinished: boolean;
};

type ResumeDetails = {
  name: string;
  targetRole: string | null;
  jobDescription: string | null;
};

const Navigation = ({
  current,
  setCurrent,
  resume,
  editMode,
}: NavigationProps) => {
  const [state, setState] = useState<NavigationState>({
    isFinished: false,
  });

  const resumeContext = useResume();

  const syncResumeDetails = async (resume: Resume) => {
    await resumeContext.saveResumeDetails(resume);
    // message.success("Resume details saved!");
  };
  const syncEducation = async (educationList: Education[]) => {
    await resumeContext.saveEducation(educationList);
    // message.success("Education saved!");
  };

  const syncPersonalInfo = async (personalInfo: PersonalInfo) => {
    await resumeContext.savePersonalInfo(personalInfo);
    // message.success("Progress Saved!");
  };

  const syncExperience = async (experienceList: Experience[]) => {
    await resumeContext.saveExperience(experienceList);
    // message.success("Progress Saved!");
  };

  const syncSkills = async (skillList: Skill[]) => {
    await resumeContext.saveSkills(skillList);
    // message.success("Progress Saved!");
  };
  const syncProfessionalSummary = async (professionalSummary: string) => {
    await resumeContext.saveProfessionalSummary(professionalSummary);
    // message.success("Progress Saved!");
  };

  const syncAwards = async (awardList: Award[]) => {
    await resumeContext.saveAwards(awardList);
    // message.success("Progress Saved!");
  };

  const syncPublications = async (publicationList: Publication[]) => {
    await resumeContext.savePublication(publicationList);
    // message.success("Progress Saved!");
  };

  const syncVolunteering = async (volunteeringList: Volunteering[]) => {
    await resumeContext.saveVolunteering(volunteeringList);
    // message.success("Progress Saved!");
  };

  const syncLanguages = async (languageList: Language[]) => {
    await resumeContext.saveLanguages(languageList);
    // message.success("Progress Saved!");
  };

  console.log("resume", resume);
  if (current === 0) {
    return (
      <>
        <CVGoals
          initialValues={{
            name: resume.name,
            targetRole: resume.targetRole || resume.role,
            jobDescription: resume.jobDescription,
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
      // <PersonalDetails
      //   initialValues={resume.personalInfo}
      //   syncPersonalInfo={syncPersonalInfo}
      // />
      <CandidateDetails
        initialValues={resume.personalInfo}
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
  } else if (current == 4) {
    return (
      <SkillFlow
        skillList={resume.skillList}
        onFinish={async () => {
          setCurrent(5);
        }}
        syncSkills={syncSkills}
      />
    );
  } else if (current == 5) {
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

          await resumeContext.markResumeComplete();
        }}
      />
    );
  }else if (current == 6) {
    return (
      <OtherInformation 
      otherInformationList={[] }
      syncOtherInformation={async (items: any) => {
        console.log("Syncing other information", items);
      }}
      showTitle={false}
            
        
      />
    );
  } else if (current == 7) {
    return (
      // <AwardFlow
      //   awardList={resume.awardList || []}
      //   onFinish={async () => {
      //     setCurrent(7);
      //   }}
      //   syncAward={syncAwards}
      // />

      <AwardForm
        awardList={resume.awardList || []}
        syncAwards={syncAwards}
        // onFinish={onFinish}
        showTitle={false}
      />
    );
  } else if (current == 8) {
    return (
      <PublicationForm
      showTitle={false}
        publicationList={resume.publicationList || []}
        // onFinish={async () => {
        //   setCurrent(6);
        // }}
        syncPublications={syncPublications}
      />
    );
  } else if (current == 9) {
    return (
      <VolunteerForm
        showTitle={false}
        volunteerList={resume.volunteeringList || []}
        onFinish={async () => {
          setCurrent(9);
        }}
        syncVolunteers={syncVolunteering}
      />
    );
  } else if (current == 10) {
    return (
      <LanguageFlow
        languageList={resume.languageList || []}
        onFinish={async () => {
          setCurrent(9);
        }}
        syncLanguages={syncLanguages}
      />
    );
  } else if (current == 11) {
    return (
      <Adjustment
      // onFinish={() => {

      // }}
      />
    );
  } else if (state.isFinished) {
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

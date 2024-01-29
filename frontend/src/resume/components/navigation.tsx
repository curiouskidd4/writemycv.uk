import React, { useState } from "react";
import SaveButton from "./saveButton";
import CVGoals from "./cvGoals";
import { Award, Education, Experience, Language, PersonalInfo, Publication, Resume, Skill, Volunteering } from "../../types/resume";
import PersonalDetails from "./personalDetails";
import EducationForm from "./education";
import EducationFlow from "./education";
import ExperienceFlow from "./experience";
import SkillFlow from "./skills";
import ProfessionalSummaryFlow from "./professionalSummary";
import FinishView from "./finish";
import { useResume } from "../../contexts/resume";
import AwardFlow from "./awards";
import PublicationFlow from "./publication";
import VolunteerFlow from "./volunteering";
import LanguageFlow from "./languages";
import { message } from "antd";

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
    message.success("Resume details saved!");
  }
  const syncEducation = async (educationList: Education[]) => {
    await resumeContext.saveEducation(educationList);
    message.success("Education saved!");
  }



  const syncPersonalInfo = async (personalInfo: PersonalInfo) => {
    await resumeContext.savePersonalInfo(personalInfo);
    message.success("Progress Saved!");
  }

  const syncExperience = async (experienceList: Experience[]) => {
    await resumeContext.saveExperience(experienceList);
    message.success("Progress Saved!");

  }

  const syncSkills = async (skillList: Skill[]) => {
    await resumeContext.saveSkills(skillList);
    message.success("Progress Saved!");

  }
  const syncProfessionalSummary = async (professionalSummary: string) => {
    await resumeContext.saveProfessionalSummary(professionalSummary);
    message.success("Progress Saved!");

  }

  const syncAwards = async (awardList: Award[]) => {
    await resumeContext.saveAwards(awardList);
    message.success("Progress Saved!");

  }

  const syncPublications = async (publicationList: Publication[]) => {
    await resumeContext.savePublication(publicationList);
    message.success("Progress Saved!");

  }

  const syncVolunteering = async (volunteeringList: Volunteering[]) => {
    await resumeContext.saveVolunteering(volunteeringList);
    message.success("Progress Saved!");

  }

  const syncLanguages = async (languageList: Language[]) => {
    await resumeContext.saveLanguages(languageList);
    message.success("Progress Saved!");

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

          await resumeContext.markResumeComplete();
        }}
      />
    );
  }
  else if (current == 6) {
    return (
      <AwardFlow
        awardList={resume.awardList || []}
        onFinish={async () => {
          setCurrent(7);
        }}
        syncAward={syncAwards}
      />
    );
  }
  else if (current == 7) {
    return (
      <PublicationFlow
        publicationList={resume.publicationList || []}
        onFinish={async () => {
          setCurrent(6);
          
        }}
        syncPublication={syncPublications}
      />
    );
  }
  else if (current == 8) {
    return (
      <VolunteerFlow
        volunteerList={resume.volunteeringList || []}
        onFinish={async () => {
          setCurrent(9);
        }}
        syncVolunteer={syncVolunteering}

      />
    );
  }
  else if (current == 9) {
    return (
      <LanguageFlow
        languageList={resume.languageList || []}
        onFinish={async () => {
          setCurrent(9);
        }}
        syncLanguages={syncLanguages}

      />
    );
  }
  else if (current == 10) {
    return (
      <FinishView
        // onFinish={() => {
          
        // }}
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

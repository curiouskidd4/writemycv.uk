import Typography from "antd/es/typography/Typography";
import React, { useState } from "react";
import PersonalInfoForm from "./forms/personalInfo";
import ProfessionalSummary from "./forms/summary";
import ExperienceSection from "./forms/experience";
import { Card } from "antd";
import "./index.css";
import EducationSection from "./forms/detail";
import SkillSection from "./forms/skills";
const Profile = () => {
  const [state, setState] = useState({ error: "" });

  return (
    <>
      <Typography.Title level={2}>Your Profile</Typography.Title>

      {/* <Card> */}
        <PersonalInfoForm />
      {/* </Card> */}
      {/* <Card> */}
        <ProfessionalSummary />
      {/* </Card> */}
      {/* <Card> */}
        <EducationSection />
      {/* </Card> */}

      {/* <Card> */}
        <ExperienceSection />
      {/* </Card> */}

      {/* <Card> */}
        <SkillSection />
      {/* </Card> */}
    </>
  );
};

export default Profile;

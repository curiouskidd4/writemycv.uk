import Typography from "antd/es/typography/Typography";
import React, { useState } from "react";
import { PersonalInfoSection } from "./forms/personalInfo";
import { ProfessionalSummary } from "./forms/summary";
import { ExperienceSection } from "./forms/experience";
import { Card } from "antd";
import "./index.css";
import { EducationSection } from "./forms/education";
import { SkillSection } from "./forms/skills";
import { OpenAIContext } from "../../customContext";
import { useAuth } from "../../authContext";
import { useDoc } from "../../firestoreHooks";

const Profile = () => {

  const auth = useAuth();
  let personalInfo = useDoc("personalInfo", auth.user.uid);

  return (
    <div>
      <OpenAIContext.Provider value={{
        role: personalInfo.data?.currentRole,
      }}>
        <Typography.Title level={2}>Your Profile</Typography.Title>

        <Card>
          <PersonalInfoSection />
        </Card>
        <Card>
          <ProfessionalSummary />
        </Card>
        <Card>
          <EducationSection />
        </Card>

        <Card>
          <ExperienceSection />
        </Card>

        <Card>
          <SkillSection />
        </Card>
      </OpenAIContext.Provider>
    </div>
  );
};

export default Profile;

import Typography from "antd/es/typography/Typography";
import React, { useState } from "react";
import { PersonalInfoSection } from "./forms/personalInfo";
import { ProfessionalSummary } from "./forms/summary";
import { ExperienceSection } from "./forms/experience";
import { Button, Card, Row } from "antd";
import "./index.css";
import { EducationSection } from "./forms/education";
import { SkillSection } from "./forms/skills";
import { OpenAIContext } from "../../customContext";
import { useAuth } from "../../authContext";
import { useDoc } from "../../firestoreHooks";
import { NewResumeModal } from "../resume/newResumeModal";
import { PlusOutlined } from "@ant-design/icons";
const Profile = () => {
  const [state, setState] = useState({
    newResumeFlag: false,
  });
  const createNewResume = () => {
    setState((prev) => ({ ...prev, newResumeFlag: true }));
  };
  const auth = useAuth();
  let personalInfo = useDoc("personalInfo", auth.user.uid);

  return (
    <div>
      <OpenAIContext.Provider
        value={{
          role: personalInfo.data?.currentRole,
        }}
      >
        <NewResumeModal
          userId={auth.user.uid}
          visible={state.newResumeFlag}
          onCancel={() =>
            setState((prev) => ({ ...prev, newResumeFlag: false }))
          }
          onConfirm={() =>
            setState((prev) => ({ ...prev, newResumeFlag: false }))
          }
        />
        <Row align="middle">
          <Typography.Title level={2}>Your Profile</Typography.Title>

          <Button
            style={{ marginLeft: "auto" }}
            icon={<PlusOutlined />}
            onClick={createNewResume}
          >
            New Resume
          </Button>
        </Row>

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
        <Row align="middle">
          <Button

            type="primary"
            style={{ marginLeft: "auto", width: "100%" , marginTop: "20px"}}
            icon={<PlusOutlined />}
            onClick={createNewResume}
          >
            Create New Resume
          </Button>
        </Row>
      </OpenAIContext.Provider>
    </div>
  );
};

export default Profile;

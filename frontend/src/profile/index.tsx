import { Button, Col, Dropdown, Row, Tabs, Typography } from "antd";
import React from "react";
import PersonalDetails from "../resume/components/personalDetails";
import { ProfileProvider, useProfile } from "../contexts/profile";
import SkillFlow from "../resume/components/skills";
import { ProfilePersonalInfo } from "../types/profile";
import {
  Award,
  Education,
  Experience,
  Language,
  Publication,
  Skill,
  Volunteering,
} from "../types/resume";
import EducationForm from "../resume/components/education/educationEditForm";
import ExperienceFlow from "../resume/components/experience";
import ExperienceForm from "../resume/components/experience/experienceEditForm";
import {
  DeleteOutlined,
  ImportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  AwardIcon,
  EditIcon,
  EducationIcon,
  ExperienceIcon,
  HelpIcon,
  LanguageIcon,
  NewsPaperIcon,
  PersonalInfoIcon,
  PlusIcon,
  SkillsIcon,
  UploadIcon,
} from "../components/faIcons";
import "./index.css";
import { NewResumeModal } from "../pages/allResume/newResumeModal";
import { ImportResumeModal } from "./import";
import { useAuth } from "../authContext";
import LanguageFlow from "../resume/components/languages";
import AwardForm from "../resume/components/awards/awardsEditForm";
import VolunteerForm from "../resume/components/volunteering/volunteerEditForm";
import PublicationForm from "../resume/components/publication/publicationEditForm";

const ProfileV2_ = () => {
  const auth = useAuth();
  const [newResumeModalVisible, setNewResumeModalVisible] =
    React.useState<boolean>(false);
  const [importResumeModalVisible, setImportResumeModalVisible] =
    React.useState<boolean>(false);
  const navigate = useNavigate();
  const profileData = useProfile();
  const syncPersonalInfo = async (values: ProfilePersonalInfo) => {
    await profileData.savePersonalInfo(values);
  };

  const syncSkills = async (skills: Skill[]) => {
    await profileData.saveSkills(skills);
  };

  const syncEducation = async (educationList: Education[]) => {
    await profileData.saveEducation(educationList);
  };

  const syncExperience = async (experienceList: Experience[]) => {
    await profileData.saveExperience(experienceList);
  };

  const syncAwards = async (awards: Award[]) => {
    await profileData.saveAwards(awards);
  };

  const syncPublications = async (publications: Publication[]) => {
    await profileData.savePublications(publications);
  };

  const syncVolunteering = async (volunteering: Volunteering[]) => {
    await profileData.saveVolunteering(volunteering);
  };

  const syncLanguages = async (languages: Language[]) => {
    await profileData.saveLanguages(languages);
  };

  const basicDetailsCompleted = profileData.isBasicInfoComplete();
  const profilePersonalInfo = profileData.profile?.personalInfo;
  const personalInfo: ProfilePersonalInfo = {
    firstName:
      profilePersonalInfo?.firstName ||
      auth.user.displayName?.split(" ")[0] ||
      "",
    lastName:
      profilePersonalInfo?.lastName ||
      auth.user.displayName?.split(" ")[1] ||
      "",
    email: profilePersonalInfo?.email || auth.user.email || "",
    phone: profilePersonalInfo?.phone || null,
    location: profilePersonalInfo?.location || "",
    linkedin: profilePersonalInfo?.linkedin || "",
    city: profilePersonalInfo?.city || "",
    country: profilePersonalInfo?.country || "",
    currentRole: profilePersonalInfo?.currentRole || "",
  };

  return (
    <div className="profile">
      <Row align="middle" className="title-header">
        <Col>
          <Typography.Title
            level={3}
            style={{
              marginBottom: "0px",
            }}
          >
            Career Repository
          </Typography.Title>
        </Col>
        <Col
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Button
            onClick={() => {
              setNewResumeModalVisible(true);
            }}
          >
            <PlusIcon color="var(--black)" />
            New CV
          </Button>

          <Button
            onClick={() => {
              setImportResumeModalVisible(true);
            }}
          >
            <UploadIcon color="var(--black)" />
            Import CV
          </Button>
        </Col>
      </Row>
      {profileData.loading ? <div>Loading...</div> : null}
      {!profileData.loading ? (
        <div className="profile-tab">
          <Tabs defaultActiveKey="1" tabPosition="left">
            <Tabs.TabPane
              tab={
                <>
                  <PersonalInfoIcon />
                  Personal Details
                </>
              }
              key="1"
            >
              <div>
                {!basicDetailsCompleted ? (
                  <div style={{
                    paddingLeft: "32px",
                    paddingTop: "16px",
                  }}>
                    <Typography.Text type="secondary">
                    <i className="fa-solid fa-triangle-exclamation" style={{"color": "#FFD43B"}}></i> Please complete your following details before proceeding
                    </Typography.Text>
                  </div>
                ) : null}
                <PersonalDetails
                  initialValues={personalInfo}
                  onFinish={async (values) => {}}
                  syncPersonalInfo={syncPersonalInfo}
                  showTitle={false}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <EducationIcon />
                  Education
                </>
              }
              key="3"
              disabled={!basicDetailsCompleted}
            >
              <EducationForm
                educationList={
                  profileData.profile?.education?.educationList || []
                }
                // onFinish={async () => {}}
                showTitle={false}
                syncEducation={syncEducation}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <ExperienceIcon />
                  Experience
                </>
              }
              key="4"
              disabled={!basicDetailsCompleted}
            >
              <ExperienceForm
                experienceList={
                  profileData.profile?.experience?.experienceList || []
                }
                // onFinish={async () => {}}
                syncExperience={syncExperience}
                showTitle={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <SkillsIcon />
                  Skills
                </>
              }
              key="5"
              disabled={!basicDetailsCompleted}
            >
              <SkillFlow
                skillList={profileData.profile?.skills?.skillList || []}
                onFinish={async () => {}}
                syncSkills={syncSkills}
                showTitle={true}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <AwardIcon />
                  Awards
                </>
              }
              key="6"
              disabled={!basicDetailsCompleted}
            >
              <AwardForm
                awardList={profileData.profile?.awards?.awardList || []}
                onFinish={async () => {}}
                syncAwards={syncAwards}
                showTitle={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <NewsPaperIcon />
                  Publications
                </>
              }
              key="7"
              disabled={!basicDetailsCompleted}
            >
              <PublicationForm
                publicationList={
                  profileData.profile?.publications?.publicationList || []
                }
                onFinish={async () => {}}
                syncPublications={syncPublications}
                showTitle={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <HelpIcon />
                  Volunteering
                </>
              }
              key="8"
              disabled={!basicDetailsCompleted}
            >
              <VolunteerForm
                volunteerList={
                  profileData.profile?.volunteering?.volunteeringList || []
                }
                onFinish={async () => {}}
                syncVolunteers={syncVolunteering}
                showTitle={false}
              />
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <>
                  <LanguageIcon />
                  Languages
                </>
              }
              key="9"
              disabled={!basicDetailsCompleted}
            >
              <LanguageFlow
                languageList={
                  profileData.profile?.languages?.languageList || []
                }
                // languageList={[]} // TODO: FIX THIS
                onFinish={async () => {}}
                syncLanguages={syncLanguages}
                showTitle={false}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      ) : null}

      <NewResumeModal
        visible={newResumeModalVisible}
        onCancel={() => {
          setNewResumeModalVisible(false);
        }}
        onConfirm={async () => {
          setNewResumeModalVisible(false);
        }}
      />
      <ImportResumeModal
        visible={importResumeModalVisible}
        onCancel={() => {
          setImportResumeModalVisible(false);
        }}
        onConfirm={async () => {
          setImportResumeModalVisible(false);
        }}
      />
    </div>
  );
};

const ProfileV2 = () => {
  return (
    <ProfileProvider>
      <ProfileV2_ />
    </ProfileProvider>
  );
};

export default ProfileV2;

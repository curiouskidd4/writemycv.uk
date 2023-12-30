import { Col, Dropdown, Row, Tabs, Typography } from "antd";
import React from "react";
import PersonalDetails from "../resume/components/personalDetails";
import { ProfileProvider, useProfile } from "../contexts/profile";
import SkillFlow from "../resume/components/skills";
import { ProfilePersonalInfo } from "../types/profile";
import { Education, Experience, Skill } from "../types/resume";
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
  EditIcon,
  EducationIcon,
  ExperienceIcon,
  PersonalInfoIcon,
  PlusIcon,
  SkillsIcon,
  UploadIcon,
} from "../components/faIcons";
import "./index.css";
import { NewResumeModal } from "../pages/resume/newResumeModal";
import { ImportResumeModal } from "./import";

const ProfileV2_ = () => {
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
  return (
    <div className="profile">
      <Row style={{ height: "64px" }} align="middle">
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
          }}
        >
          <Dropdown.Button
            trigger={["click"]}
            // type="primary"
            menu={{
              items: [
                {
                  key: "2",
                  label: "Import Resume",
                  icon: <UploadIcon />,
                },
              ],
              onClick: (item: any) => {
                // console.log(item);
                if (item.key === "2") {
                  setImportResumeModalVisible(true);
                }
              },
            }}
            onClick={() => {
              setNewResumeModalVisible(true);
            }}
            // icon={<i className="fas fa-download"></i>}
          >
            <PlusIcon />
            New CV
          </Dropdown.Button>
        </Col>
      </Row>
      {profileData.loading ? <div>Loading...</div> : null}
      {!profileData.loading ? (
        <div>
          <Tabs defaultActiveKey="1">
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
                <PersonalDetails
                  initialValues={profileData.profile?.personalInfo}
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
            >
              <EducationForm
                educationList={
                  profileData.profile?.education?.educationList || []
                }
                onFinish={async () => {}}
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
            >
              <ExperienceForm
                experienceList={
                  profileData.profile?.experience?.experienceList || []
                }
                onFinish={async () => {}}
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
            >
              <SkillFlow
                skillList={profileData.profile?.skills?.skillList || []}
                onFinish={async () => {}}
                syncSkills={syncSkills}
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

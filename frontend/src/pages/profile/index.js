import Typography from "antd/es/typography/Typography";
import React, { useState } from "react";
import { PersonalInfoSection } from "./forms/personalInfo";
import { ProfessionalSummary } from "./forms/summary";
import { ExperienceSection } from "./forms/experience";
import { Button, Card, Modal, Row, Space, Upload } from "antd";
import "./index.css";
import { EducationSection } from "./forms/education";
import { SkillSection } from "./forms/skills";
import { OpenAIContext } from "../../customContext";
import { useAuth } from "../../authContext";
import { useDoc } from "../../firestoreHooks";
import { NewResumeModal } from "../resume/newResumeModal";
import { PlusOutlined } from "@ant-design/icons";
import { useOpenAI } from "../../utils";
import { MagicWandLoading } from "../../components/faIcons";

const ImportResumeModal = ({ visible, onCancel, onConfirm }) => {
  const [state, setState] = useState({
    file: null,
    error: "",
  });
  const openai = useOpenAI();

  const { user } = useAuth();
  const handleFileChange = (e) => {
    const file = e.file;

    if (!file) {
      setState((prev) => ({ ...prev, error: "Please select a file" }));
    } else {
      setState((prev) => ({ ...prev, file, error: "" }));
      handleConfirm(file);
    }
  };

  const handleConfirm = async (file) => {
    let formData = new FormData();
    formData.append("file", file);
    await openai.parseResume(formData);
    setState((prev) => ({ ...prev, file: null }));
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title="Import Resume"
      footer={null}
    >
      <Typography.Text>
        Import your resume from LinkedIn or other sources (upload)
      </Typography.Text>

      <Upload.Dragger
        onChange={handleFileChange}
        accept="application/pdf,.docx,.doc"
        disabled={state.file}
        beforeUpload={(file) => {
          // setState((prev) => ({ ...prev, file, error: "" }));
          return false;
        }}
        action={null}
      >
        <p className="ant-upload-drag-icon">
          <PlusOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Upload.Dragger>
      {
        <Typography.Text type="danger" style={{ marginTop: "20px" }}>
          {state.error}
        </Typography.Text>
      }

      {openai.loading && (
        <Row
          style={{ width: "100%", height: "50vh" }}
          align="middle"
          justify="center"
        >
          <MagicWandLoading />
        </Row>
      )}
      {openai.data && (
        <Row style={{ width: "100%" }} align="middle" justify="center">
          <Typography.Text>
            We have successfully imported your resume. Please reload the page to
            see the changes
          </Typography.Text>
          {/* <Space>
              <Button
                type="primary"
                onClick={() => {
                  onConfirm(openai.data);
                }}
              >
                Create New
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Space> */}
        </Row>
      )}
    </Modal>
  );
};
const Profile = () => {
  const [state, setState] = useState({
    newResumeFlag: false,
    importResumeFlag: false,
  });
  const createNewResume = () => {
    setState((prev) => ({ ...prev, newResumeFlag: true }));
  };
  const auth = useAuth();
  let personalInfo = useDoc("personalInfo", auth.user.uid);

  const toggleImportResume = () => {
    setState((prev) => ({ ...prev, importResumeFlag: !prev.importResumeFlag }));
  };
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
        <Row align="middle" justify="space-between">
          <Typography.Title level={2}>Your Profile</Typography.Title>

          <Space>
            <Button
              style={{ marginLeft: "auto" }}
              icon={<PlusOutlined />}
              onClick={createNewResume}
            >
              New Resume
            </Button>
            <Button onClick={toggleImportResume}>Import Resume</Button>
          </Space>
        </Row>
        <ImportResumeModal
          visible={state.importResumeFlag}
          onCancel={toggleImportResume}
        />

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
            style={{ marginLeft: "auto", width: "100%", marginTop: "20px" }}
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

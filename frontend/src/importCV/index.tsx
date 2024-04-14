import {
  Button,
  Divider,
  Modal,
  Progress,
  Row,
  Spin,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { InboxOutlined } from "@ant-design/icons";
import { useProfile } from "../contexts/profile";
import { useOpenAI } from "../utils";
import CVWizardBadge from "../components/cvWizardBadge";
import "./index.css";

const ImportCVToProfile = () => {
  const [howItWorks, setHowItWorks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const auth = useAuth();
  type StateType = {
    isComplete: boolean;
    file: any | null;
    importSuccess: boolean;
    importError: boolean;
  };
  const [state, setState] = useState<StateType>({
    isComplete: false,
    file: null,
    importSuccess: false,
    importError: false,
  });

  const openai = useOpenAI();

  const handleFileChange = (e: any) => {
    const file = e.file;
    if (!file) {
      setState((prev) => ({ ...prev, error: "Please select a file" }));
    } else {
      setState((prev) => ({ ...prev, file, error: "" }));
      handleConfirm(file);
    }
  };

  const handleConfirm = async (file: any) => {
    try {
      let formData = new FormData();
      formData.append("file", file);
      await openai.parseResume(formData);
      await overrideFlag({});
      setState((prev) => ({ ...prev, file: null, importSuccess: true }));
    } catch (e) {
      setState((prev) => ({ ...prev, file: null, importError: true }));
    }
  };

  const overrideFlag = async ({ reload = false }: { reload?: boolean }) => {
    await auth.overrideCVImport();
    if (reload) {
      //   window.location.reload();
      window.location.href = "/repository";
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      // setState((prev) => ({ ...prev, file, error: "" }));
      return false;
    },
    // action: (file) => {
    //   console.log(file);
    //   return Promise.resolve("ok");
    // },
    onChange: handleFileChange,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      <div className="title-header">Create your Career Repository</div>
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        <Row>
          <Typography.Title level={3}>
            Hello {auth.user.displayName.split(" ")[0]}!
          </Typography.Title>
        </Row>
        <Row>
          <Typography.Text>Welcome to Write My CV</Typography.Text>
        </Row>

        <Modal
          visible={showModal}
          footer={null}
          closable={true}
          width={state.file ? "650px" : "950px"}
          onCancel={() => {
            setShowModal(false);
            setState((prev) => ({
              ...prev,
              file: null,
              importSuccess: false,
              importError: false,
            }));
          }}
        >
          <div className="import-cv-modal modal-body">
            {!state.file && !state.importSuccess && !state.importError && (
              <>
                <CVWizardBadge />{" "}
                <div className="content-header">Start your repository.</div>
                <div className="content-subtitle">
                  You can upload an existing CV to automatically populate your
                  repository or you can start from scratch. We can accept
                  uploads of most formats. If the upload fails due to an
                  incompatible format, please use the repository tool to input
                  your information.
                </div>
                <Upload.Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Choose a file or drag it here
                  </p>
                </Upload.Dragger>
                <Divider>Or </Divider>
                <Button
                  className="black-button"
                  style={{
                    margin: "12px auto",
                    display: "block",
                    width: "300px",
                  }}
                  onClick={() => {
                    overrideFlag({ reload: true });
                  }}
                >
                  Create Repository Manually
                </Button>
              </>
            )}

            {state.file && !state.importSuccess  && !state.importError && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    margin: "96px auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <i
                    style={{ fontSize: "128px", color: "var(--primary)" }}
                    className="fa-solid fa-circle fa-beat fa-2xl"
                  ></i>
                </div>
                <div className="uploading-message">
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal bold 30px/12px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Uploading your CV
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal normal 16px/24px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Please hold on a moment while we’re securely uploading your
                    CV.
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal normal 16px/24px DM Sans",
                      textAlign: "center",
                      marginTop: "32px",
                      fontWeight: 600,
                    }}
                  >
                    Estimated time: 120 seconds
                  </Typography.Text>
                </div>
              </div>
            )}
            {state.importError && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    margin: "96px auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <i
                    style={{ fontSize: "128px", color: "#ff5b00" }}
                    className="fa-solid fa-circle-xmark fa-2xl"
                  ></i>
                </div>
                <div className="uploading-message">
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal bold 30px/12px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Your upload failed!
                  </Typography.Text>
                  <br />
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal normal 16px/24px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Please return to the main screen and use
                    the repository tool to input your information
                  </Typography.Text>
                </div>
              </div>
            )}
            {state.importSuccess && (
              <div className="success-message">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      margin: "64px auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      style={{ fontSize: "128px", color: "var(--primary)" }}
                      className="fa-solid fa-circle-check"
                    >
                      {" "}
                    </i>
                  </div>
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal bold 30px/12px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Your CV Has Been Imported!
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{
                      color: "var(--black)",
                      font: "normal normal normal 16px/24px DM Sans",
                      textAlign: "center",
                    }}
                  >
                    Explore your information, make edits, and then create your a
                    new CV
                  </Typography.Text>
                  <div>
                    <Button
                      className="black-button"
                      onClick={() => {
                        window.location.href = "/repository";
                      }}
                    >
                      Go to repository
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          visible={howItWorks}
          footer={null}
          closable={true}
          width="747px"
          onCancel={() => {
            setHowItWorks(false);
          }}
        >
          <div className="modal-header">
            <div className="modal-header-title">How Write My CV works?</div>
          </div>
          <div className="modal-body">
            <div className="modal-body-content">
              <p className="para-title">📝 CREATE Your Repository</p>
              <p>
                <b>- Start from Scratch or Upload an Existing CV:</b> Input your
                professional experience, skills, education, and more.
              </p>
              {/* <p>
                <b>- Detail is Key:</b> The richness of your input determines
                the quality of your future tailored CVs. This is a one-time
                effort.
              </p> */}
              <p className="para-title">
                🧙‍♂️Use CV Wizard to optimise and tailor your CV{" "}
              </p>
              <p>
                <b>- Automatic Tailoring:</b> After completing your repository,
                our CV Wizard crafts customized CVs for different roles and
                industries at a click.
              </p>
              {/* <p>
                <b>- AI-driven Accuracy:</b> Ensures each CV aligns perfectly
                with job-specific requirements.
              </p> */}
              <p className="para-title">✏️Personalise Your Generated CV</p>
              <p>
                <b>- Edit and Perfect: </b>
                Feel free to make adjustments. Follow the CV Wizard’s
                suggestions to fill in gaps or enhance existing content.
              </p>
              <p className="para-title">
                🚀Export and Achieve Your Career Goals
              </p>
              <p>
                <b>- Easy Export Options:</b> Download as PDF or create a
                shareable link.
              </p>
              <p>
                <b>- ATS Compliant:</b> Your resume adheres to Applicant
                Tracking System (ATS) guidelines, maximizing its opportunity to
                be seen by a human recruiter.
              </p>
            </div>
            <div className="modal-body-action">
              <Button
                type="primary"
                onClick={() => {
                  setHowItWorks(false);
                  setShowModal(true);
                }}
              >
                Create my repository
              </Button>
            </div>
          </div>
        </Modal>
        <div className="content">
          <div className="content-header">Create your Career Repository</div>

          <div className="content-body">
            Creating your career repository is a one-time step that will allow
            you to create as many CVs as you need and enable you to seamlessly
            update your CV for as long as you need.
          </div>

          <div className="action">
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Create my repository
            </Button>

            <Button
              type="link"
              onClick={() => {
                setHowItWorks(true);
              }}
            >
              How it works?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCVToProfile;

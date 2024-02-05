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
import { useAuth } from "../authContext";
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
    questionIdx: number;
    file: any | null;
    importSuccess: boolean;
  };
  const [state, setState] = useState<StateType>({
    isComplete: false,
    questionIdx: 0,
    file: "Somethign",
    importSuccess: true,
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
    let formData = new FormData();
    formData.append("file", file);
    await openai.parseResume(formData);
    await overrideFlag({});
    setState((prev) => ({ ...prev, file: null, importSuccess: true }));
  };

  const overrideFlag = async ({ reload = false }: { reload?: boolean }) => {
    await auth.overrideCVImport();
    if (reload) {
      //   window.location.reload();
      window.location.href = "/repository";
    }
  };
  //   const saveResponse = (response) => {
  //     console.log(response);
  //   };
  //   const onLogout = () => {
  //     auth.logout();
  //   };

  //   const setCurrentQuestionIdx = (idx) => {
  //     setState((prev) => ({
  //       ...prev,
  //       questionIdx: idx,
  //     }));
  //   };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      // setState((prev) => ({ ...prev, file, error: "" }));
      return false;
    },
    action: (file) => {
      console.log(file);
      return Promise.resolve("ok");
    },
    // action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange: handleFileChange,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div>
      <div className="title-header">Start your repository</div>
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
          <Typography.Text>
            Welcome to Write My CV: Your Smart CV Maker!
          </Typography.Text>
        </Row>
        {/* <div
        style={{
          width: "100%",
          // maxWidth: "500px",
        }}
      >
        <Progress
          percent={(state.questionIdx + 1) * 25}
          strokeColor={"#256763"}
        />

        <Typography.Title level={2}>Onboarding</Typography.Title>
        <CoolForm
          questions={questions}
          finalScreen={(props) => (
            <FinalScreen
              {...props}
              userId={auth.user.uid}
              onProfileSave={auth.markProfileCompleted}
            />
          )}
          setCurrentQuestionIdx={setCurrentQuestionIdx}
          onChange={saveResponse}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="link" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div> */}

        <Modal
          visible={showModal}
          footer={null}
          closable={true}
          width={state.file ? "650px" : "950px"}
          onCancel={() => {
            setShowModal(false);
          }}
        >
          <div className="import-cv-modal modal-body">
            {!state.file && !state.importSuccess && (
              <>
                <CVWizardBadge />{" "}
                <div className="content-header">
                  Do you already have a CV you'd like to bring in?
                </div>
                <div className="content-subtitle">
                  Start your repository by importing your existing resume from
                  LinkedIn or other sources, or begin creating a brand-new one
                  from scratch.
                </div>
                <Upload.Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Choose a file or drag it here
                  </p>
                  {/* <p className="ant-upload-hint">
                    You can upload a PDF or Word document. You can also import
                    your profile from LinkedIn, just export from LinkedIn and
                    upload here.
                  </p> */}
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
                  Start from scratch
                </Button>
              </>
            )}

            {state.file && !state.importSuccess && (
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
                    style={{ fontSize: "128px", color: "#E3E3E3" }}
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
                    Importing your CV
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
                    Please hold on a moment while we securely import your CV. This may take a few seconds.
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
                    Explore your information, make edits, and then create your a new CV
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
        {/* <div
        style={{
          margin: "32px auto",
        }}
      >
        {state.file && !state.importSuccess && (
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
                style={{ fontSize: "128px", color: "var(--primary-400)" }}
                className="fa-solid fa-cloud-arrow-up fa-bounce fa-2xl"
              ></i>
            </div>
            <div>
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: "16px",
                }}
              >
                Uploading {state.file?.name}
              </Typography.Text>
              <br />
              <Typography.Text
                type="secondary"
                style={{
                  fontSize: "16px",
                }}
              >
                This may take a few minutes, please wait and don't refresh the
                page
              </Typography.Text>
            </div>
          </div>
        )}
        {!state.file && !state.importSuccess && (
          <>
            {" "}
            <Upload.Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
              Start filling your details to create your Repository
              </p>
              <p className="ant-upload-hint">
                You can upload a PDF or Word document. You can also import your
                profile from LinkedIn, just export from LinkedIn and upload
                here.
              </p>
            </Upload.Dragger>
            <Divider>Or </Divider>
            <Button
              style={{
                height: "50px",
                margin: "32px 0px",
                width: "100%",
              }}
              onClick={() => {
                overrideFlag({ reload: true});
              }}
            >
              Add your profile details manually
            </Button>
          </>
        )}

        {state.importSuccess && (
          <div>
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
                  style={{ fontSize: "128px", color: "var(--primary-400)" }}
                  className="fa-solid fa-circle-check"
                >
                  {" "}
                </i>
              </div>
              <div>
                <Typography.Text
                  type="secondary"
                  style={{
                    fontSize: "16px",
                  }}
                >
                  Your profile has been successfully updated, go to the
                  repository section and please validate your details!
                </Typography.Text>
              </div>
              <div>
                <Button
                  onClick={() => {
                    window.location.href = "/repository";
                  }}
                  type="primary"
                >
                  Go to repository
                </Button>
              </div>
            </div>
          </div>
        )}
      </div> */}

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
              <p className="para-title">FILL IN YOUR REPOSITORY</p>
              <p>
                <b>- Start from Scratch or Upload an Existing CV:</b> Input your
                professional experience, skills, education, and more.
              </p>
              <p>
                <b>- Detail is Key:</b> The richness of your input determines
                the quality of your future tailored CVs. This is a one-time
                effort.
              </p>
              <p className="para-title">EXPERIENCE THE AI-POWERED CV WIZARD </p>
              <p>
                <b>- Automatic Tailoring:</b> After completing your repository,
                our CV Wizard crafts customized CVs for different roles and
                industries at a click.
              </p>
              <p>
                <b>- AI-driven Accuracy:</b> Ensures each CV aligns perfectly
                with job-specific requirements.
              </p>
              <p className="para-title">PERSONALIZE YOUR GENERATED CV</p>
              <p>
                <b>- Edit and Perfect: </b>
                Feel free to make adjustments. Follow the CV Wizard’s
                suggestions to fill in gaps or enhance existing content.
              </p>
              <p className="para-title">EXPORT AND ACHIEVE YOUR CAREER GOALS</p>
              <p>
                <b>- Easy Export Options:</b> Download as PDF or create a
                shareable link. - ATS Compliant: Your resume adheres to
                Applicant Tracking System (ATS) guidelines, maximizing its
                chances of getting noticed.
              </p>
            </div>
            <div className="modal-body-action">
              <Button type="primary">Create my repository</Button>
            </div>
          </div>
        </Modal>
        <div className="content">
          <div className="content-header">
            Start filling your details to create your Repository
          </div>

          <div className="content-body">
            Before you dive into creating your perfect CV, filling the
            repository is a simple yet essential step to complete. This is a
            one-time process that will allow you to create endless tailored CVs
            with the help of our CV Wizard! Ready to Start?
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

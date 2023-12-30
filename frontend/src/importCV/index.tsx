import {
  Button,
  Divider,
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

const ImportCVToProfile = () => {
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
    file: null,
    importSuccess: false,
  });

  const openai = useOpenAI();

  console.log("openai", openai);
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
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        // height: "80vh",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
        padding: "2rem",
      }}
    >
      <Row>
        <Typography.Title level={3}>
          Do you want to import your CV to your profile?
        </Typography.Title>
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

      <div
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
                Click or drag resume to this area to upload
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
      </div>
    </div>
  );
};

export default ImportCVToProfile;

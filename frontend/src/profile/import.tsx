import React, { useState } from "react";
import { useOpenAI } from "../utils";
import { useAuth } from "../contexts/authContext";
import { Modal, Typography, Upload, Row, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { MagicWandLoading, UploadIcon } from "../components/faIcons";

type ImportResumeModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: any) => void;
};

export const ImportResumeModal = ({
  visible,
  onCancel,
  onConfirm,
}: ImportResumeModalProps) => {
  type StateType = {
    file: any | null;
    error: string;
    importSuccess: boolean;
    importError: boolean;
  };
  const [state, setState] = useState<StateType>({
    file: null,
    error: "",
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
      setState((prev) => ({ ...prev, file: null, importSuccess: true }));
    } catch (error) {
      setState((prev) => ({ ...prev, file: null, importError: true }));
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width={state.file ? "650px" : "950px"}

      // title="Import Resume"
      footer={null}
      className="default-modal"
    >
      <div
        style={{
          paddingBottom: "8px",
        }}
      >
        {!state.file && !state.importError && !state.importSuccess && (
          <>
            <Typography.Title level={3}>Upload your CV</Typography.Title>
            <Typography.Text type="secondary">
              Do you have an existing CV that you would like to upload?
            </Typography.Text>

            <div
              style={{
                padding: "20px 20px",
                margin: "20px 0px",
                backgroundColor: "var(--accent-2-light)",
                borderRadius: "10px",
              }}
            >
              <b>IMPORTANT:</b> <br /> Uploading a new CV will replace the
              current information in your repository. Any CVs already created
              with us won’t be affected by this upload.
            </div>
            <Upload.Dragger
              onChange={handleFileChange}
              accept="application/pdf,.docx,.doc"
              disabled={state.file}
              beforeUpload={(file) => {
                // setState((prev) => ({ ...prev, file, error: "" }));
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon />
              </p>
              <p className="ant-upload-text">Choose a file or drop it here</p>
            </Upload.Dragger>
          </>
        )}

        {state.file && !state.importSuccess && !state.importError && (
          <>
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
          </>
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
                Please return to the main screen and use the repository tool to
                input your information
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
                Explore your information, make edits, and then create your a new
                CV. Please reload the page to see the changes
              </Typography.Text>
              <div>
                <Button
                  className="black-button"
                  onClick={() => {
                    // onConfirm({});
                    window.location.reload();
                  }}
                >
                  Explore repository
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

     

   
      
    </Modal>
  );
};

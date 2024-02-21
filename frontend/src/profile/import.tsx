import React, { useState } from "react";
import { useOpenAI } from "../utils";
import { useAuth } from "../authContext";
import { Modal, Typography, Upload, Row } from "antd";
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
  };
  const [state, setState] = useState<StateType>({
    file: null,
    error: "",
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
    setState((prev) => ({ ...prev, file: null }));
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      // title="Import Resume"
      footer={null}
      className="default-modal"
    >
      <div
        style={{
          paddingBottom: "8px",
        }}
      >
        {/* <Typography.Text type="secondary" >
          Import your resume from LinkedIn or other sources (upload)
        </Typography.Text> */}
        {/* <br/> */}
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
          <b>IMPORTANT:</b> <br /> Uploading a new CV will replace the current
          information in your repository. Any CVs already created with us won’t
          be affected by this upload.
        </div>
        {/* <Typography.Text type="danger">
          This step will erase all your existing data in the repository. Your
          resumes will not be affected.
        </Typography.Text> */}
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
        <p className="ant-upload-text">
        Choose a file or drop it here
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
        </Row>
      )}
    </Modal>
  );
};

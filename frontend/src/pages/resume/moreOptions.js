import {
  Button,
  Empty,
  Form,
  Modal,
  Row,
  Spin,
  Typography,
  Input,
  Select,
  message,
  Card,
  Col,
  List,
  Skeleton,
  Popover,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../authContext";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import moment from "moment";
import { Link } from "react-router-dom";
import { ref } from "firebase/storage";
import { downloadStorageContent } from "../../helpers";
import "./index.css";
import { useMutateDoc } from "../../firestoreHooks";

const MoreOptions = ({ resumeId, publicResumeId, downloadDocx , downloadLoading}) => {
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  let existingPublicLink =
    window.location.origin + "/public-resume/" + publicResumeId;

  let publicResumeMutation = useMutateDoc("publicResume", "new");
  let resumeRef = doc(db, "resumes", resumeId);

  const { user } = useAuth();
  const handlePublicLink = async () => {
    // Get public link

    let docId = await publicResumeMutation.mutate({
      resumeId: resumeId,
      userId: user.uid,
      createdAt: new Date(),
    });

    let publicLink = window.location.origin + "/public-resume/" + docId;
    // Copy to clipboard
    navigator.clipboard.writeText(publicLink);
    message.success("Public link copied to clipboard");

    // Update public resume ID in resume
    // let resumeRef = doc(db, "resumes", resumeId);
    try {
      await setDoc(
        resumeRef,
        {
          publicResumeId: docId,
        },
        { merge: true }
      );
    } catch (e) {
      debugger;
      console.log(e);
    }
  };

  const softDeleteResume = async () => {
    try {
      await setDoc(
        resumeRef,
        {
          deleted: true,
        },
        { merge: true }
      );
    } catch (e) {
      debugger;
      console.log(e);
    }
    setDeleteModalVisible(false);
  };

  return (
    <div
      style={
        {
          // width: "200px",
        }
      }
    >
      <Modal
        title="Edit Resume"
        open={copyModalVisible}
        footer={null}
        onCancel={
          (e) => {
            setCopyModalVisible(false);
          }
          // onCancel
        }
      ></Modal>

      <Modal
        title="Delete Resume"
        open={deleteModalVisible}
        footer={null}
        onCancel={
          (e) => {
            e.preventDefault();
            setDeleteModalVisible(false);
          }
          // onCancel
        }
      >
        <p>Are you sure you want to delete this resume?</p>
        <Space>
          <Button
            type="primary"
            danger
            onClick={(e) => {
                e.preventDefault();
              softDeleteResume();
            }}
          >
            Delete
          </Button>

          <Button
            onClick={(e) => {
                e.preventDefault();

              setDeleteModalVisible(false);
            }}
          >
            Cancel
          </Button>
        </Space>
      </Modal>

      <Space direction="vertical">
        <Button type="link" icon={<CopyOutlined />}>
          Copy Resume
        </Button>
        {publicResumeId ? (
          <Button
            type="link"
            icon={<ShareAltOutlined />}
            onClick={(e) => {
              e.preventDefault();

              navigator.clipboard.writeText(existingPublicLink);
              message.success("Public link copied to clipboard");
            }}
          >
            Copy Public Link
          </Button>
        ) : (
          <Button
            type="link"
            icon={<ShareAltOutlined />}
            onClick={(e) => {
              e.preventDefault();
              handlePublicLink();
            }}
          >
            Get Public Link
          </Button>
        )}
       <Button
          type="link"
          loading={downloadLoading}
          // icon={<DownloadOutlined />}
          icon={
            <span role="img" aria-label="share-alt" class="anticon anticon-share-alt"><img src="/icon-word.svg" width="16px" /></span>}

          onClick={(e) => {
            e.preventDefault();
            downloadDocx();
          }}
        >
          Download Word
        </Button>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.preventDefault();
            setDeleteModalVisible(e);
          }}
        >
          Delete Resume
        </Button>
      </Space>
    </div>
  );
};

export default MoreOptions;

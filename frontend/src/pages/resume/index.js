import {
  Button,
  Empty,
  Row,
  Spin,
  Typography,
  Card,
  Col,
  List,
  Skeleton,
  Popover,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EditOutlined,
  BulbOutlined
} from "@ant-design/icons";
import { useAuth } from "../../authContext";
import {
  addDoc,
  and,
  collection,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import moment from "moment";
import { Link } from "react-router-dom";
import { ref } from "firebase/storage";
import { downloadStorageContent } from "../../helpers";
import "./index.css";
import MoreOptions from "./moreOptions";
import { NewResumeModal } from "./newResumeModal";


const ResumeItem = ({ resume }) => {
  const { user } = useAuth();
  const [state, setState] = useState({
    error: "",
    loading: true,
    imgURL: "",
  });
  useEffect(() => {
    getScreenshot();
  }, []);

  const getScreenshot = async (url) => {
    const gsRef = ref(
      storage,
      `userData/${user.uid}/resumes/${resume.id}/resume.png`
    );

    setState((prev) => ({ ...prev, loading: true }));
    // The data blob contains resume in html format
    try {
      let data = await downloadStorageContent(gsRef);
      // Convert blob to url
      let imgURL = URL.createObjectURL(data);
      setState((prev) => ({ ...prev, loading: false, imgURL: imgURL }));
    } catch (err) {
      console.log(err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const downloadResume = async (e) => {
    e.preventDefault();
    const gsRef = ref(
      storage,
      `userData/${user.uid}/resumes/${resume.id}/resume.pdf`
    );

    // Download the resume
    let data = await downloadStorageContent(gsRef);
    // Convert blob to url
    let url = URL.createObjectURL(data);
    // Open the url in new tab
    window.open(url, "_blank");
  };

  let createdAt = moment(resume.createdAt.toDate()).fromNow();
  return (
    <Link to={`/resumes/${resume.id}`}>
      <Card key={resume.id} hoverable>
        <Row gutter={12}>
          <Col span={8}>
            <div style={{}} className="resume-card-preview-image">
              {state.loading ? (
                //   <Spin></Spin>
                <Skeleton.Image
                  active={true}
                  style={{ width: "100%", borderRadius: "8px", height: "200px" }}
                ></Skeleton.Image>
              ) : !state.loading && !state.imgURL ? (
                <Skeleton.Image
                  style={{ width: "100%", borderRadius: "8px", height: "200px" }}
                ></Skeleton.Image>
              ) : (
                <img
                  style={{ width: "100%", borderRadius: "8px", height: "200px" }}
                  src={state.imgURL}
                ></img>
              )}
            </div>
          </Col>
          <Col span={16}>
            <div className="resume-card-details">
              <div className="resume-card-header">
                <div className="title">
                  <Typography.Title level={4} style={{ marginBottom: "0rem" }}>
                    {resume.name}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Created {createdAt}
                  </Typography.Text>
                </div>
                <div className="subtitle">
                  <Typography.Text type="secondary">
                    For role: {resume.role}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    Sector: {resume.sector}
                  </Typography.Text>
                </div>
              </div>

              <Row style={{ marginTop: "1rem" }} gutter={[12, 12]}>
                <Col span={12}>
                  <Button type="link" onClick={downloadResume}>
                    <DownloadOutlined /> Download
                  </Button>
                </Col>
                <Col span={12}>
                  <Popover
                    content={
                      <MoreOptions
                        resumeId={resume.id}
                        publicResumeId={resume.publicResumeId}
                      />
                    }
                    trigger="click"
                  >
                    <Button type="link" onClick={(e) => e.preventDefault()}>
                      <MoreOutlined />
                      More
                    </Button>
                  </Popover>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </Link>
  );
};
const Resume = () => {
  const [state, setState] = useState({
    error: "",
    loading: true,
    resumes: [],
    newResumeFlag: false,
  });

  useEffect(() => {
    const q = query(
      collection(db, "resumes"),
      and(where("userId", "==", auth.user.uid), where("deleted", "==", false)), 
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const resumes = [];
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        resumes.push({ ...doc.data(), id });
      });
      setState((prev) => ({ ...prev, resumes, loading: false }));
    });
    return () => unsub();
  }, []);

  const auth = useAuth();

  const createNewResume = () => {
    setState((prev) => ({ ...prev, newResumeFlag: true }));
  };
  return (
    <div>
      <Row align="middle">
        <Typography.Title level={2}>Your Resumes</Typography.Title>
        <Button
          style={{ marginLeft: "auto" }}
          icon={<PlusOutlined />}
          onClick={createNewResume}
        >
          Create New
        </Button>
      </Row>

      {state.loading && (
        <Row
          style={{ width: "100%", height: "50vh" }}
          align="middle"
          justify="center"
        >
          <Spin> </Spin>
        </Row>
      )}
      {!state.loading && state.resumes.length == 0 && (
        <Row
          style={{ width: "100%", height: "50vh" }}
          align="middle"
          justify="center"
        >
          <Empty description="No resumes yet">
            <Button type="primary" onClick={createNewResume}>
              Create New
            </Button>
          </Empty>
        </Row>
      )}

      {
        <List
          style={{
            marginTop: "1rem",
          }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          dataSource={state.resumes}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <ResumeItem key={item.id} resume={item} />
            </List.Item>
          )}
        />
      }

      <NewResumeModal
        userId={auth.user.uid}
        visible={state.newResumeFlag}
        onCancel={() => setState((prev) => ({ ...prev, newResumeFlag: false }))}
        onConfirm={() =>
          setState((prev) => ({ ...prev, newResumeFlag: false }))
        }
      />
    </div>
  );
};

export default Resume;

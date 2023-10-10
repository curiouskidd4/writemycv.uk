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
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../authContext";
import {
  addDoc,
  and,
  collection,
  doc,
  onSnapshot,
  or,
  orderBy,
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
import MoreOptions from "./moreOptions";

const ObjectId = require("bson-objectid");

const NewResumeModal = ({ visible, onCancel, onConfirm, userId }) => {
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    // uuid for resume

    let data = {
      ...values,
      id: ObjectId().toString(),
      userId,
      deleted: false,
      createdAt: new Date(),
    };
    // Drop empty fields
    Object.keys(data).forEach((key) => data[key] == null && delete data[key]);
    try {
      await setDoc(doc(db, "resumes", data.id), data);
      onConfirm();
      message.success("Resume created successfully");
    } catch (err) {
      console.log(err);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      title="New Resume"
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        style={{
          maxWidth: "600px",
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Resume Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input resume name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="For role"
          name="role"
          rules={[
            {
              required: true,
              message: "Please input role!",
            },
          ]}
        >
          <Input
            style={{ width: "100%" }}
            placeholder="Mention role you are targeting"
          ></Input>
        </Form.Item>
        <Form.Item label="Sector" name="sector" rules={[]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Mention the sector you are targeting, e.g. Finance, Tech, etc."
          ></Input>
        </Form.Item>
        <Form.Item label="Geographic Location" name="geography" rules={[]}>
          <Input
            style={{ width: "100%" }}
            placeholder="Mention the geographic location you are targeting, e.g. UK, Europe, etc."
          ></Input>
        </Form.Item>
        <Form.Item label="For companies (optional)" name="companies" rules={[]}>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Mention companies you are targeting"
          ></Select>
        </Form.Item>

        <Form.Item
          label="Job Description (optional)"
          name="jobDescription"
          rules={[]}
        >
          <Input.TextArea
            placeholder="Mention job description you are targeting"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item
          // label="Copy from your profile"
          name="copyFromProfile"
          rules={[]}
          valuePropName="checked"
        >
          <Checkbox>Copy data from your profile</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "20px" }}
          >
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

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

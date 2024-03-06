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
  Space,
  Popover,
  Divider,
  Modal,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  EditOutlined,
  BulbOutlined,
  ExpandOutlined,
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
// import { NewResumeModal } from "./newResumeModal";
import { NewResumeModal } from "./newResumeHowell";
import useUtils from "../../utils/download";
import {
  DownloadIcon,
  MagicWandIcon,
  MoreIcon,
} from "../../components/faIcons";
import { useNavigate } from "react-router-dom";
import { Resume } from "../../types/resume";
import { useMutateDoc } from "../../firestoreHooks";

// const ResumeItemV2 = ({ resume }: { resume: Resume }) => {
//   const { user } = useAuth();
//   const utils = useUtils();
//   const [state, setState] = useState({
//     error: "",
//     loading: true,
//     imgURL: "",
//     showPreviewModal: false,
//   });
//   useEffect(() => {
//     getScreenshot();
//   }, []);

//   const getScreenshot = async () => {
//     const gsRef = ref(
//       storage,
//       `userData/${user.uid}/resumes/${resume.id}/resume.png`
//     );

//     setState((prev) => ({ ...prev, loading: true }));
//     // The data blob contains resume in html format
//     try {
//       let data = await downloadStorageContent(gsRef);
//       // Convert blob to url
//       let imgURL = URL.createObjectURL(data);
//       setState((prev) => ({ ...prev, loading: false, imgURL: imgURL }));
//     } catch (err) {
//       console.log(err);
//       setState((prev) => ({ ...prev, loading: false }));
//     }
//   };

//   const downloadResume = async (e: any) => {
//     e.preventDefault();
//     const gsRef = ref(
//       storage,
//       `userData/${user.uid}/resumes/${resume.id}/resume.pdf`
//     );

//     // Download the resume
//     let data = await downloadStorageContent(gsRef);
//     // Convert blob to url
//     let url = URL.createObjectURL(data);
//     // Open the url in new tab
//     window.open(url, "_blank");
//   };

//   const downloadResumeDocx = async (e: any) => {
//     // e.preventDefault();
//     let res = await utils.exportResumeToDoc({ resumeId: resume.id });
//     window.open(res.data.url, "_blank");
//   };

//   let createdAt = moment(resume.createdAt.toDate()).fromNow();
//   return (
//     <>
//       <Modal
//         visible={state.showPreviewModal}
//         footer={null}
//         onCancel={() =>
//           setState((prev) => ({ ...prev, showPreviewModal: false }))
//         }
//       >
//         <div style={{ textAlign: "center", overflowY: "scroll" }}>
//           <img src={state.imgURL} style={{ width: "100%" }}></img>
//         </div>
//       </Modal>
//       <Link to={`/resumes/${resume.id}/edit`}>
//         <Card key={resume.id} className="resume-card">
//           <div>
//             <ExpandOutlined
//               className="expand-icon"
//               onClick={(e) => {
//                 e.preventDefault();

//                 setState((prev) => ({ ...prev, showPreviewModal: true }));
//               }}
//             />
//           </div>
//           <Row
//             justify="center"
//             style={{
//               background: "#80808033",
//               // borderRadius: "5px",
//               overflowY: "scroll",
//               height: "200px",
//               padding: "32px",
//             }}
//           >
//             <div style={{}} className="resume-card-preview-image-v2">
//               {state.loading ? (
//                 //   <Spin></Spin>
//                 <Skeleton.Image
//                   active={true}
//                   style={{
//                     width: "100%",
//                     borderRadius: "8px",
//                     // height: "200px",
//                   }}
//                 ></Skeleton.Image>
//               ) : !state.loading && !state.imgURL ? (
//                 <Skeleton.Image
//                   style={{
//                     width: "100%",
//                     borderRadius: "8px",
//                     // height: "200px",
//                   }}
//                 ></Skeleton.Image>
//               ) : (
//                 <img
//                   style={{
//                     width: "100%",
//                     borderRadius: "8px",
//                     // height: "200px",
//                   }}
//                   src={state.imgURL}
//                 ></img>
//               )}
//             </div>
//           </Row>
//           <Row gutter={12} className="resume-details-actions">
//             <Col span={16} style={{ marginTop: "1rem" }}>
//               <div className="resume-card-details">
//                 <div className="resume-card-header">
//                   <div className="title">
//                     <Typography.Title
//                       level={4}
//                       style={{ marginBottom: "0rem" }}
//                     >
//                       {resume.name}
//                     </Typography.Title>
//                     <Typography.Text type="secondary">
//                       Created {createdAt}
//                     </Typography.Text>
//                   </div>
//                 </div>
//               </div>
//             </Col>
//             <Col span={8}>
//               <Row
//                 style={{ marginTop: "1rem", float: "right" }}
//                 gutter={[12, 12]}
//               >
//                 <div
//                   style={{
//                     float: "right",
//                   }}
//                 >
//                   <Button type="link" onClick={downloadResume}>
//                     <DownloadIcon />
//                   </Button>
//                   <Divider type="vertical" />
//                   <Popover
//                     content={
//                       <MoreOptions
//                         resumeId={resume.id}
//                         publicResumeId={resume.publicResumeId}
//                         downloadDocx={downloadResumeDocx}
//                         downloadLoading={utils.loading}
//                       />
//                     }
//                     trigger="click"
//                   >
//                     <Button
//                       type="link"
//                       onClick={(e) => e.preventDefault()}
//                       style={{}}
//                     >
//                       {/* <MoreOutlined /> */}
//                       <MoreIcon />
//                     </Button>
//                   </Popover>
//                 </div>
//               </Row>
//             </Col>
//           </Row>
//         </Card>
//       </Link>
//     </>
//   );
// };

const ResumeItemV3 = ({ resume }: { resume: Resume }) => {
  const resumeId = resume.id;
  const { user } = useAuth();
  const utils = useUtils();
  const navigate = useNavigate();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [state, setState] = useState({
    error: "",
    loading: true,
    imgURL: "",
    showPreviewModal: false,
  });
  useEffect(() => {
    getScreenshot();
  }, []);

  let publicResumeMutation = useMutateDoc("publicResume", "new");

  const handlePublicLink = async () => {
    // Get public link
    let resumeRef = doc(db, "resumes", resumeId);

    let docId = await publicResumeMutation.mutate({
      resumeId: resumeId,
      userId: user.uid,
      createdAt: new Date(),
    });

    // let publicLink = window.location.origin + "/public-resume/" + docId;
    // Copy to clipboard
    // navigator.clipboard.writeText(publicLink);
    // message.success("Public link copied to clipboard");

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
      return docId;
    } catch (e) {
      debugger;
      console.log(e);
    }
  };

  const getPublicLink = async () => {
    if (resume.publicResumeId) {
      let publicLink =
        window.location.origin + "/public-resume/" + resume.publicResumeId;
      navigator.clipboard.writeText(publicLink);
      message.success("Public link copied to clipboard");
    } else {
      let id = await handlePublicLink();
      let publicLink = window.location.origin + "/public-resume/" + id;
      navigator.clipboard.writeText(publicLink);
      message.success("Public link copied to clipboard");
    }
  };

  const softDeleteResume = async () => {
    let resumeRef = doc(db, "resumes", resumeId);

    try {
      await setDoc(
        resumeRef,
        {
          isDeleted: true,
        },
        { merge: true }
      );
    } catch (e) {
      debugger;
      console.log(e);
    }
    setDeleteModalVisible(false);
  };

  const getScreenshot = async () => {
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

  const downloadResume = async (e: any) => {
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

  const downloadResumeDocx = async (e: any) => {
    // e.preventDefault();
    let res = await utils.exportResumeToDoc({ resumeId: resume.id });
    window.open(res.data.url, "_blank");
  };

  let createdAt = moment(resume.createdAt.toDate()).fromNow();
  return (
    <>
      <Modal
        className="default-modal"
        title="Are you sure you want to delete this resume?"
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
        {/* <p>Are you sure you want to delete this resume?</p> */}
        <Space
          style={{
            marginTop: "1rem",
          }}
          size="large"
        >
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
            style={{
              height: "41px",
            }}
            onClick={(e) => {
              e.preventDefault();

              setDeleteModalVisible(false);
            }}
          >
            Cancel
          </Button>
        </Space>
      </Modal>

      <Modal
        visible={state.showPreviewModal}
        footer={null}
        onCancel={() =>
          setState((prev) => ({ ...prev, showPreviewModal: false }))
        }
      >
        <div style={{ textAlign: "center", overflowY: "scroll" }}>
          <img src={state.imgURL} style={{ width: "100%" }}></img>
        </div>
      </Modal>
      <Card
        key={resume.id}
        className="resume-card-new"
        onClick={() => {
          navigate(`/resumes/${resume.id}/edit`);
        }}
      >
        <Row>
          <Col span={10}>
            <Row justify="center" className="preview-container">
              <div style={{}} className="resume-card-preview-image-v2">
                {state.loading ? (
                  //   <Spin></Spin>
                  <Skeleton.Image
                    active={true}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      // height: "200px",
                    }}
                  ></Skeleton.Image>
                ) : !state.loading && !state.imgURL ? (
                  <Skeleton.Image
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      // height: "200px",
                    }}
                  ></Skeleton.Image>
                ) : (
                  <img
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      // height: "200px",
                    }}
                    src={state.imgURL}
                  ></img>
                )}
              </div>
            </Row>
          </Col>
          <Col span={14}>
            <Row gutter={12} className="resume-details-actions">
              <div className="resume-card-details">
                <div className="resume-card-header">
                  <div className="title">
                    {/* <Typography.Title
                      level={5}
                      style={{ marginBottom: "0rem" }}
                    > */}
                    {resume.name}
                    {/* </Typography.Title> */}
                  </div>
                  <div className="sub-title">
                    <Typography.Text type="secondary">
                      Created {createdAt}
                    </Typography.Text>
                  </div>
                </div>
              </div>
              <Row
                className="action-column"
                // style={{ marginTop: "1rem", float: "right" }}
                // gutter={[12, 12]}
              >
                <Space direction="vertical" size="small">
                  <Button
                    size="small"
                    type="link"
                    // onClick={downloadResume}
                    onClick={
                      (e) => {
                        downloadResume(e);
                        e.stopPropagation();
                      }
                    }
                    className="resume-action"
                  >
                    <i className="fa-regular fa-copy"></i> Duplicate
                  </Button>
                  <Button
                    size="small"
                    type="link"
                    // onClick={downloadResume}
                    onClick={
                      (e) => {
                        downloadResume(e);
                        e.stopPropagation();

                      }
                    }
                    className="resume-action"
                  >
                    <i className="fa-solid fa-download"></i> Download
                  </Button>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      getPublicLink();
                      e.stopPropagation();

                    }}
                    className="resume-action"
                  >
                    <i className="fa-solid fa-share-from-square"></i> Share
                  </Button>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      setDeleteModalVisible(true);
                      e.stopPropagation();

                    }}
                    className="resume-action"
                  >
                    <i className="fa-solid fa-trash-can"></i> Delete
                  </Button>
                </Space>
              </Row>
            </Row>
          </Col>
        </Row>
        <div>
          <Link to={`/resumes/${resume.id}/edit`}>
            <Button type="text" size="small" className="expand-icon">
              <i className="fa-regular fa-eye"></i>
            </Button>
          </Link>
        </div>
      </Card>
    </>
  );
};
const ResumeBodyHeader = ({
  createNewResume,
}: {
  createNewResume: () => void;
}) => {
  const auth = useAuth();

  return (
    <Row align="middle" className="body-header">
      <Col span={12}>
        <div>
          <Typography.Title
            level={3}
            style={{
              marginBottom: "0px",
            }}
            className="title"
          >
            Welcome Back, {auth.user.displayName}!
          </Typography.Title>
          <div>
            <span className="subtitle">
              You can organise and manage your CVs here.
            </span>
          </div>
        </div>
      </Col>
      <Col span={12}>
        <Button
          type="primary"
          style={{ float: "right", width: "240px" }}
          onClick={createNewResume}
        >
          <MagicWandIcon color="var(--black)" /> Create new CV
        </Button>
      </Col>
    </Row>
  );
};
const ResumeListView = () => {
  type State = {
    error: string;
    loading: boolean;
    resumes: Resume[];
    newResumeFlag: boolean;
  };
  const [state, setState] = useState<State>({
    error: "",
    loading: true,
    resumes: [],
    newResumeFlag: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "resumes"),
      and(
        where("userId", "==", auth.user.uid),
        where("isDeleted", "==", false)
      ),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const resumes: Resume[] = [];
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        resumes.push({ ...doc.data(), id } as Resume);
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
    <>
      <NewResumeModal
        // userId={auth.user.uid}
        visible={state.newResumeFlag}
        onCancel={() => setState((prev) => ({ ...prev, newResumeFlag: false }))}
        onConfirm={(id: string) => {
          navigate(`/resumes/${id}/edit`);
          setState((prev) => ({ ...prev, newResumeFlag: false }));
        }}
      />

      <div className="all-resume">
        <Row align="middle" className="title-header">
          <Col>
            <Typography.Title
              level={3}
              style={{
                marginBottom: "0px",
              }}
            >
              My CVs
            </Typography.Title>
          </Col>
        </Row>
        <div className="resume-container">
          <div className="resume-body">
            <ResumeBodyHeader createNewResume={createNewResume} />

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
                <Empty description="No CVs yet">
                  <Button type="primary" onClick={createNewResume}>
                    Create New
                  </Button>
                </Empty>
              </Row>
            )}

            {state.resumes.length > 0 && (
              <List
                style={{
                  marginTop: "1rem",
                }}
                grid={{
                  gutter: 32,
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
                    {/* <ResumeItem key={item.id} resume={item} /> */}
                    <ResumeItemV3 key={item.id} resume={item} />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeListView;

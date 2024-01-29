import {
  Button,
  Col,
  Form,
  Input,
  Menu,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Publication, PublicationList } from "../../../types/resume";
import "./index.css";
import SinglePublicationsFrom from "./components/editForm";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

const PublicationCard = ({ publication }: { publication: Publication }) => {
  let publicationDateStr = moment(publication.date.toDate()).format("MMM YYYY");
  return (
    <>
      <div className="title">{publication.title}</div>
      <div className="subtitle">{publicationDateStr}</div>
    </>
  );
};

type PublicationProps = {
  publicationList: Publication[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncPublications: (values: any) => Promise<void>;
  showTitle: boolean;
};

type PublicationState = {
  selectedPublication: Publication | null;
  selectedPublicationIdx: number | null;
};

const PublicationForm = ({
  publicationList,
  saveLoading,
  onFinish,
  syncPublications,
  showTitle = true,
}: PublicationProps) => {
  publicationList = publicationList || [];
  const [state, setState] = React.useState<PublicationState>({
    selectedPublication: publicationList.length > 0 ? publicationList[0] : null,
    selectedPublicationIdx: publicationList.length > 0 ? 0 : null,
  });

  const onSave = async (publication: Publication) => {
    publication.date = Timestamp.fromDate(
        publication.date.toDate()
      );
    publicationList[state.selectedPublicationIdx!] = publication;

    await syncPublications(publicationList);
    message.success("Publication saved!");
    if (onFinish) {
      await onFinish(publicationList);
    }
  };

  const addNew = () => {
    const newItem: Publication = {
      id: (publicationList.length + 1).toString(),
      title: "",
      date: Timestamp.fromDate(new Date()),
      description: "",
      link: "",
    };
    setState((prev) => ({
      selectedPublication: newItem,
      selectedPublicationIdx: publicationList.length,
    }));
  };


  return (
    <>
      {showTitle ? <Typography.Title level={4}>Publication</Typography.Title> : null}
      <Row gutter={24} style={{ height: "70vh" }}>
        <Col span={8} className="publication-history-selector">
          {/* <Typography.Title level={5}>Publication Items</Typography.Title> */}
          <Typography.Text type="secondary">Your history</Typography.Text>

          <Menu
            className="publication-menu"
            selectedKeys={
              state.selectedPublicationIdx != null
                ? [state.selectedPublicationIdx.toString()]
                : []
            }
            style={{
              //   height: "100%",
              borderRight: 0,
              background: "transparent",
            }}
            onSelect={(item) => {
              setState({
                selectedPublication: publicationList[parseInt(item.key)],
                selectedPublicationIdx: parseInt(item.key),
              });
            }}
            items={publicationList.map((edu, idx) => {
              return {
                key: idx.toString(),
                label: <PublicationCard publication={edu} />,
                //   label: edu.degree,
              };
            })}
          ></Menu>
          <Row justify="center">
            <Button
              style={{ width: "90%", margin: "8px auto" }}
              onClick={addNew}
            >
              <PlusOutlined /> Add Publication
            </Button>
          </Row>
        </Col>
        <Col span={16} style={{ paddingLeft: "24px" }}>
          {/* {state.selectedPublication && (
              <SinglePublicationForm
                initialValues={state.selectedPublication}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedPublication != null && state.selectedPublicationIdx != null ? (
            <>
              <div>
                <Typography.Title level={5}>
                  Publication #{state.selectedPublicationIdx + 1}
                </Typography.Title>
              </div>
              <SinglePublicationsFrom
                initialValues={state.selectedPublication}
                onFinish={onSave}
                saveLoading={saveLoading}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default PublicationForm;

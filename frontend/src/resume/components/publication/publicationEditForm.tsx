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
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";

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
  // selectedPublicationIdx: number | null;
  selectedId: string | null;
  isNewItem?: boolean;
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
    // selectedPublicationIdx: publicationList.length > 0 ? 0 : null,
    selectedId: publicationList.length > 0 ? publicationList[0].id : null,

  });

  const onSave = async (publication: Publication) => {
    publication.date = Timestamp.fromDate(publication.date.toDate());
    // publicationList[state.selectedPublicationIdx!] = publication;
    let newPublicationList = [...publicationList];
    let idx = newPublicationList.findIndex(
      (item) => item.id === publication.id
    );
    if (idx > -1) {
      newPublicationList[idx] = publication;
    } else {
      newPublicationList.push(publication);
    }

    await syncPublications(newPublicationList);
    message.success("Publication saved!");

    // if (onFinish) {
    //   await onFinish(publicationList);
    // }
  };

  const addNew = () => {
    const newItem: Publication = {
      id: ObjectID().toHexString(),
      title: "",
      date: Timestamp.fromDate(new Date()),
      description: "",
      link: "",
    };
    setState((prev) => ({
      selectedPublication: newItem,
      // selectedPublicationIdx: publicationList.length,
      selectedId: newItem.id,
      isNewItem: true,
    }));
  };

  const detailExtractor = (publication: Publication) => {
    return { title: publication.title, subtitle: "" };
  };

  return (
    <>
      {showTitle ? (
        <Typography.Title level={4}>Publication</Typography.Title>
      ) : null}
      <Row
        style={{
          height: "100%",
        }}
      >
        <Col
          style={{
            minWidth: "250px",
            width: "250px",
          }}
          className="publication-history-selector  selector-col"
        >
          {/* <Typography.Title level={5}>Publication Items</Typography.Title> */}
          {/* <Typography.Text type="secondary">Your history</Typography.Text> */}

          {/* <Menu
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
           <Row justify="start">
            <Button style={{ margin: "8px 24px" }} onClick={addNew}>
              <PlusOutlined /> Add Publication
            </Button>
          </Row> */}

          <SelectorSidebar
            items={publicationList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Publication[]) => {
              syncPublications(newOrder);
            }}
            addNew={addNew}
            entityTitle="Education"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState({
                selectedPublication: publicationList.filter(
                  (item) => item.id === key
                )[0],
                selectedId: key,
              });
            }}
          />
        </Col>
        <Col
          span={16}
          style={{
            paddingLeft: "24px",
            paddingTop: "24px",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "2rem",
          }}
        >
          {/* {state.selectedPublication && (
              <SinglePublicationForm
                initialValues={state.selectedPublication}
                onFinish={onFinish}
                saveLoading={saveLoading}
              />
            )} */}

          {state.selectedPublication != null ? (
            <>
              {/* <div>
                <Typography.Title level={5}>
                  Publication #{state.selectedPublicationIdx + 1}
                </Typography.Title>
              </div> */}
              <SinglePublicationsFrom
                isNewItem={state.isNewItem}
                key={state.selectedPublication.id}
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

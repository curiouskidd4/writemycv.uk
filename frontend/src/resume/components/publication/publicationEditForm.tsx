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
  const [newItem, setNewItem] = React.useState<Publication | null>(null);

  publicationList = publicationList || [];
  const [state, setState] = React.useState<PublicationState>({
    selectedPublication: publicationList.length > 0 ? publicationList[0] : null,
    // selectedPublicationIdx: publicationList.length > 0 ? 0 : null,
    selectedId: publicationList.length > 0 ? publicationList[0].id : null,
  });

  const onSave = async (publication: Publication) => {
    if (newItem) {
      setNewItem(null);
      publication.date = Timestamp.fromDate(publication.date.toDate());

      await syncPublications([...publicationList, publication]);
    } else {
      publication.date = Timestamp.fromDate(publication.date.toDate());
      const newPublicationList = publicationList.map((item) => {
        if (item.id === publication.id) {
          return publication;
        } else {
          return item;
        }
      });

      await syncPublications(newPublicationList);
      message.success("Publication saved!");

    }
  };

  const addNew = () => {
    const newItem: Publication = {
      id: ObjectID().toHexString(),
      title: "",
      date: Timestamp.fromDate(new Date()),
      description: "",
      link: "",
    };
    setNewItem(newItem);
    setState((prev) => ({
      selectedPublication: newItem,
      // selectedPublicationIdx: publicationList.length,
      selectedId: newItem.id,
      isNewItem: true,
    }));
  };

  const onDelete = async (id: string | undefined) => {
    if (id === newItem?.id) {
      setNewItem(null);
    } else {
      const newPublicationList = publicationList.filter((item) => item.id !== id);
      await syncPublications(newPublicationList);
    }

    setState((prev) => ({
      selectedPublication: null,
      // selectedPublicationIdx: null,
      selectedId: null,
    }));
  }

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
   
          <SelectorSidebar
            items={publicationList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: Publication[]) => {
              syncPublications(newOrder);
            }}
            addNew={addNew}
            entityTitle="Publication"
            selectedKey={state.selectedId}
            onSelect={(key: string) => {
              setState({
                selectedPublication: publicationList.filter(
                  (item) => item.id === key
                )[0],
                selectedId: key,
              });
            }}
            newItem={newItem ? true : false}
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

          {state.selectedPublication != null ? (
            <>

              <SinglePublicationsFrom
                isNewItem={state.isNewItem}
                key={state.selectedPublication.id}
                initialValues={state.selectedPublication}
                onFinish={onSave}
                saveLoading={saveLoading}
                onDelete={() => onDelete(state.selectedPublication?.id)}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default PublicationForm;

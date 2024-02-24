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
//   import "./index.css";
  import SinglePublicationsFrom from "./editForm";
  import { Timestamp } from "firebase/firestore";
  import moment from "moment";
  import SelectorSidebar from "../../../components/selectorSidebar";
  import ObjectID from "bson-objectid";
  
  
  
  type OtherInformationProps = {
    otherInformationList: Publication[];
    saveLoading?: boolean;
    onFinish?: (values: any) => Promise<void>;
    syncOtherInformation: (values: any) => Promise<void>;
    showTitle: boolean;
  };
  
  type OtherInformationState = {
    selected: Publication | null;
    isNewItem?: boolean;
    selectedId: string | null;
  };
  
  const OtherInformation = ({
    otherInformationList,
    saveLoading,
    onFinish,
    syncOtherInformation,
    showTitle = true,
  }: OtherInformationProps) => {
    const [newItem, setNewItem] = React.useState<Publication | null>(null);
  
    otherInformationList = otherInformationList || [];
    const [state, setState] = React.useState<OtherInformationState>({
      selected: otherInformationList.length > 0 ? otherInformationList[0] : null,
      // selectedPublicationIdx: publicationList.length > 0 ? 0 : null,
      selectedId: otherInformationList.length > 0 ? otherInformationList[0].id : null,
    });
  
    const onSave = async (item: Publication) => {
      if (newItem) {
        setNewItem(null);
        item.date = Timestamp.fromDate(item.date.toDate());
  
        await syncOtherInformation([...otherInformationList, item]);
      } else {
        item.date = Timestamp.fromDate(item.date.toDate());
        const newPublicationList = otherInformationList.map((item) => {
          if (item.id === item.id) {
            return item;
          } else {
            return item;
          }
        });
  
        await syncOtherInformation(newPublicationList);
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
        selected: newItem,
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
          <Typography.Title level={4}>Other Information</Typography.Title>
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
              items={otherInformationList}
              detailExtractor={detailExtractor}
              onReorder={(newOrder: Publication[]) => {
                syncOtherInformation(newOrder);
              }}
              addNew={addNew}
              entityTitle="Other Information"
              selectedKey={state.selectedId}
              onSelect={(key: string) => {
                setState({
                  selected: otherInformationList.filter(
                    (item) => item.id === key
                  )[0],
                  selectedId: key,
                });
              }}
              newItem={newItem ? true : false}
              addButtonText={"Section"}
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
  
            {state.selected != null ? (
              <>
  
                <SinglePublicationsFrom
                  isNewItem={state.isNewItem}
                  key={state.selected.id}
                  initialValues={state.selected}
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
  
  export default OtherInformation;
  
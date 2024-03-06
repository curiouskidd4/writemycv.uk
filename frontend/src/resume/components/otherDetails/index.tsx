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
import { OtherInformation } from "../../../types/resume";
//   import "./index.css";
import SingleOtherInformationsFrom from "./editForm";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import SelectorSidebar from "../../../components/selectorSidebar";
import ObjectID from "bson-objectid";
import ConfirmItemDelete from "../../../components/itemDelete";

type OtherInformationProps = {
  otherInformationList: OtherInformation[];
  saveLoading?: boolean;
  onFinish?: (values: any) => Promise<void>;
  syncOtherInformation: (values: any) => Promise<void>;
  showTitle: boolean;
};

type OtherInformationState = {
  selected: OtherInformation | null;
  isNewItem?: boolean;
  selectedId: string | null;
};

const OtherInformationForm = ({
  otherInformationList,
  saveLoading,
  onFinish,
  syncOtherInformation,
  showTitle = true,
}: OtherInformationProps) => {
  const [newItem, setNewItem] = React.useState<OtherInformation | null>(null);

  otherInformationList = otherInformationList || [];
  const [state, setState] = React.useState<OtherInformationState>({
    selected: otherInformationList.length > 0 ? otherInformationList[0] : null,
    // selectedOtherInformationIdx: OtherInformationList.length > 0 ? 0 : null,
    selectedId:
      otherInformationList.length > 0 ? otherInformationList[0].id : null,
  });

  const onSave = async (item: OtherInformation) => {
    if (newItem) {
      setNewItem(null);

      await syncOtherInformation([...otherInformationList, item]);
    } else {
      const newOtherInformationList = otherInformationList.map((item) => {
        if (item.id === item.id) {
          return item;
        } else {
          return item;
        }
      });

      await syncOtherInformation(newOtherInformationList);
      message.success("OtherInformation saved!");
    }
  };

  const addNew = () => {
    const newItem: OtherInformation = {
      id: ObjectID().toHexString(),
      title: "",
      description: "",
    };
    setNewItem(newItem);
    setState((prev) => ({
      selected: newItem,
      selectedId: newItem.id,
      isNewItem: true,
    }));
  };

  const onDelete = async (id: string | undefined) => {

    if (id === newItem?.id) {
      setNewItem(null);
    } else {
      const newOtherInformationList = otherInformationList.filter(
        (item) => item.id !== id
      );
      await syncOtherInformation(newOtherInformationList);
    }

    setState((prev) => ({
      ...prev,
      selected: null,
      selectedId: null,
    }));
  };

  const detailExtractor = (OtherInformation: OtherInformation) => {
    return { title: OtherInformation.title, subtitle: "" };
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
          className="OtherInformation-history-selector  selector-col"
        >
          <SelectorSidebar
            items={otherInformationList}
            detailExtractor={detailExtractor}
            onReorder={(newOrder: OtherInformation[]) => {
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
              <SingleOtherInformationsFrom
                isNewItem={state.isNewItem}
                key={state.selected.id}
                initialValues={state.selected}
                onFinish={onSave}
                saveLoading={saveLoading}
              />
            </>
          ) : null}

          <ConfirmItemDelete
            onDelete={() => onDelete(state.selected?.id)}
            text="Delete Information"
          />
        </Col>
      </Row>
    </>
  );
};

export default OtherInformationForm;

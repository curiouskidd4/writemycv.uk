import React, { useEffect } from "react";
import { Publication } from "../../../../types/resume";
import SinglePublicationForm from "./editForm";
import { Button, Row, Space, Typography, Col, Menu, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { Timestamp } from "firebase/firestore";

const PublicationCard = ({ publication }: { publication: Publication }) => {
  let publicationDateStr = moment(publication.date.toDate()).format("MMM YYYY");
  return (
    <Row className="menu-card-details">
      <div className="title">{publication.title}</div>
      <div className="subtitle">{publicationDateStr}</div>
    </Row>
  );
};

const PublicationMenu = ({
  selectedIdx,
  publicationList,
  addNew,
  onChange,
}: {
  selectedIdx?: number | null;
  publicationList: Publication[];
  addNew: () => void;
  onChange: (idx: number) => void;
}) => {
  useEffect(() => {
    if (
      selectedIdx === null ||
      selectedIdx === undefined ||
      selectedIdx == state.selectedPublicationIdx
    ) {
      return;
    }
    if (selectedIdx < publicationList.length) {
      setState((prev) => ({
        ...prev,
        selectedPublication: publicationList[selectedIdx],
        selectedPublicationIdx: selectedIdx,
      }));
    }
  }, [selectedIdx, publicationList]);

  type PublicationState = {
    selectedPublication: Publication | null;
    selectedPublicationIdx: number | null;
  };
  const [state, setState] = React.useState<PublicationState>({
    selectedPublication: null,
    selectedPublicationIdx: null,
  });

  return (
    <div className="publication-history-selector menu-selector">
      {/* <Typography.Title level={5}>Publication Items</Typography.Title> */}
      <Typography.Text type="secondary">Your history</Typography.Text>
      {publicationList.length == 0 ? (
        <Empty
          className="empty-content"
          description={
            <Typography.Text type="secondary">Nothing here</Typography.Text>
          }
        />
      ) : (
        <Menu
          className="publication-menu menu-content"
          defaultSelectedKeys={
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
          onChange(parseInt(item.key));

          }}
          selectedKeys={
            state.selectedPublicationIdx != undefined
              ? [state.selectedPublicationIdx.toString()]
              : undefined
          }
          items={publicationList.map((edu, idx) => {
            return {
              key: idx.toString(),
              label: <PublicationCard publication={edu} />,
              //   label: edu.degree,
            };
          })}
        ></Menu>
      )}
      <Row justify="center">
        <Button style={{ width: "90%", margin: "8px auto" }} onClick={addNew}>
          <PlusOutlined /> Add Publication
        </Button>
      </Row>
    </div>
  );
};

type PublicationIteratorProps = {
  publicationList: Publication[];
  onFinish: () => void;
  syncPublication: (publicationList: Publication[]) => Promise<void>;
};

type PublicationIteratorState = {
  currentEditIdx: number | null;
  finished: boolean;
  loading: boolean;
};
const PublicationIterator = ({
  publicationList,
  onFinish,
  syncPublication,
}: PublicationIteratorProps) => {
  const [state, setState] = React.useState<PublicationIteratorState>({
    currentEditIdx: null,
    finished: false,
    loading: false,
  });

  const savePublication = async (publication: Publication) => {
    if (state.currentEditIdx === null) {
      return;
    }

    let newPublicationList = [...publicationList];
    // Add new case
    if (state.currentEditIdx === publicationList.length) {
      newPublicationList = [...newPublicationList, publication];
    }
    newPublicationList = newPublicationList.map((item, idx) => {
      if (idx === state.currentEditIdx) {
        return {
          ...publication,
          date: Timestamp.fromDate(publication.date.toDate()),
        };
      }
      return item;
    });

    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    await syncPublication(newPublicationList);
    setState((prev) => ({
      ...prev,
      loading: false,
      finished: prev.currentEditIdx === publicationList.length - 1,
      currentEditIdx: prev.currentEditIdx === null ? null : prev.currentEditIdx,
    }));
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <PublicationMenu
          selectedIdx={state.currentEditIdx}
          publicationList={publicationList}
          addNew={() => {
            setState((prev) => ({
              ...prev,
              currentEditIdx: publicationList.length,
            }));
          }}
          onChange={(idx) => {
            setState((prev) => ({
              ...prev,
              currentEditIdx: idx,
            }));
          }}
        />
      </Col>
      <Col span={16}>
        {state.currentEditIdx != null ? (
          <div className="detail-form-body">
            <div className="cv-input">
              <Space direction="vertical">
                <Row>
                  <Col>
                    <Typography.Text strong>
                      {publicationList[state.currentEditIdx]?.title || "New Publication"}
                    </Typography.Text>
                  </Col>
                  {/* <Col style={{ marginLeft: "auto" }}>
                    <Typography.Text strong>
                      {state.currentEditIdx + 1} / {publicationList.length}
                    </Typography.Text>
                  </Col> */}
                </Row>
                <SinglePublicationForm
                  initialValues={publicationList[state.currentEditIdx] || {}}
                  onFinish={savePublication}
                />
              </Space>
            </div>
          </div>
        ) : null}
      </Col>
    </Row>
  );
};

export default PublicationIterator;

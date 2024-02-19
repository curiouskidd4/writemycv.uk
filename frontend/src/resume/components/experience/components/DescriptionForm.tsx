import {
  Button,
  Col,
  Divider,
  Modal,
  Popover,
  Row,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import EditorJsInput from "../../../../components/editor";
import { BulbOutlined } from "@ant-design/icons";
import CustomCarousel from "../../../../components/suggestionCarousel";
import CVWizardBox from "../../../../components/cvWizardBoxV2";
import {
  AIWizardIcon,
  DeleteIcon,
  EditIcon,
  LightBulbIcon,
  MagicWandIcon,
  RepharseIcon,
} from "../../../../components/faIcons";
import openAI from "../../../../hooks/openai";
import ReactMarkdown from "react-markdown";
import CVWizardBadge from "../../../../components/cvWizardBadge";

type DescriptionFormProps = {
  initialValues?: any;
  onChange: (values: any) => void;
  saveLoading?: boolean;
};
export const DescriptionForm = ({
  initialValues,
  onChange,
}: DescriptionFormProps) => {
  const [description, setDescription] = React.useState(
    initialValues?.description || ""
  );
  const [showAIWizard, setShowAIWizard] = React.useState(false);

  const descriptionHelper = openAI.useExperienceHelper();

  const loadSuggestions = async ({
    employerName,
    position,
    existingDesscription,
    rewrite,
  }: {
    employerName: string;
    position: string;
    existingDesscription?: string;
    rewrite: boolean;
  }) => {
    setShowAIWizard(true);
    await descriptionHelper.suggestDescription({
      experienceOrg: employerName,
      experienceRole: position,
      rewrite: rewrite,
      existingSummary: existingDesscription,
    });
  };

  const onAddDescription = (value: string) => {
    setDescription(value);
  };

  useEffect(() => {
      onChange({
        description: description,
      });
  }, [description]);

  return (
    <>
      <Modal
        width={800}
        visible={showAIWizard}
        footer={null}
        onCancel={() => setShowAIWizard(false)}
        className="default-modal"
      >
        <CVWizardBadge />
        <div
          style={{
            margin: "1rem 0rem",
            font: "normal normal bold 24px/12px DM Sans",
          }}
        >
          Description Suggestion
        </div>
        {descriptionHelper.loading && (
          <div className="spin-container" style={{ height: "100px" }}>
            <Spin />
          </div>
        )}

        {descriptionHelper.loading === false &&
          descriptionHelper.descriptionSuggestions &&
          descriptionHelper.descriptionSuggestions.results.length > 0 && (
            <>
              <div
                style={{
                  margin: "1rem 0rem",
                  font: "normal normal normal 16px/24px DM Sans",
                }}
              >
                Select any of the following suggestions
              </div>
              <div>
                {descriptionHelper.descriptionSuggestions?.results?.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="openai-generated-content-item"
                      onClick={() => {
                        onAddDescription(item);
                        setShowAIWizard(false);
                      }}
                    >
                      <ReactMarkdown>{item}</ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            </>
          )}
      </Modal>
      <div className="profile-tab-detail">
        <div className="user-input-area">
          <div className="profile-input-section-title">
            <Typography.Text>Description</Typography.Text>

            <Popover
              trigger="click"
              content={
                <Space direction="vertical">
                  <Button
                    type="text"
                    // size="small"
                    style={{
                      height: "auto",
                      textAlign: "left",
                    }}
                    disabled={
                      description && description.length > 20 ? false : true
                    }
                    onClick={() => {
                      loadSuggestions({
                        employerName: initialValues?.employerName,
                        position: initialValues?.position,
                        rewrite: true,
                        existingDesscription: description,
                      });
                    }}
                  >
                    <Typography.Text strong>
                      {" "}
                      <RepharseIcon /> Optimize
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      Rephrase and optimize your current description
                    </Typography.Text>
                  </Button>
                  <Button
                    type="text"
                    style={{
                      height: "auto",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onClick={() => {
                      loadSuggestions({
                        employerName: initialValues?.employerName,
                        position: initialValues?.position,
                        rewrite: false,
                      });
                    }}
                  >
                    <Typography.Text strong>
                      {" "}
                      <LightBulbIcon /> Generate new ideas
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      Get new ideas for the desciption
                    </Typography.Text>
                  </Button>
                </Space>
              }
            >
              <Button type="link">
                <AIWizardIcon />
              </Button>
            </Popover>
          </div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Row gutter={24} className="description-input">
              <div className="description-options">
                <Space
                  size="small"
                  direction="horizontal"
                  split={
                    <Divider
                      type="vertical"
                      style={{
                        height: "24px",
                        margin: "0 0rem",
                        borderInlineStart: "1px solid var(--black)",
                        borderBlockStart: "1px solid var(--black)",
                      }}
                    />
                  }
                >
                  <Button
                    type="link"
                    size="small"
                    // onClick={loadSuggestions}
                    onClick={() => {
                      loadSuggestions({
                        employerName: initialValues?.employerName,
                        position: initialValues?.position,
                        rewrite: true,
                        existingDesscription: description,
                      });
                    }}
                  >
                    <MagicWandIcon color="var(--black)" marginRight="0px" />
                  </Button>
                  {/* <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      // onEditAchievement(item.id!);
                    }}
                  >
                    <EditIcon color="var(--black)" marginRight="0px" />
                  </Button> */}
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={() => setDescription("")}
                  >
                    <DeleteIcon color="var(--black)" marginRight="0px" />
                  </Button>
                </Space>
              </div>
              <Col span={24}>
                <EditorJsInput
                  value={description}
                  onChange={(value: any) => {
                    setDescription(value);
                  }}
                />
              </Col>
            </Row>
          </Space>
        </div>
        <div className="ai-wizard-area">
          <CVWizardBox
            title="Description Tip"
            // subtitle="Highlighting your key achievements here, like awards, dissertations or projects"
            subtitle="Use this section to add details of scholarships / awards, dissertations / projects and any other relevant information."
            actions={[
              <Button
                className="black-button-small"
                type="primary"
                onClick={() =>
                  loadSuggestions({
                    employerName: initialValues?.employerName,
                    position: initialValues?.position,
                    rewrite: false,
                  })
                }
              >
                {" "}
                <MagicWandIcon color="var(--white)" />
                Generate Ideas
              </Button>,
            ]}
          >
            {/* <Typography.Text type="secondary">
              <MagicWandIcon /> CV Wizard Suggestions:
            </Typography.Text>
            {descriptionHelper.loading && <Skeleton active></Skeleton>}
            {descriptionHelper.loading === false &&
              descriptionHelper.descriptionSuggestions!.results.length > 0 && (
                // <Carousel>
                //   {descriptionHelper.descriptionSuggestions!.results.map(
                //     (item: any, idx: number) => (
                //       <div
                //         className="openai-generated-content-item"
                //         onClick={() => onAddDescription(item)}
                //       >
                //         {item}
                //       </div>
                //     )
                //   )}
                // </Carousel>
                <CustomCarousel
                  suggestions={
                    descriptionHelper.descriptionSuggestions!.results
                  }
                  onClick={(item: any) => onAddDescription(item)}
                />
              )} */}

            <div>Stuck for ideas describing your experience? Try CV Wizard</div>
            <div></div>
          </CVWizardBox>
        </div>
      </div>
    </>
  );
};

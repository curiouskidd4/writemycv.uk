import { Button, Col, Divider, Modal, Popover, Row, Skeleton, Space, Spin, Typography } from "antd";
import React, { useEffect } from "react";
import EditorJsInput from "../../../../components/editor";
import { BulbOutlined } from "@ant-design/icons";
import openAI from "../../../../hooks/openai";
import {
  AIWizardIcon,
  DeleteIcon,
  LightBulbIcon,
  MagicWandIcon,
  RepharseIcon,
} from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBoxV2";
import CustomCarousel from "../../../../components/suggestionCarousel";
import { on } from "events";
import ReactMarkdown from "react-markdown";
import CVWizardBadge from "../../../../components/cvWizardBadge";

type DescriptionFormProps = {
  value?: any;
  onChange: (values: any) => void;
  saveLoading?: boolean;
};
export const DescriptionForm = ({ value, onChange }: DescriptionFormProps) => {
  const [description, setDescription] = React.useState(
    value?.description || ""
  );

  const [showAIWizard, setShowAIWizard] = React.useState(false);

  const descriptionHelper = openAI.useEducationHelper();

  const loadSuggestions = async ({
    school,
    degree,
    existingDesscription,
    rewrite,
  }: {
    school: string;
    degree: string;
    existingDesscription?: string;
    rewrite: boolean;
  }) => {
    setShowAIWizard(true);
    await descriptionHelper.suggestDescription({
      school: school,
      degree: degree,
      rewrite: rewrite,
      existingSummary: existingDesscription,
    });
  };


  useEffect(() => {
    onChange({
      description: description,
    });
  }, [description]);

  const onAddDescription = (value: string) => {
    setDescription(value);
  };

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
                      }
                    }
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
          <Typography.Text strong>Description</Typography.Text>
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
                      school: value?.school,
                      degree: value?.degree,
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
                      school: value?.school,
                      degree: value?.degree,
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

        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", paddingRight: "1rem" }}
        >
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
                        school: value?.school,
                        degree: value?.degree,
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
                    onClick={ () => setDescription("")}

                    
                  >
                    <DeleteIcon color="var(--black)" marginRight="0px" />
                  </Button>
                </Space>
              </div>
            <Col span={24}>
              <Row>
                <Col
                  style={{
                    marginLeft: "auto",
                  }}
                ></Col>
              </Row>
              {/* <Row>
                <Typography.Text type="secondary">
                  <BulbOutlined />
                  List further achievements here, such as scholarships, awards,
                  the title of your dissertation and / or key projects. Try CV
                  wizard to get more ideas.
                </Typography.Text>
              </Row> */}

              <EditorJsInput
                value={description}
                onChange={(value: any) => {
                  setDescription(value);
                }}
              />
            </Col>
          </Row>
          {/* <Button type="primary" htmlType="submit" onClick={onSave}>
          Save
        </Button> */}
        </Space>
      </div>
      <div className="ai-wizard-area">
        <Row>
          <CVWizardBox
            title="Tip"
            subtitle="Highlight key achievements, such as awards, scholarships, dissertations, and key projects. Experienced professionals can skip this step."
            actions={[
              <Button
                className="black-button-small"
                type="primary"
                onClick={() =>
                  loadSuggestions({
                    school: value?.school,
                    degree: value?.degree,
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
                CV Wizard Suggestions:
              </Typography.Text>
              {descriptionHelper.loading && <Skeleton active></Skeleton>}
              {descriptionHelper.loading === false &&
                descriptionHelper.descriptionSuggestions!.results.length >
                  0 && (
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
            <div>Stuck for ideas describing your education? Try CV Wizard</div>
            <div></div>
          </CVWizardBox>
        </Row>
      </div>
    </div>
    </>
  );
};

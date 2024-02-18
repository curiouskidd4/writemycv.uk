import { Button, Col, Popover, Row, Skeleton, Space, Typography } from "antd";
import React, { useEffect } from "react";
import EditorJsInput from "../../../../components/editor";
import { BulbOutlined } from "@ant-design/icons";
import openAI from "../../../../hooks/openai";
import {
  AIWizardIcon,
  LightBulbIcon,
  MagicWandIcon,
  RepharseIcon,
} from "../../../../components/faIcons";
import CVWizardBox from "../../../../components/cvWizardBoxV2";
import CustomCarousel from "../../../../components/suggestionCarousel";
import { on } from "events";

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

  // useEffect(() => {
  //   // console.log(initialValues);
  //   setDescription(value?.description || "");
  // }, [value]);

  useEffect(() => {
    onChange({
      description: description,
    });
  }, [description, onChange]);

  const onAddDescription = (value: string) => {
    setDescription(value);
  };


  return (
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
          <Row gutter={24}>
            <Col span={24}>
              <Row>
                <Col
                  style={{
                    marginLeft: "auto",
                  }}
                ></Col>
              </Row>
              <Row>
                <Typography.Text type="secondary">
                  <BulbOutlined />
                  List further achievements here, such as scholarships, awards,
                  the title of your dissertation and / or key projects. Try CV
                  wizard to get more ideas.
                </Typography.Text>
              </Row>

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
          {showAIWizard ? (
            <CVWizardBox
              title="Description Tip"
              subtitle="Highlighting your key achievements here, like awards, dissertations or projects"
            >
              <Typography.Text type="secondary">
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
                )}
            </CVWizardBox>
          ) : null}
        </Row>
      </div>
    </div>
  );
};

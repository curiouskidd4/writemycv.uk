import {
  Button,
  Col, Popover,
  Row, Skeleton,
  Space, Typography
} from "antd";
import React, { useEffect } from "react";
import EditorJsInput from "../../../../components/editor";
import { BulbOutlined } from "@ant-design/icons";
import CustomCarousel from "../../../../components/suggestionCarousel";
import CVWizardBox from "../../../../components/cvWizardBox";
import { LightBulbIcon, MagicWandIcon, RepharseIcon } from "../../../../components/faIcons";
import openAI from "../../../../hooks/openai";

type DescriptionFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};
export const DescriptionForm = ({ initialValues, onFinish }: DescriptionFormProps) => {
  const [description, setDescription] = React.useState(
    initialValues?.description || ""
  );

  const [showAIWizard, setShowAIWizard] = React.useState(false);

  const descriptionHelper = openAI.useExperienceHelper();

  const loadSuggestions = async ({
    employerName, position, existingDesscription, rewrite,
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

  useEffect(() => {
    // console.log(initialValues);
    setDescription(initialValues?.description || "");
  }, [initialValues]);

  const onAddDescription = (value: string) => {
    setDescription(value);
  };

  const onSave = () => {
    if (onFinish) {
      onFinish({
        description: description,
      });
    }
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row gutter={24}>
          <Col span={24}>
            <Row>
              <Col>
                <Typography.Title level={5}>Description</Typography.Title>
              </Col>
              <Col
                style={{
                  marginLeft: "auto",
                }}
              >
                <Popover
                  trigger="click"
                  content={<Space direction="vertical">
                    <Button
                      type="text"
                      // size="small"
                      style={{
                        height: "auto",
                        textAlign: "left",
                      }}
                      disabled={description && description.length > 20 ? false : true}
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
                  </Space>}
                >
                  <Button type="link" size="small">
                    <MagicWandIcon /> Write with CV Wizard
                  </Button>
                </Popover>
              </Col>
            </Row>
            <Row>
              <Typography.Text type="secondary">
                <BulbOutlined />
                Tip: Write 2-3 sentences which provide the reader with a
                clear understanding of your role, including what you are
                responsible for and the overall impact you made in the role.
                If relevant, include how you progressed, and the size of
                your team and budget. Stuck for ideas describing your role?
                Try CV Wizard – it can refine your summary or create you a
                new one based on your job title.
              </Typography.Text>
            </Row>
            <Row>
              {showAIWizard ? (
                <CVWizardBox>
                  <Typography.Text type="secondary">
                    <MagicWandIcon /> CV Wizard Suggestions:
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
                        suggestions={descriptionHelper.descriptionSuggestions!.results}
                        onClick={(item: any) => onAddDescription(item)} />
                    )}
                </CVWizardBox>
              ) : null}
            </Row>
            <EditorJsInput
              value={description}
              onChange={(value: any) => {
                setDescription(value);
              }} />
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" onClick={onSave}>
          Save
        </Button>
      </Space>
    </>
  );
};

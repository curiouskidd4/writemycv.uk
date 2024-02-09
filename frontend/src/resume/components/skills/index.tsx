import React, { useEffect } from "react";
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
// import { useOpenAI } from "../../../utils";
import { APIErrorIcon, MagicWandIcon } from "../../../components/faIcons";
import {
  PlusOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Skill } from "../../../types/resume";
import useOpenAI from "../../../hooks/openai";
import CVWizardBox from "../../../components/cvWizardBoxV2";

const SkillItem = ({
  skill,
  onChange,
  onRemove,
}: {
  skill: Skill;
  onChange: (value: Skill) => void;
  onRemove: () => void;
}) => {
  return (
    <Row className="skill-item-wrapper" align="middle">
      <Row className="skill-item">
        <Typography.Text>{skill.name}</Typography.Text>
      </Row>
      <Button
        type="link"
        style={{
          color: "var(--black)",
        }}
        onClick={() => {
          onRemove();
        }}
      >
        <i className="fa-solid fa-trash-can"></i>
      </Button>

      {/* <Col>
        <Select
          placeholder="Select Level"
          value={skill.level}
          onChange={(value) => {
            onChange({
              ...skill,
              level: value,
            });
          }}
          style={{
            width: "150px",
          }}
        >
          <Select.Option value="Beginner">Beginner</Select.Option>
          <Select.Option value="Intermediate">Intermediate</Select.Option>
          <Select.Option value="Expert">Expert</Select.Option>
        </Select>
      </Col>
      <Col>
        <Button
          danger
          type="link"
          onClick={() => {
            onRemove();
          }}
        >
          <DeleteOutlined />
        </Button>
      </Col> */}
    </Row>
  );
};

type SkillFlowProps = {
  skillList: Skill[];
  onFinish?: () => void;
  syncSkills: (skills: Skill[]) => Promise<void>;
  showTitle?: boolean;
};
const SkillFlow = ({
  skillList,
  onFinish,
  syncSkills,
  showTitle = true,
}: SkillFlowProps) => {
  const [showAdd, setShowAdd] = React.useState(false);

  const [state, setState] = React.useState({
    skillList: skillList,
    skillText: "",
    loading: false,
  });
  const skillHelper = useOpenAI.useSkillHelper();

  const existingSkills = state.skillList.map((s) => s.name);
  useEffect(() => {
    skillHelper.getSuggestions({
      existingSkills: existingSkills,
    });
  }, []);

  const onSave = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    await syncSkills(state.skillList);
    if (onFinish) {
      await onFinish();
    }
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  };

  const addSkill = (skillName: string) => {
    setState((prev) => ({
      ...prev,
      skillList: [
        {
          name: skillName,
          level: "Expert",
        },
        ...prev.skillList,
      ],
    }));
  };

  const removeSkill = (idx: number) => {
    setState((prev) => ({
      ...prev,
      skillList: prev.skillList.filter((_, i) => i !== idx),
    }));
  };

  const updateSkill = (idx: number, skill: Skill) => {
    setState((prev) => ({
      ...prev,
      skillList: prev.skillList.map((s, i) => {
        if (i === idx) {
          return skill;
        }
        return s;
      }),
    }));
  };

  return (
    <div className="resume-edit-detail padding">
      {showTitle && (
        <div className="detail-form-header">
          <Typography.Title level={4}>Skills</Typography.Title>
        </div>
      )}
      <div className="detail-form-body">
        {/* <Row>
          <Input
            size="large"
            placeholder="Add a skill"
            style={{
              width: "200px",
            }}
            value={state.skillText}
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                skillText: e.target.value,
              }));
            }}
            suffix={<ArrowRightOutlined />}
            onPressEnter={(e) => {
              addSkill(e.currentTarget.value);
              setState((prev) => ({
                ...prev,
                skillText: "",
              }));
            }}
          />
        </Row> */}
        {/* <Row
          style={{
            marginTop: "24px",
            minHeight: "200px",
          }}
        >
          <Space
            direction="vertical"
            wrap
            style={{
              width: "100%",
            }}
          >
            <Row>
              <CVWizardBox>
                <Typography.Text type="secondary">
                  <MagicWandIcon /> CV Wizard Suggestions:
                </Typography.Text>
                {skillHelper.loading && <Skeleton active></Skeleton>}

                {skillHelper.suggestions &&
                  skillHelper.suggestions!.results.length > 0 && (
                    <Row
                      style={{
                        marginTop: "12px",
                      }}
                      gutter={[6, 6]}
                    >
                      {skillHelper
                        .suggestions!.results.filter(
                          (s) => !existingSkills.includes(s)
                        )
                        .map((item: any, idx: number) => (
                          <Col key={idx}>
                            <Button
                              size="small"
                              onClick={() => {
                                addSkill(item);
                              }}
                            >
                              <PlusOutlined />
                              {item}
                            </Button>
                          </Col>
                        ))}
                    </Row>
                  )}
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "12px",
                  }}
                >
                  {skillHelper.error && (
                    <>
                      <APIErrorIcon />
                      <Typography.Text type="danger">
                        Unable to load suggestions: {skillHelper.error}
                      </Typography.Text>
                    </>
                  )}
                </div>
              </CVWizardBox>
            </Row>
          </Space>
        </Row> */}
        <div className="profile-tab-detail">
          <div className="user-input-area">
            <Row>
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
                size="large"
              >
                {state.skillList.map((skill, idx) => (
                  <SkillItem
                    key={idx}
                    skill={skill}
                    onChange={(value) => {
                      updateSkill(idx, value);
                    }}
                    onRemove={() => {
                      removeSkill(idx);
                    }}
                  />
                ))}
                {showAdd ? (
                  <Row align="middle">
                    <Input
                      className="skill-input"
                      suffix={<i className="fa-solid fa-arrow-right"></i>}
                      onPressEnter={(e) => {
                        addSkill(e.currentTarget.value);
                        setShowAdd(false);
                      }}
                    />
                    <Button
                      type="link"
                      style={{
                        color: "var(--black)",
                      }}
                      onClick={() => setShowAdd(false)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </Button>
                  </Row>
                ) : (
                  <Button
                    type="link"
                    className="small-link-btn"
                    onClick={() => setShowAdd(true)}
                  >
                    <i className="fa-solid fa-plus"></i> Add Skill
                  </Button>
                )}
              </Space>
            </Row>
            <Row style={{ marginTop: "24px" }}>
              <Button
                type="primary"
                loading={state.loading}
                onClick={() => {
                  onSave();
                }}
              >
                Save
              </Button>
            </Row>
          </div>
          <div className="ai-wizard-area">
            <CVWizardBox
              title="Add skills"
              subtitle="List all your skills to add them in future resumes"
            >
              <Typography.Text type="secondary">
              Try the following suggestions:
              </Typography.Text>
              {skillHelper.loading && <Skeleton active></Skeleton>}

              {skillHelper.suggestions &&
                skillHelper.suggestions!.results.length > 0 && (
                  <Row
                    style={{
                      marginTop: "12px",
                    }}
                    gutter={[6, 6]}
                  >
                    {skillHelper
                      .suggestions!.results.filter(
                        (s) => !existingSkills.includes(s)
                      )
                      .map((item: any, idx: number) => (
                        <Col key={idx}>
                          <Button
                            size="small"
                            onClick={() => {
                              addSkill(item);
                            }}
                          >
                            <PlusOutlined />
                            {item}
                          </Button>
                        </Col>
                      ))}
                  </Row>
                )}
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "12px",
                }}
              >
                {skillHelper.error && (
                  <>
                    <APIErrorIcon />
                    <Typography.Text type="danger">
                      Unable to load suggestions: {skillHelper.error}
                    </Typography.Text>
                  </>
                )}
              </div>
            </CVWizardBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillFlow;

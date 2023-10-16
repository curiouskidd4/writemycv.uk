import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  Form,
  Input,
  Button,
  Row,
  DatePicker,
  Typography,
  Col,
  Skeleton,
  message,
  Select,
  Space,
  Spin,
} from "antd";
import EditorJsInput from "../../../components/editor";
import { useAuth } from "../../../authContext";
import {
  MinusCircleOutlined,
  PlusOutlined,
  BulbOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDoc, useMutateDoc } from "../../../firestoreHooks";
import dayjs from "dayjs";
import { objectId } from "../../../helpers";
import { useOpenAI } from "../../../utils";
import { MagicWandIcon } from "../../../components/faIcons";

const SkillPreview = ({ form, skill, field }) => {
  return (
    <div className="education-preview">
      <div className="preview-value">
        <Typography.Text strong>
          {" "}
          {skill.name || "(Not Specified)"}
        </Typography.Text>
      </div>
      <div className="preview-value">
        <Typography.Text type="secondary"> {skill.level}</Typography.Text>
      </div>
    </div>
  );
};

const SingleSkillForm = ({ field, form, remove, resetEditIndex }) => {
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  return (
    <>
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "name"]}
            label="Skill"
            fieldKey={[field.fieldKey, "school"]}
            rules={[
              {
                required: true,
                message: "Please input Skill!",
              },
            ]}
          >
            <Input placeholder="Skill Name" />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "level"]}
            label="Level"
            fieldKey={[field.fieldKey, "level"]}
            rules={[
              {
                required: true,
                message: "Please enter level!",
              },
            ]}
          >
            <Select placeholder="Select Level">
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Expert">Expert</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col>
          <Button
            size="small"
            onClick={() => {
              // Validate fields to show error message
              form
                .validateFields(["educationList"])
                .then((values) => {
                  resetEditIndex();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Done
          </Button>
        </Col>
        <Col>
          <Button
            size="small"
            onClick={() => {
              remove(field.name);
              resetEditIndex();
            }}
          >
            <DeleteOutlined />
            Remove
          </Button>
        </Col>
      </Row>
    </>
  );
};

const SkillForm_ = ({ form, fields, add, remove, move }) => {
  const [state, setState] = useState({
    updateItemIdx: null,
    hoverItemIdx: null,
  });

  const addNewItem = () => {
    add({
      id: objectId(),
      level: "Expert",
    });
    setState({ ...state, updateItemIdx: fields.length });
  };

  const onReset = () => {
    // form.resetFields();
  };

  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    move(result.source.index, result.destination.index);
  };

  return (
    <>
      <div style={{ margin: "1rem 0rem" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                //   style={getListStyle(snapshot.isDraggingOver)}
              >
                {fields.map((field, index) => (
                  <Draggable
                    key={index}
                    draggableId={`draggable${field.name}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        className="draggable-form-wrapper"
                        onMouseEnter={() => {
                          setState((prev) => ({
                            ...prev,
                            hoverItemIdx: index,
                          }));
                        }}
                        onMouseLeave={() => {
                          setState((prev) => ({
                            ...prev,
                            hoverItemIdx: null,
                          }));
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div key={index} className="education-form">
                          <Row
                            // style={{ marginBottom: 8 }}
                            align="middle"
                          >
                            <div
                              style={{ color: "grey", marginBottom: ".5rem" }}
                            >
                              {/* <div
                                style={{
                                  display: "inline-block",
                                  width: "1rem",
                                }}
                              >
                                <HolderOutlined
                                  style={{
                                    display:
                                      state.hoverItemIdx == index
                                        ? "inline-block"
                                        : "none",
                                  }}
                                  {...provided.dragHandleProps}
                                />
                              </div> */}
                              <span>Skill #{index + 1}</span>
                            </div>
                            <div
                              style={{ marginLeft: "auto", display: "flex" }}
                            >
                              <HolderOutlined
                                style={{
                                  display:
                                    state.hoverItemIdx == index
                                      ? "flex"
                                      : "none",
                                }}
                                className="hover-outlined-button"
                                {...provided.dragHandleProps}
                              />
                              <Button
                                type="link"
                                style={{ marginLeft: "auto" }}
                                onClick={() => {
                                  if (state.updateItemIdx == index) {
                                    setState((prev) => ({
                                      ...prev,
                                      updateItemIdx: null,
                                    }));
                                  } else {
                                    setState((prev) => ({
                                      ...prev,
                                      updateItemIdx: index,
                                    }));
                                  }
                                }}
                              >
                                {index == state.updateItemIdx ? (
                                  <UpOutlined />
                                ) : (
                                  <DownOutlined />
                                )}
                              </Button>
                            </div>
                          </Row>
                          {/* <Row key={field.key} style={{ marginBottom: 8 }} align="middle"> */}
                          {index == state.updateItemIdx ? (
                            <SingleSkillForm
                              field={field}
                              form={form}
                              remove={remove}
                              resetEditIndex={() => {
                                setState((prev) => ({
                                  ...prev,
                                  updateItemIdx: null,
                                }));
                              }}
                            />
                          ) : (
                            <div
                              key={index}
                              className="project-outcome-preview"
                            >
                              <SkillPreview
                                skill={form.getFieldValue([
                                  "skillList",
                                  field.name,
                                ])}
                                field={field}
                              />
                              {/* {state.updateItemIdx == null && (
                  <Button
                    size="small"
                    onClick={() =>
                      setState((prev) => ({ ...prev, updateItemIdx: index }))
                    }
                  >
                    Edit
                  </Button>
                )} */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* {state.updateItemIdx == null && ( */}
          <Button
            type="text"
            onClick={addNewItem}
            block
            icon={<PlusOutlined />}
          >
            Add Skill
          </Button>
          {/* )} */}
        </DragDropContext>
      </div>
    </>
  );
};

const SkillForm = ({ onFinish, initialValues, isLoading }) => {
  const [form] = Form.useForm();

  const openai = useOpenAI();

  useEffect(() => {
    openai.getSkills({
      // role: "Machine Learning Engineer",
    });
  }, []);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        skillList: initialValues,
      }}
      onChange={(values) => {
        console.log("values", values);
      }}
      scrollToFirstError
      layout="vertical"
    >
      <Row>
        <Space direction="horizontal" wrap>
          {openai.loading && <Spin></Spin>}
          {!openai.loading && (
            <>
              <Typography.Text type="secondary">
                {" "}
                <MagicWandIcon /> CV Wizard Suggestions:
              </Typography.Text>

              {openai.data?.results?.map((skill) => (
                <Button
                  size="small"
                  onClick={() => {
                    form.setFieldsValue({
                      skillList: [
                        ...form.getFieldValue("skillList"),
                        {
                          name: skill,
                          level: "Expert",
                        },
                      ],
                    });
                  }}
                >
                  <PlusOutlined />
                  {skill}
                </Button>
              ))}
            </>
          )}
        </Space>
      </Row>
      <Form.List name="skillList">
        {(fields, { add, remove, move }) => (
          <>
            <SkillForm_
              fields={fields}
              add={add}
              remove={remove}
              form={form}
              move={move}
            />
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Save
        </Button>
        {/* <Button htmlType="button" onClick={onReset}>
          Reset
        </Button> */}
      </Form.Item>
    </Form>
  );
};
const SkillSection = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const skill = useDoc("skill", user.uid);
  const createUpdateDoc = useMutateDoc("skill", user.uid, true);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    createUpdateDoc
      .mutate({
        skillList: values.skillList,
        createdAt: skill.data?.createdAt || new Date(),
        updatedAt: new Date(),
        userId: user.uid,
      })
      .then(() => {
        message.success("Skill Saved");
      })
      .catch((err) => {
        message.error("Something went wrong");
      });
  };

  let initialValues = skill.data?.skillList || [];

  let tags = ["Tensorflow", "Pytorch", "Natural Language Processing"];

  return (
    <div>
      <Typography.Title level={3}>Skill</Typography.Title>
      <Typography.Text type="secondary">
        Select five essential skills that demonstrate your suitability for the
        role. Ensure they align with the primary skills highlighted in the job
        description, particularly when submitting through an online platform.
      </Typography.Text>
      {/* <Row
        style={{
          margin: "0.5rem 0rem",
        }}
      >
        <Space>
          {tags.map((tag) => (
            <Button size="small">
              {tag}
              <PlusOutlined />
            </Button>
          ))}
        </Space>
      </Row> */}
      {skill.loading ? <Skeleton /> : null}
      {!skill.loading && (
        <SkillForm
          onFinish={onFinish}
          initialValues={initialValues}
          isLoading={createUpdateDoc.isLoading}
        />
      )}
    </div>
  );
};

export { SkillSection, SkillForm };

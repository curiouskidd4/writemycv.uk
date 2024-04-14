import React, { useState } from "react";
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
  Popover,
  Space,
  Modal,
} from "antd";
import EditorJsInput from "../../../components/editor";
import { useAuth } from "../../../contexts/authContext";
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
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";
import showdown from "showdown";
import Achievements from "./achievements";
import CustomDateRange from "../../../components/dateRange";
import { MagicWandIcon, MagicWandLoading } from "../../../components/faIcons";
import Markdown from "react-markdown";

const FormLabelWithAIActions = ({
  jobTitle,
  employerName,
  onAddDescription,
  description,
  label,
}) => {
  // AI Actions helper
  const [state, setState] = useState({
    modalVisible: false,
    mode: null,
  });

  let openai = useOpenAI();
  const handleGenSummary = () => {
    setState({ ...state, modalVisible: true, mode: "summary" });
    openai.getExperienceSummary({
      experienceRole: jobTitle,
      experienceOrg: employerName,
      // role: "machine learning engineer",
      existingSummary: description,
    });
  };

  const handleRewrite = () => {
    setState({ ...state, modalVisible: true, mode: "rewrite" });
    openai.getExperienceSummary({
      experienceRole: jobTitle,
      experienceOrg: employerName,
      // role: "machine learning engineer",
      existingSummary: description,
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  const onModalClose = () => {
    setState({ ...state, modalVisible: false, mode: null });
  };

  const onSelectDescription = (value) => {
    onAddDescription(value);
    onModalClose();
  };

  // AI Actions helper
  return (
    <>
      <Modal
        width={600}
        closeIcon={true}
        open={state.modalVisible}
        footer={null}
        onCancel={onModalClose}
        zIndex={1050}
      >
        {state.mode == "summary" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>New Summary</Typography.Title>
              <Typography.Text type="secondary">
                Here are some fresh ideas for summary! Click one of following
                options to add
              </Typography.Text>
            </div>

            {/* {JSON.stringify(openai.data)} */}
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              {openai.loading && (
                <div
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MagicWandLoading />
                </div>
              )}
              {!openai.loading &&
                openai.data?.results?.map((item, key) => (
                  <div
                    key={key}
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item.content)}
                  >
                    <Markdown>{item.content}</Markdown>
                  </div>
                ))}
            </Space>
          </div>
        )}
        {state.mode == "rewrite" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>
                Rephrase and Optimise
              </Typography.Title>
              <Typography.Text type="secondary">
                Let’s make sure your summary is word perfect! Click one of
                following options to add
              </Typography.Text>
            </div>

            {/* {JSON.stringify(openai.data)} */}
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              {openai.loading && (
                <div
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MagicWandLoading />
                </div>
              )}
              {!openai.loading &&
                openai.data?.results?.map((item) => (
                  <div
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item.content)}
                  >
                    {/* {item.content}
                     */}
                    <Markdown>{item.content}</Markdown>
                  </div>
                ))}
            </Space>
          </div>
        )}
        {state.mode == "rewriteWithInstructions" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>
                Rewrite with Instructions
              </Typography.Title>
              <Typography.Text type="secondary">
                Click one of following options to add
              </Typography.Text>
            </div>

            {/* {JSON.stringify(openai.data)} */}
            <Space direction="vertical">
              {openai.loading && (
                <div
                  style={{
                    minHeight: "400px",
                  }}
                >
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              )}
              {!openai.loading &&
                openai.data?.results?.map((item) => (
                  <div
                    type="text"
                    className="openai-generated-content-item"
                    onClick={() => onSelectDescription(item.content)}
                  >
                    {item.content}
                  </div>
                ))}
            </Space>
          </div>
        )}
      </Modal>
      {label}
      <FormLabel
        action={
          <Popover
            placement="bottomRight"
            trigger={["click"]}
            content={
              <div>
                <Space direction="vertical">
                  <Typography.Text type="secondary">
                    Write with CV Wizard
                  </Typography.Text>{" "}
                  <Button type="link" size="small" onClick={handleRewrite}>
                    Rephrase and Optimise
                  </Button>
                  {/* <Button type="link" size="small">
                    Repharse with Instructions
                  </Button> */}
                  <Button type="link" size="small" onClick={handleGenSummary}>
                    Generate New Summary
                  </Button>
                </Space>
              </div>
            }
          >
            <Button type="link" size="small">
              <MagicWandIcon /> Write with CV Wizard
            </Button>
          </Popover>
        }
        required={true}
      />
    </>
  );
};

const ExperiencePreview = ({ form, experience, field }) => {
  return (
    <div className="education-preview">
      <div className="preview-value">
        <Typography.Text strong>
          {" "}
          {experience.position || "(Not Specified)"}
        </Typography.Text>
      </div>
      <div className="preview-value">
        <Typography.Text type="secondary">
          {" "}
          {experience.employerName}
        </Typography.Text>
      </div>
    </div>
  );
};

const SingleEducationForm = ({ field, form, remove, resetEditIndex }) => {
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  var converter = new showdown.Converter();

  const onAddDescription = (value) => {
    let experienceList = form.getFieldValue("experienceList");
    experienceList[field.name].description = converter.makeHtml(value);
    form.setFieldsValue({
      experienceList,
    });
  };

  return (
    <>
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "position"]}
            label="Job Title"
            fieldKey={[field.fieldKey, "position"]}
            rules={[
              {
                required: true,
                message: "Please input Job Title!",
              },
            ]}
          >
            <Input placeholder="Job Title" />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "employerName"]}
            label="Employer"
            fieldKey={[field.fieldKey, "employerName"]}
            rules={[
              {
                required: true,
                message: "Please input employer!",
              },
            ]}
          >
            <Input placeholder="Employer" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "dateRange"]}
            label="Start & End Date"
            fieldKey={[field.fieldKey, "dateRange"]}
            rules={[
              {
                required: true,
                message: "Start & End Date!",
              },
            ]}
          >
            {/* <DatePicker.RangePicker picker="month" allowEmpty={[false, true]} />
             */}
            <CustomDateRange
              checkBoxText="Currently Working Here"
              picker="year"
              allowEmpty={[false, true]}
            />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "location"]}
            label="City"
            fieldKey={[field.fieldKey, "location"]}
            rules={[]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <FormLabelWithAIActions
            description={form.getFieldValue([
              "experienceList",
              field.name,
              "description",
            ])}
            jobTitle={form.getFieldValue([
              "experienceList",
              field.name,
              "position",
            ])}
            employerName={form.getFieldValue([
              "experienceList",
              field.name,
              "employerName",
            ])}
            onAddDescription={onAddDescription}
            label={
              <>
                <div>
                <Typography.Title level={5}>Description</Typography.Title>
                </div>
                <div
                  style={{
                    marginBottom: "0.5rem",
                  }}
                >
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
                </div>
              </>
            }
          />

          <Form.Item
            {...field}
            name={[field.name, "description"]}
            fieldKey={[field.fieldKey, "description"]}
            rules={[
              {
                required: true,
                message: "Please input description!",
              },
            ]}
          >
            <EditorJsInput />
            {/* <Input.TextArea /> */}
          </Form.Item>

          <Form.Item
            {...field}
            name={[field.name, "achievements"]}
            fieldKey={[field.fieldKey, "achievements"]}
            rules={[]}
          >
            <Achievements
              jobTitle={form.getFieldValue([
                "experienceList",
                field.name,
                "position",
              ])}
            />
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
                .validateFields(["experienceItems"])
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

const ExperienceForm_ = ({ form, fields, add, remove, move }) => {
  const [state, setState] = useState({
    updateItemIdx: null,
    hoverItemIdx: null,
  });

  const addNewItem = () => {
    add({
      id: objectId(),
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
                          <Row align="middle">
                            <div
                              style={{ color: "grey", marginBottom: ".5rem" }}
                            >
                              <span>Experience #{index + 1}</span>
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
                            <SingleEducationForm
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
                              <ExperiencePreview
                                experience={form.getFieldValue([
                                  "experienceList",
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
            Add Experience
          </Button>
          {/* )} */}
        </DragDropContext>
      </div>
    </>
  );
};

const ExperienceForm = ({ onFinish, initialValues, isLoading }) => {
  const [form] = Form.useForm();

  const onFinish_ = (values) => {
    // Make sure to replace undefined with null values
    // so that firestore doesn't throw error

    let newValues = values.experienceList.map((item) => {
      let newItem = { ...item };
      newItem.location = newItem.location || null;
      return newItem;
    });
    onFinish({ experienceList: newValues });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        experienceList: initialValues,
      }}
      onChange={(values) => {
        console.log("values", values);
      }}
      scrollToFirstError
      layout="vertical"
    >
      <Form.List name="experienceList">
        {(fields, { add, remove, move }) => (
          <>
            <ExperienceForm_
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

const ExperienceSection = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const experience = useDoc("experience", user.uid, true);
  const createUpdateDoc = useMutateDoc("experience", user.uid, true);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    // For each item in values.experienceItems change dateRange to startDate and endDate of firestore
    let newValues = values.experienceList.map((item) => {
      let newItem = { ...item };
      newItem.startDate =  newItem.dateRange[0] ? newItem.dateRange[0].toDate() : null;
      newItem.endDate = newItem.dateRange[1]
        ? newItem.dateRange[1].toDate()
        : null;
      delete newItem.dateRange;
      return newItem;
    });
    createUpdateDoc
      .mutate({
        experienceList: newValues,
        createdAt: experience.data?.createdAt || new Date(),
        updatedAt: new Date(),
        userId: user.uid,
      })
      .then(() => {
        message.success("Experience Saved");
      })
      .catch((err) => {
        message.error("Something went wrong");
      });
  };

  let initialValues =
    experience.data?.experienceList?.map(({ startDate, endDate, ...rest }) => ({
      ...rest,
      description: rest.description || rest.descriptions,
      dateRange: [
        startDate? dayjs(startDate.toDate()): null,
        endDate ? dayjs(endDate.toDate()) : null,
      ],
    })) || [];

  return (
    <div>
      <Typography.Title level={3}>Experience</Typography.Title>
      {experience.loading ? <Skeleton /> : null}
      {!experience.loading && (
        <ExperienceForm
          onFinish={onFinish}
          initialValues={initialValues}
          isLoading={createUpdateDoc.isLoading}
        />
      )}
    </div>
  );
};

export { ExperienceSection, ExperienceForm };

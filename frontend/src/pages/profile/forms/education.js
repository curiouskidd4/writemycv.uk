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
import FormLabel from "../../../components/labelWithActions";
import { useOpenAI } from "../../../utils";

const FormLabelWithAIActions = ({
  degree,
  school,
  modules,
  description,
  onAddDescription,
}) => {
  // AI Actions helper
  const [state, setState] = useState({
    modalVisible: false,
    mode: null,
  });

  let openai = useOpenAI();
  const handleGenSummary = () => {
    setState({ ...state, modalVisible: true, mode: "summary" });
    openai.getEducationSummary({
      degree,
      school,
      modules,
      existingSummary: description,
      role: "machine learning engineer",
    });
  };

  const handleRewrite = () => {
    setState({ ...state, modalVisible: true, mode: "rewrite" });
    openai.getEducationSummary({
      degree,
      school,
      modules,
      existingSummary: description,
      role: "machine learning engineer",
      rewrite: {
        enabled: true,
        instructions: "",
      },
    });
  };

  const handleRewriteWithInstructions = () => {
    setState({ ...state, modalVisible: true, mode: "rewriteWithInstructions" });
    openai.getEducationSummary({
      degree,
      school,
      modules,
      existingSummary: description,
      role: "machine learning engineer",
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
  return (
    <>
      <Modal
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
              <Typography.Title level={4}>Summary</Typography.Title>
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
        {state.mode == "rewrite" && (
          <div className="openai-model-content">
            <div className="model-header">
              {" "}
              <Typography.Title level={4}>Rewrite</Typography.Title>
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
      <FormLabel
        action={
          <Popover
            placement="bottomRight"
            trigger={["click"]}
            content={
              <div>
                <Space direction="vertical">
                  <Typography.Text type="secondary">AI Actions</Typography.Text>
                  <Button
                    type="link"
                    size="small"
                    disabled={
                      description && description.length > 20 ? false : true
                    }
                    onClick={handleRewrite}
                  >
                    Rephrase
                  </Button>
                  {/* <Button
                    type="link"
                    size="small"
                    disabled={
                      description && description.length > 20 ? false : true
                    }
                  >
                    Repharse with Instructions
                  </Button> */}
                  <Button
                    type="link"
                    size="small"
                    disabled={degree && school ? false : true}
                    onClick={handleGenSummary}
                  >
                    Generate new summary
                  </Button>
                </Space>
              </div>
            }
          >
            <Button type="link" size="small">
              AI Actions
            </Button>
          </Popover>
        }
        label="Summary of courses/achievements/dissertation"
        required={true}
      />
    </>
  );
};

const CourseLabelWithAIActions = ({ degree, school, onAddCourses }) => {
  let openai = useOpenAI();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // AI Actions helper

  const handleGenSuggestions = () => {
    setPopoverOpen(true);
    openai.getEducationCoursesSuggestion({
      degree,
      school,
      role: "machine learning engineer",
    });
  };

  const handleAdd = (value) => {
    onAddCourses(value);
    setPopoverOpen(false);
  };

  return (
    <FormLabel
      action={
        <Popover
          open={popoverOpen}
          onOpenChange={(open) => {
            setPopoverOpen(open);
          }}
          trigger="click"
          placement="bottomRight"
          content={
            <div
              style={{
                width: "500px",
              }}
            >
              <Typography.Text type="secondary">
                Courses Suggestions
              </Typography.Text>
              <>
                {openai.loading ? <Skeleton /> : null}
                {!openai.loading &&
                  openai.data?.results?.map((item, idx) => (
                    <div
                      key={idx}
                      className="openai-generated-content-item"
                      onClick={() => handleAdd(item.content)}
                    >
                      {item.content}
                    </div>
                  ))}
              </>
            </div>
          }
        >
          <Button type="link" size="small" onClick={handleGenSuggestions}>
            AI Suggestions
          </Button>
        </Popover>
      }
      label="Courses/Modules"
      required={true}
    />
  );
};

const EducationPreview = ({ form, education, field }) => {
  return (
    <div className="education-preview">
      <div className="preview-value">
        <Typography.Text strong>
          {" "}
          {education.degree || "(Not Specified)"}
        </Typography.Text>
      </div>
      <div className="preview-value">
        <Typography.Text type="secondary"> {education.school}</Typography.Text>
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

  const onAddDescription = (value) => {
    let educationList = form.getFieldValue("educationList");
    educationList[field.name].description = value;
    form.setFieldsValue({
      educationList,
    });
  };

  const onAddCourses = (value) => {
    let educationList = form.getFieldValue("educationList");
    educationList[field.name].modules = value;
    form.setFieldsValue({
      educationList,
    });
  };
  return (
    <>
      <Row gutter={24}>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "school"]}
            label="School"
            fieldKey={[field.fieldKey, "school"]}
            rules={[
              {
                required: true,
                message: "Please input School!",
              },
            ]}
          >
            <Input placeholder="School" />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "degree"]}
            label="Degree"
            fieldKey={[field.fieldKey, "degree"]}
            rules={[
              {
                required: true,
                message: "Please enter degree!",
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
            <DatePicker.RangePicker picker="year" allowEmpty={[false, true]} />
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
        <Col {...colSpan}>
          <Form.Item
            {...field}
            name={[field.name, "grade"]}
            label="GPA/Grade"
            fieldKey={[field.fieldKey, "grade"]}
            rules={[]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...colSpan}>
          <CourseLabelWithAIActions
            degree={form.getFieldValue(["educationList", field.name, "degree"])}
            school={form.getFieldValue(["educationList", field.name, "school"])}
            onAddCourses={onAddCourses}
          />
          <Form.Item
            {...field}
            name={[field.name, "modules"]}
            // label="Courses/Modules"
            fieldKey={[field.fieldKey, "modules"]}
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
              "educationList",
              field.name,
              "description",
            ])}
            degree={form.getFieldValue(["educationList", field.name, "degree"])}
            school={form.getFieldValue(["educationList", field.name, "school"])}
            modules={form.getFieldValue([
              "educationList",
              field.name,
              "modules",
            ])}
            onAddDescription={onAddDescription}
          />
          <Form.Item
            {...field}
            name={[field.name, "description"]}
            // label={}
            fieldKey={[field.fieldKey, "description"]}
            rules={
              [
                //   {
                //     required: true,
                //     message: "Please input description!",
                //   },
              ]
            }
          >
            <EditorJsInput />
            {/* <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} /> */}
          </Form.Item>
          <div
            style={{
              marginBottom: "0.5rem",
            }}
          >
            <Typography.Text type="secondary">
              <BulbOutlined />
              Tip: Write about your key achievements, projects, and
              modules/courses you have taken. It's good to add more details
              about your education if you are a recent graduate.
            </Typography.Text>
          </div>
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

const EducationForm_ = ({ form, fields, add, remove, move }) => {
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
                        <HolderOutlined
                          style={{
                            display:
                              state.hoverItemIdx == index ? "flex" : "none",
                          }}
                          className="hover-outlined-button"
                          {...provided.dragHandleProps}
                        />
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
                              <span>Education #{index + 1}</span>
                            </div>

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
                              <EducationPreview
                                education={form.getFieldValue([
                                  "educationList",
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
            Add Education
          </Button>
          {/* )} */}
        </DragDropContext>
      </div>
    </>
  );
};

const EducationForm = ({ onFinish, initialValues, isLoading }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        educationList: initialValues,
      }}
      //   onChange={(values) => {
      //     console.log("values", values);
      //   }}
      scrollToFirstError
      layout="vertical"
    >
      <Form.List name="educationList">
        {(fields, { add, remove, move }) => (
          <>
            <EducationForm_
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

const EducationSection = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const education = useDoc("education", user.uid);
  const createUpdateDoc = useMutateDoc("education", user.uid, true);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    // For each item in values.EducationItems change dateRange to startDate and endDate of firestore
    let newValues = values.educationList.map((item) => {
      let newItem = { ...item };
      newItem.startDate = newItem.dateRange[0].toDate();
      newItem.endDate = newItem.dateRange[1]
        ? newItem.dateRange[1].toDate()
        : null;
      delete newItem.dateRange;
      return newItem;
    });
    createUpdateDoc
      .mutate({
        educationList: newValues,
        createdAt: education.data?.createdAt || new Date(),
        updatedAt: new Date(),
        userId: user.uid,
      })
      .then(() => {
        message.success("Education Saved");
      })
      .catch((err) => {
        message.error("Something went wrong");
      });
  };

  let initialValues =
    education.data?.educationList?.map(({ startDate, endDate, ...rest }) => ({
      ...rest,
      description: rest.description || rest.descriptions,

      dateRange: [
        dayjs(startDate.toDate()),
        endDate ? dayjs(endDate.toDate()) : null,
      ],
    })) || [];

  return (
    <div>
      <Typography.Title level={3}>Education</Typography.Title>
      {education.loading ? <Skeleton /> : null}
      {!education.loading && (
        <EducationForm
          initialValues={initialValues}
          onFinish={onFinish}
          isLoading={createUpdateDoc.loading}
        />
      )}
    </div>
  );
};

export { EducationSection, EducationForm };

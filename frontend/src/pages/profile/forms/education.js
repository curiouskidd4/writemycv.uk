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
import CustomDateRange from "../../../components/dateRange";
import { MagicWandIcon, MagicWandLoading } from "../../../components/faIcons";
import Markdown from "react-markdown";
import withPaywall from "../../../components/paywallHOC";

const FormLabelWithAIActions = ({
  degree,
  school,
  modules,
  description,
  onAddDescription,
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
    openai.getEducationSummary({
      degree,
      school,
      modules,
      existingSummary: description,
      // role: "machine learning engineer",
    });
  };

  const handleRewrite = () => {
    setState({ ...state, modalVisible: true, mode: "rewrite" });
    openai.getEducationSummary({
      degree,
      school,
      modules,
      existingSummary: description,
      // role: "machine learning engineer",
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
              <Typography.Title level={4}>New Summary</Typography.Title>
              <Typography.Text type="secondary">
                Here are some fresh ideas for summary! Click one of following
                options to add
              </Typography.Text>
            </div>

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
              withPaywall(popOverContent())
            }
          >
            <Button type="link" size="small">
              <MagicWandIcon /> Write with CV Wizard
            </Button>
          </Popover>
        }
        // label="List further achievements here, such as scholarships, awards, the title of your dissertation and / or key projects"
        required={true}
      />
    </>
  );

  function popOverContent() {
    return <div>
      <Space direction="vertical">
        <Typography.Text type="secondary">
          Write with CV Wizard
        </Typography.Text>
        <Button
          type="link"
          size="small"
          disabled={description && description.length > 20 ? false : true}
          onClick={handleRewrite}
        >
          Rephrase and Optimise
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
          Generate New Summary
        </Button>
      </Space>
    </div>;
  }
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
      // role: "machine learning engineer",
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
            <MagicWandIcon /> CV Wizard
          </Button>
        </Popover>
      }
      label="Key Modules – list the most relevant courses you undertook as part of your studies"
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
            label="School/College/University"
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
            label="Degree/Major"
            fieldKey={[field.fieldKey, "degree"]}
            rules={[]}
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
            // Footer for ignoring end date
          >
            {/* <DatePicker.RangePicker picker="year" allowEmpty={[false, true]} renderExtraFooter={() => (
              <Typography.Text type="secondary">
                Leave end date empty if you are currently studying
              </Typography.Text>
            )}/> */}
            <CustomDateRange
              checkBoxText="Currently Studying"
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
            label={
              <>
              <div>
              <Typography.Title level={5}>Description</Typography.Title>
              </div>
              <div
                
              >
                <Typography.Text type="secondary">
                  <BulbOutlined />
                  List further achievements here, such as scholarships, awards, the title of your dissertation and / or key projects. Try CV wizard to get more ideas.
                </Typography.Text>
              </div>
            </>
            }
          />
          <Form.Item
            {...field}
            name={[field.name, "description"]}
            // label={}
            fieldKey={[field.fieldKey, "description"]}
            rules={
              [
               
              ]
            }
          >
            <EditorJsInput />
            {/* <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} /> */}
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
                        <div key={index} className="education-form">
                          <Row
                            // style={{ marginBottom: 8 }}
                            align="middle"
                          >
                            <div
                              style={{ color: "grey", marginBottom: ".5rem" }}
                            >
                              <span>Education #{index + 1}</span>
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

  const onFinish_ = (values) => {
    // Make sure to replace undefined as null
    let newValues = values.educationList.map((item) => {
      let newItem = { ...item };
      // Check for undefined
      newItem.location = newItem.location || null;
      newItem.grade = newItem.grade || null;
      newItem.modules = newItem.modules || null;
      newItem.description = newItem.description || null;
      return newItem;
    });
    onFinish({ educationList: newValues });
  };

  return (
    <Form
      form={form}
      onFinish={onFinish_}
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
        
      </Form.Item>
    </Form>
  );
};

const EducationSection = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const education = useDoc("education", user.uid, true);
  const createUpdateDoc = useMutateDoc("education", user.uid, true);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    // For each item in values.EducationItems change dateRange to startDate and endDate of firestore
    let newValues = values.educationList.map((item) => {
      let newItem = { ...item };
      newItem.startDate =newItem.dateRange[0] ? newItem.dateRange[0].toDate() : null;
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
        startDate? dayjs(startDate.toDate()) : null,
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

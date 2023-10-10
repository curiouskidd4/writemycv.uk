import { Button, Space, Row } from "antd";
import CoolForm from "./form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Typography,
  } from "antd";
import Achievements from "./inputs/achievements";
let questions = [
  {
    id: "1",
    question: "What was your job title?",
    type: "text",
    tip: "If you have worked on multiple roles, please add them separately under different experiences",
  },
  {
    id: "2",
    question: "Please add the name of organization",
    type: "text",
    tip: "If you want to mention location of your organization, please add it after the name of organization, we will automatically detect it",
  },
  {
    id: "3",
    question: "When did you start and complete?",
    type: "date-range-month",
    tip: "If you are still working here, please leave the end date as blank",
  },
  {
    id: "6",
    question:
      "Short description of your role (in 2-3 bullet points or 50-70 words)",
    type: "textarea",
    tip: "",
    isOptional: true,
  },
  {
    id: "7",
    question: "Select an achievement theme to add your achievements (optional)",
    type: "custom",
    inputFn : (props) =>  <Achievements {...props} jobTitle="Machine Learning Engineer" />,
    tip: "",
    isOptional: true,
  },
];

const FinalScreen = ({ answers, addNew, goToStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, delay: 0.25 },
      }}
      exit={{ opacity: 0, y: "-100%", transition: { duration: 0.25 } }}
    >
      <Typography.Title level={3}>Thank you</Typography.Title>
      <Typography.Text>
        We have saved the data. Do you want to add a new entry.
      </Typography.Text>
      <Row>
        <Space>
          <Button type="primary" onClick={addNew}>
            Add New
          </Button>
          <Button onClick={goToStart}>Go to start</Button>
        </Space>
      </Row>
    </motion.div>
  );
};

const ExperienceForm = ({goToStart}) => {
  const [state, setState] = useState({});

  const saveResponse = (answers) => {
    setState((prev) => ({
      ...prev,
      answers: answers,
    }));
  };

  return (
    <CoolForm
      questions={questions}
      finalScreen={FinalScreen}
      onChange={saveResponse}
      goToStart={goToStart}
    />
  );
};

export default ExperienceForm;

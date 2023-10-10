import CoolForm from "./form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Row, Space, Typography } from "antd";
let questions = [
  {
    id: "1",
    question: "What is your name?",
    type: "text",
  },
  {
    id: "2",
    question: "Please add your date of birth",
    type: "date",
    isOptional: true,
  },
  {
    id: "2.1",
    question: "Please add your current role",
    type: "text",
  },
  {
    id: "3",
    question: "Confirm your email address",
    type: "email",
  },
  {
    id: "4",
    question: "Where are you from?",
    type: "text",
  },
  {
    id: "5",
    question: "Please provide you contact number",
    type: "phone-number",
    tip: "We will not share your contact number with anyone without your permission",
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
        We have received your response. We will get back to you soon.
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

const PersonalDetailForm = ({ goToStart }) => {
  const [state, setState] = useState({});

  const saveResponse = (answers) => {
    setState((prev) => ({
      ...prev,
      answers: answers,
    }));
  };

  return (
    <CoolForm
      onChange={saveResponse}
      questions={questions}
      finalScreen={({ answers, addNew, goToStart }) => (
        <FinalScreen answers={answers} addNew={addNew} goToStart={goToStart} />
      )}
      goToStart={goToStart}
    />
  );
};

export default PersonalDetailForm;

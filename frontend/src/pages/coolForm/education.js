import CoolForm from "./form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Typography,
  } from "antd";

let questions = [
  {
    id: "1",
    question: "What's your school/college name?",
    type: "text",
    tip: "If you want to mention location of your school/college, please add it after the name of school/college, we will automatically detect it",
  },
  {
    id: "2",
    question: "Please add course or degree name",
    type: "text",
    isOptional: true,
  },
  {
    id: "3",
    question: "When did you start and complete?",
    type: "date-range-month",
    tip: "If you are still studying, please leave the end date as blank",
  },
  {
    id: "4",
    question: "Do you want to add your grades?",
    type: "text",
    tip: "If your grades are on a different scale, please mention it in the answer like 9.5/10",
    isOptional: true,
  },
  {
    id: "5",
    question: "Please add relevant courses",
    type: "text",
    tip: "If you have graduated in last 2 years, please add relevant courses you have taken",
    isOptional: true,
  },
  {
    id: "6",
    question:
      "Mention your projects, achievements, awards, etc. (in 2-3 bullet points)",
    type: "text",
    tip: "If you have graduated in last 2 years, please add relevant achievements",
    isOptional: true,
  },
];




const FinalScreen = ({ answers }) => {
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
    </motion.div>
  );
};

const EducationForm = ({goToStart}) => {
  const [state, setState] = useState({});

  const saveResponse = (answers) => {
    setState((prev) => ({
      ...prev,
      answers: answers,
    }));
  };

  return <CoolForm     onChange={saveResponse}
  questions={questions} finalScreen={FinalScreen} goToStart={goToStart} />;
};

export default EducationForm;
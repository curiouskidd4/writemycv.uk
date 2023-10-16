import { Button, Space, Row } from "antd";
import CoolForm from "./form";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "antd";
import Achievements from "./inputs/achievements";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
import { Timestamp } from "firebase/firestore";
let questions = [
  {
    id: "1",
    question: "What was your job title?",
    type: "text",
    tip: "If you have worked on multiple roles, please add them separately under different experiences",
    dataKey: "position",
  },
  {
    id: "2",
    question: "Please add the name of organization",
    type: "text",
    tip: "If you want to mention location of your organization, please add it after the name of organization, we will automatically detect it",
    dataKey: "employerName",
  },
  {
    id: "3",
    question: "When did you start and complete?",
    type: "date-range-month",
    tip: "If you are still working here, please leave the end date as blank",
    dataKey: "dateRange",
  },
  {
    id: "6",
    question:
      "Short description of your role (in 2-3 bullet points or 50-70 words)",
    type: "textarea",
    tip: "",
    isOptional: true,
    dataKey: "description",
  },
  {
    id: "7",
    question: "Select an achievement theme to add your achievements (optional)",
    type: "custom",
    inputFn: (props) => (
      <Achievements {...props} jobTitle="Machine Learning Engineer" />
    ),
    tip: "",
    isOptional: true,
    dataKey: "achievements",
  },
];

const FinalScreen = ({ answers, addNew, goToStart, onSave, resumeId }) => {
  const currentExperience = useDoc("experience", resumeId, false);
  const updateExperience = useMutateDoc("experience", resumeId, true);

  useEffect(() => {
    if (currentExperience.data) {
      // Once we have the data, we can update the form
      saveDetails(currentExperience.data);
    }
  }, [currentExperience]);

  const saveDetails = async (currentExperience) => {
    let data = {};

    answers.forEach((item) => {
      let answer = item.answer;
      if (item.type == "date") {
        answer = answer.toDate();
      }

      if (item.dataKey == "dateRange") {
        let startDate = answer[0].toDate();
        let endDate = answer[1] ? answer[1].toDate() : null;
        data["startDate"] = Timestamp.fromDate(startDate);
        data["endDate"] = endDate ? Timestamp.fromDate(endDate) : null;
      }
      data[item.dataKey] = answer;
    });

    if (currentExperience) {
      // Update the existing education
      await updateExperience.mutate({
        ...currentExperience,
        experienceList: [...currentExperience.experienceList, data],
        updatedAt: new Date(),
      });
    }
  };
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
      We have successfully saved your education details. Do you want to add a
        new entry?      </Typography.Text>
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

const ExperienceForm = ({ goToStart, resumeId }) => {
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
      // finalScreen={FinalScreen}
      finalScreen={({ answers, addNew, goToStart }) => (
        <FinalScreen answers={answers} addNew={addNew} goToStart={goToStart}  resumeId={resumeId}/>
      )}
      onChange={saveResponse}
      goToStart={goToStart}
    />
  );
};

export default ExperienceForm;

import CoolForm from "./form";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Row, Space, Typography } from "antd";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
import { Timestamp } from "firebase/firestore";

let questions = [
  {
    id: "1",
    question: "What's your school/college name?",
    type: "text",
    tip: "If you want to mention location of your school/college, please add it after the name of school/college, we will automatically detect it",
    dataKey: "school",
  },
  {
    id: "2",
    question: "Please add course or degree name",
    type: "text",
    isOptional: true,
    dataKey: "degree",
  },
  {
    id: "3",
    question: "When did you start and complete?",
    type: "date-range-month",
    tip: "If you are still studying, please leave the end date as blank",
    isOptional: true,
    dataKey: "dateRange",
  },
  {
    id: "4",
    question: "Do you want to add your grades?",
    type: "text",
    tip: "If your grades are on a different scale, please mention it in the answer like 9.5/10",
    isOptional: true,
    dataKey: "grade",
  },
  {
    id: "5",
    question: "Please add relevant courses",
    type: "text",
    tip: "If you have graduated in last 2 years, please add relevant courses you have taken",
    isOptional: true,
    dataKey: "courses",
  },
  {
    id: "6",
    question:
      "Mention your projects, achievements, awards, etc. (in 2-3 bullet points)",
    type: "text",
    // tip: "If you have graduated in last 2 years, please add relevant achievements",
    isOptional: true,
    dataKey: "achievements",
  },
];

const FinalScreen = ({ answers, addNew, goToStart, onSave, resumeId }) => {
  const [loading, updatedLoading] = useState(false);
  const currentEducation = useDoc("education", resumeId, false);
  const updateEducation = useMutateDoc("education", resumeId, true);

  useEffect(() => {
    if (currentEducation.data) {
      // Once we have the data, we can update the form
      saveDetails(currentEducation.data);
    }
  }, [currentEducation]);

  const saveDetails = async (currentEducation) => {
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

    if (currentEducation) {
      // Update the existing education
      await updateEducation.mutate({
        ...currentEducation,
        educationList: [...currentEducation.educationList, data],
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
        new entry?
      </Typography.Text>
      <Row>
        <Space>
          <Button type="primary" onClick={addNew}>
            Add new
          </Button>

          <Button onClick={goToStart}>Go to start</Button>
        </Space>
      </Row>
    </motion.div>
  );
};

const EducationForm = ({ goToStart, resumeId }) => {
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
      // finalScreen={FinalScreen}
      finalScreen={({ answers, addNew, goToStart }) => (
        <FinalScreen answers={answers} addNew={addNew} goToStart={goToStart}  resumeId={resumeId}/>
      )}
      goToStart={goToStart}
    />
  );
};

export default EducationForm;

import CoolForm from "./form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Row, Space, Typography } from "antd";
import { useEffect } from "react";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
import { useResume } from "../../resumeContext";
import dayjs from "dayjs";

let questions = [
  {
    id: "1",
    question: "What is your name?",
    type: "text",
    dataKey: "name",
  },
  {
    id: "2",
    question: "Please add your date of birth",
    type: "date",
    isOptional: true,
    dataKey: "dob",
  },
  {
    id: "2.1",
    question: "Please add your current role",
    type: "text",
    dataKey: "currentRole",
  },
  {
    id: "3",
    question: "Confirm your email address",
    type: "email",
    dataKey: "email",
  },
  {
    id: "4",
    question: "Where are you from?",
    type: "text",
    dataKey: "location",
  },
  {
    id: "5",
    question: "Please provide you contact number",
    type: "phone-number",
    tip: "We will not share your contact number with anyone without your permission",
    dataKey: "phoneNumber",
  },
];

const FinalScreen = ({ answers,  goToStart, onSave, resumeId }) => {

  const { updatePersonalInfo } = useResume();
  useEffect(() => {
      saveDetails();
  }, [] );

  const saveDetails = async () => {
    let data = {
    };

    answers.forEach((item) => {
      let answer = item.answer;
      if (item.type == "date") {
        answer = answer.toDate();
      }
      if (item.dataKey == "name") {
        let firstName = answer.split(" ")[0];
        let lastName = answer.split(" ")[1];
        data["firstName"] = firstName;
        data["lastName"] = lastName;
      }
      data[item.dataKey] = answer;
    });

    await updatePersonalInfo(data);
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
        You have successfully added your personal details.
      </Typography.Text>
      <Row style={{
        marginTop: "1.5rem"
      }}>
        <Space>
          <Button onClick={goToStart}>Go Back</Button>
        </Space>
      </Row>
    </motion.div>
  );
};

const PersonalDetailForm = ({ goToStart, resumeId }) => {
  const [state, setState] = useState({});

  const resume = useResume();

  const saveResponse = (answers) => {
    setState((prev) => ({
      ...prev,
      answers: answers,
    }));
  };

  const defaultAnswers = [
    {
      id: "1",
      answer: resume.data?.personalInfo?.name,
    },
    {
      id: "2",
      answer: resume.data?.personalInfo?.dob ? dayjs(resume.data?.personalInfo?.dob) : null,
    },
    {
      id: "2.1",
      answer: resume.data?.personalInfo?.currentRole,
    },
    {
      id: "3",
      answer: resume.data?.personalInfo?.email,
    },
    {
      id: "4",
      answer: resume.data?.personalInfo?.location,
    },
    {
      id: "5",
      answer: resume.data?.personalInfo?.phoneNumber,
    },
  ];

  return (
    <CoolForm
      defaultAnswers={defaultAnswers}
      loading={resume.loading}
      onChange={saveResponse}
      questions={questions}
      finalScreen={({ answers, addNew, goToStart }) => (
        <FinalScreen
          answers={answers}
          addNew={addNew}
          goToStart={goToStart}
          resumeId={resumeId}
        />
      )}
      goToStart={goToStart}
    />
  );
};

export default PersonalDetailForm;

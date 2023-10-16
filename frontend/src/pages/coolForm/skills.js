import { Button, Space, Row } from "antd";
import CoolForm from "./form";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "antd";
import { useDoc, useMutateDoc } from "../../firestoreHooks";
let questions = [
  {
    id: "1",
    question: "Select a skill from the following options or add your own",
    type: "text",
    tip: "If you have worked on multiple roles, please add them separately under different experiences",
  },
  {
    id: "2",
    question: "Add your skill level",
    type: "options",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    tip: "If you want to mention location of your organization, please add it after the name of organization, we will automatically detect it",
  },
];

const FinalScreen = ({answers, addNew, goToStart, onSave, resumeId }) => {
  const currentSkills = useDoc("skill", resumeId, false);
  const updateSkills = useMutateDoc("skill", resumeId, true);

  useEffect(() => {
    if (currentSkills.data) {
      // Once we have the data, we can update the form
      saveDetails(currentSkills.data);
    }
  }, [currentSkills]);

  const saveDetails = async (currentSkills) => {
    let data = {};

    answers.forEach((item) => {
      let answer = item.answer;
      if (item.type == "date") {
        answer = answer.toDate();
      }

      
      data[item.dataKey] = answer;
    });

    if (currentSkills) {
      // Update the existing education
      await updateSkills.mutate({
        ...currentSkills,
        skillList: [...currentSkills.skillList, data],
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

const SkillForm = ({ goToStart, resumeId }) => {
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

export default SkillForm;

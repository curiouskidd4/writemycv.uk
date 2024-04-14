import { Button, Progress, Spin, Typography } from "antd";
import CoolForm from "../coolForm/form";
import { useAuth } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutateDoc } from "../../firestoreHooks";

const FinalScreen = ({ answers, userId, onProfileSave }) => {
  const updateUser = useMutateDoc("users", userId, true);
  const [loading, updateLoading] = useState(false);
  useEffect(() => {
    updateLoading(true);
    setTimeout(saveDetails, 2000);
  }, [answers]);

  const saveDetails = async () => {
    let data = {
        profileComplete: true,
    };
    answers.forEach((item) => {
      //
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

    await updateUser.mutate(data);
    updateLoading(false);
    onProfileSave();
    
    // setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div>
      <Spin />
      <Typography.Title level={3}>Thank you for the details.</Typography.Title>
      <Typography.Text>We have securely saving them...</Typography.Text>
      {/* <Link to="/dashboard"> */}
      {/* <Button>Go To Dashboard</Button> */}
      {/* </Link> */}
    </div>
  );
};
const CustomerOnboarding = () => {
  const auth = useAuth();
  const [state, setState] = useState({
    isComplete: false,
    questionIdx: 0,
  });
  let questions = [
    {
      id: 1,
      question: "What is your name?",
      type: "text",
      dataKey: "name",
    },
    // {
    //   id: 2,
    //   question: "What's your gender?",
    //   type: "options",
    //   options: ["Male", "Female", "Other"],
    //   dataKey: "gender",
    // },
    // {
    //   id: 3,
    //   question: "What's your Date of Birth?",
    //   type: "date",
    //   dataKey: "dob",
    // },
    // {
    //   id: 4,
    //   question: "Please provide you contact number",
    //   type: "phone-number",
    //   tip: "We will not share your contact number with anyone without your permission",
    //   dataKey: "phoneNumber",
    // },
  ];

  const saveResponse = (response) => {
    console.log(response);
  };
  const onLogout = () => {
    auth.logout();
  };

  const setCurrentQuestionIdx = (idx) => {
    setState((prev) => ({
      ...prev,
      questionIdx: idx,
    }));
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        // height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          // maxWidth: "500px",
        }}
      >
        <Progress
          percent={(state.questionIdx + 1) * 25}
          strokeColor={"#256763"}
        />

        <Typography.Title level={2}>Onboarding</Typography.Title>
        <CoolForm
          questions={questions}
          finalScreen={(props) => (
            <FinalScreen
              {...props}
              userId={auth.user.uid}
              onProfileSave={auth.markProfileCompleted}
            />
          )}
          setCurrentQuestionIdx={setCurrentQuestionIdx}
          onChange={saveResponse}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="link" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;

import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BulbOutlined } from "@ant-design/icons";
import { useHotkeys } from "react-hotkeys-hook";
import PersonalDetailForm from "./personalDetails";
import EducationForm from "./education";
import ExperienceForm from "./experience";
import SkillForm from "./skills";

// const QuestionInput = ({ questionItem, isFirst, onDone }) => {
//   //   const [status, setStatus] = useState(null);
//   const [state, setState] = useState({
//     status: null,
//     value: null,
//     errorMessage: null,
//   });
//   useHotkeys(
//     "enter",
//     () => {
//       if (state.status != "error" && (state.value || questionItem.isOptional)) {
//         onDone();
//       }
//     },
//     {
//       enableOnFormTags: true,
//     },
//     [state.status, state.value]
//   );

//   const onChange = (e) => {
//     let status = questionItem.isOptional
//       ? "success"
//       : e.target?.value || e
//       ? "success"
//       : "error";
//     setState({
//       ...state,
//       value: e.target?.value || e,
//       status: status,
//       errorMessage:
//         status == "error"
//           ? questionItem.errorMessage || "This field is required"
//           : null,
//     });
//   };

//   let inputComponentProps = {
//     value: state.value,
//     onChange: onChange,
//     status: state.status,
//     size: "large",
//     autoFocus: true,
//   };

//   let nextDisabled =
//     state.status == "error" || (!state.value && !questionItem.isOptional);
//   return (
//     <motion.div
//       key={questionItem.id}
//       initial={{ opacity: 0, y: "100%" }}
//       animate={{
//         opacity: 1,
//         y: 0,
//         transition: { duration: 0.25, delay: 0.25 },
//       }}
//       exit={{ opacity: 0, y: "-100%", transition: { duration: 0.25 } }}
//     >
//       <Typography.Title level={3}>{questionItem.question}</Typography.Title>

//       <div className="form-tip-section">
//         {questionItem.tip && (
//           <Typography.Text type="secondary">
//             {" "}
//             <BulbOutlined /> {questionItem.tip}
//           </Typography.Text>
//         )}
//       </div>
//       <div>
//         {questionItem.type == "text" && (
//           <Input size="large" {...inputComponentProps} />
//         )}

//         {questionItem.type == "date" && (
//           <DatePicker size="large" {...inputComponentProps} />
//         )}
//         {questionItem.type == "date-range-year" && (
//           <DatePicker.RangePicker
//             picker="year"
//             allowEmpty={[false, true]}
//             {...inputComponentProps}
//           />
//         )}
//         {questionItem.type == "date-range-month" && (
//           <DatePicker.RangePicker
//             picker="month"
//             allowEmpty={[false, true]}
//             {...inputComponentProps}
//           />
//         )}

//         {questionItem.type == "email" && (
//           <Input type="email" {...inputComponentProps} />
//         )}

//         {questionItem.type == "number" && (
//           <Input type="number" {...inputComponentProps} />
//         )}
//         {questionItem.type == "phone-number" && (
//           <PhoneInput {...inputComponentProps} />
//         )}
//       </div>
//       <div className="form-error-section">
//         {state.errorMessage && (
//           <Typography.Text type="danger">{state.errorMessage}</Typography.Text>
//         )}
//       </div>
//       <Row style={{ marginTop: "1rem" }}>
//         <Button
//           type="primary"
//           size="large"
//           onClick={onDone}
//           disabled={nextDisabled}
//         >
//           Next
//         </Button>
//         {questionItem.isOptional == "optional" ? (
//           <Button size="large" onClick={onDone}>
//             Skip
//           </Button>
//         ) : null}

//         {isFirst ? (
//           <Button type="link" disabled={nextDisabled}>
//             press Enter ↵
//           </Button>
//         ) : null}
//       </Row>
//     </motion.div>
//   );
// };

// const FinalScreen = ({ answers }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: "100%" }}
//       animate={{
//         opacity: 1,
//         y: 0,
//         transition: { duration: 0.25, delay: 0.25 },
//       }}
//       exit={{ opacity: 0, y: "-100%", transition: { duration: 0.25 } }}
//     >
//       <Typography.Title level={3}>Thank you</Typography.Title>
//       <Typography.Text>
//         We have received your response. We will get back to you soon.
//       </Typography.Text>
//     </motion.div>
//   );
// };

// const CoolForm = () => {
//   let questions = [
//     {
//       id: "1",
//       question: "What is your name?",
//       type: "text",
//     },
//     {
//       id: "2",
//       question: "Please add your date of birth",
//       type: "date",
//       isOptional: true,
//     },
//     {
//       id: "3",
//       question: "Confirm your email address",
//       type: "email",
//     },
//     {
//       id: "4",
//       question: "Where are you from?",
//       type: "text",
//     },
//     {
//       id: "5",
//       question: "Please provide you contact number",
//       type: "phone-number",
//       tip: "We will not share your contact number with anyone without your permission",
//     },
//   ];

//   const [state, setState] = useState({
//     answers: questions.map((item) => ({
//         id: item.id,
//       question: item.question,
//       answer: null,
//     })),
//     isComplete: false,
//   });

//   const [currentQuestion, setCurrentQuestion] = useState(0);

//   const [error, setError] = useState("");

//   const [loading, setLoading] = useState(false);

//   const saveResponse = (response) => {
//     let answers = [...state.answers];
//     answers[currentQuestion].answer = response;
//     setState((prev) => ({
//       ...prev,
//       answers: answers ,
//     }));
//     if (currentQuestion == questions.length - 1) {
//       // submit form
//       setCurrentQuestion(null);
//       setState((prev) => ({
//         ...prev,
//         isComplete: true,
//       }));
//     } else {
//       setCurrentQuestion(currentQuestion + 1);
//     }
//   };

//   return (
//     <div
//       style={{
//         height: "80vh",
//         display: "flex",
//       }}
//     >
//       <div
//         style={{
//           margin: "auto auto",
//           width: "100%",
//           maxWidth: "500px",
//         }}
//       >
//         <AnimatePresence>
//           {currentQuestion != null ? (
//             <QuestionInput
//               questionItem={questions[currentQuestion]}
//               key={questions[currentQuestion].id}
//               onDone={saveResponse}
//               isFirst={currentQuestion == 0}
//             />
//           ) : null}
//           {state.isComplete ? <FinalScreen answers={state.answers} /> : null}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

const SectionCard = ({ title, onClick }) => {
  return (
    <Col span={12}>
      <Card hoverable onClick={onClick}>
        <Typography.Title
          level={5}
          style={{ textAlign: "center", marginBottom: "0px" }}
        >
          {title}
        </Typography.Title>
      </Card>
    </Col>
  );
};
const ResumeEditForm = () => {
  const [state, setState] = useState({
    currentSection: "",
  });

  let sections = [
    { title: "Personal Information", key: "personalInfo" },
    { title: "Education", key: "education" },
    { title: "Experience", key: "experience" },
    { title: "Skills", key: "skills" },
  ];

  let onStart = () => {
    setState({ ...state, currentSection: null });
  }
  return (
    <>
      {!state.currentSection && (
        <div
          style={{
            height: "80vh",
            display: "flex",
          }}
        >
          <div
            style={{
              margin: "auto auto",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <Typography.Title level={3}>
              Select a section to edit
            </Typography.Title>
            <Row style={{ marginTop: "1rem" }} gutter={[12, 12]}>
              {sections.map((item) => (
                <SectionCard
                  key={item.key}
                  title={item.title}
                  onClick={() => {
                    setState({ ...state, currentSection: item.key });
                  }}
                />
              ))}
            </Row>

            
          </div>
        </div>
      )}
      {
        state.currentSection == "personalInfo" && (
            <PersonalDetailForm goToStart={onStart} />
        )
      }
      {
        state.currentSection == "education" && (
            <EducationForm goToStart={onStart} />
        )
      }
      {
        state.currentSection == "experience" && (
            <ExperienceForm goToStart={onStart} />
        )
      }
      {
        state.currentSection == "skills" && (
            <SkillForm goToStart={onStart} />
        )
      }

    </>
  );
};

export default ResumeEditForm;

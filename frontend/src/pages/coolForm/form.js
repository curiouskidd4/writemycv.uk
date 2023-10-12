import { Button, DatePicker, Input, Radio, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneInput } from "./inputs/phoneInput";
import { BulbOutlined } from "@ant-design/icons";
import { useHotkeys } from "react-hotkeys-hook";

const QuestionInput = ({ questionItem, isFirst, onDone }) => {
  //   const [status, setStatus] = useState(null);
  const [state, setState] = useState({
    status: null,
    value: null,
    errorMessage: null,
  });
  useHotkeys(
    "enter",
    () => {
      if (state.status != "error" && (state.value || questionItem.isOptional)) {
        onDone(state.value);
      }
    },
    {
      enableOnFormTags: true,
    },
    [state.status, state.value]
  );

  const onChange = (e) => {
    let status = questionItem.isOptional
      ? "success"
      : e.target?.value || e
      ? "success"
      : "error";
    setState({
      ...state,
      value: e.target?.value != undefined ? e.target.value : e,
      status: status,
      errorMessage:
        status == "error"
          ? questionItem.errorMessage || "This field is required"
          : null,
    });
  };

  let inputComponentProps = {
    value: state.value,
    onChange: onChange,
    status: state.status,
    size: "large",
    autoFocus: true,
  };

  let nextDisabled =
    state.status == "error" || (!state.value && !questionItem.isOptional);
  return (
    <motion.div
      key={questionItem.id}
      initial={{ opacity: 0, y: "100%" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, delay: 0.25 },
      }}
      exit={{ opacity: 0, y: "-100%", transition: { duration: 0.25 } }}
    >
      <Typography.Title level={3}>{questionItem.question}</Typography.Title>

      <div className="form-tip-section">
        {questionItem.tip && (
          <Typography.Text type="secondary">
            {" "}
            <BulbOutlined /> {questionItem.tip}
          </Typography.Text>
        )}
      </div>
      <div>
        {questionItem.type == "text" && (
          <Input size="large" {...inputComponentProps} />
        )}

        {questionItem.type == "date" && (
          <DatePicker size="large" {...inputComponentProps} />
        )}
        {questionItem.type == "date-range-year" && (
          <DatePicker.RangePicker
            picker="year"
            allowEmpty={[false, true]}
            {...inputComponentProps}
          />
        )}
        {questionItem.type == "date-range-month" && (
          <DatePicker.RangePicker
            picker="month"
            allowEmpty={[false, true]}
            {...inputComponentProps}
          />
        )}

        {questionItem.type == "email" && (
          <Input type="email" {...inputComponentProps} />
        )}

        {questionItem.type == "number" && (
          <Input type="number" {...inputComponentProps} />
        )}
        {questionItem.type == "textarea" && (
          <Input.TextArea {...inputComponentProps} />
        )}
        {questionItem.type == "phone-number" && (
          <PhoneInput {...inputComponentProps} />
        )}
        {questionItem.type == "custom" && (
          questionItem.inputFn(inputComponentProps)
        )}
        {questionItem.type == "options" && (
          <Radio.Group {...inputComponentProps}>
            {questionItem.options.map((item, index) => (
              <Radio.Button key={index} value={item}>
                {item}
              </Radio.Button>
            ))}
          </Radio.Group>
        )}
      </div>
      <div className="form-error-section">
        {state.errorMessage && (
          <Typography.Text type="danger">{state.errorMessage}</Typography.Text>
        )}
      </div>
      <Row style={{ marginTop: "1rem" }}>
        <Button
          type="primary"
          size="large"
          onClick={() => onDone(state.value)}
          disabled={nextDisabled}
        >
          Next
        </Button>
        {questionItem.isOptional == "optional" ? (
          <Button size="large" onClick={onDone}>
            Skip
          </Button>
        ) : null}

        {isFirst ? (
          <Button type="link" disabled={nextDisabled}>
            press Enter ↵
          </Button>
        ) : null}
      </Row>
    </motion.div>
  );
};

const CoolForm = ({ questions, onChange, finalScreen, goToStart, setCurrentQuestionIdx }) => {

  const [state, setState] = useState({
    answers: questions.map((item) => ({
      id: item.id,
      question: item.question,
      answer: null,
      dataKey: item.dataKey,
      type: item.type,
    })),
    isComplete: false,
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const saveResponse = (response) => {
    let answers = [...state.answers];
    answers[currentQuestion].answer = response;
    setState((prev) => ({
      ...prev,
      answers: answers,
    }));
    onChange(answers);
    if (currentQuestion == questions.length - 1) {
      // submit form
      setCurrentQuestion(null);
      setState((prev) => ({
        ...prev,
        isComplete: true,
      }));
    } else {
      setCurrentQuestion(currentQuestion + 1);
      if (setCurrentQuestionIdx!=undefined){
        setCurrentQuestionIdx(currentQuestion + 1);
      } 
    }
  };

  const addNew = () => {
    setState((prev) => ({
      ...prev,
      isComplete: false,
    }));
    setCurrentQuestion(0);
  };

  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          margin: "auto auto",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <AnimatePresence>
          {currentQuestion != null ? (
            <QuestionInput
              questionItem={questions[currentQuestion]}
              key={questions[currentQuestion].id}
              onDone={saveResponse}
              isFirst={currentQuestion == 0}
            />
          ) : null}
          {state.isComplete ? (
            finalScreen({ answers: state.answers, addNew, goToStart })
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoolForm;

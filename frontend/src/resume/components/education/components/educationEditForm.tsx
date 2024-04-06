import { Button, Divider, Row, Steps, Tag, Typography } from "antd";
import React, { useCallback, useEffect } from "react";
import { Education, EducationList } from "../../../../types/resume";
// import "./index.css";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

import { DetailForm } from "./detailForm";
import { CourseForm } from "./courseForm";
import { DescriptionForm } from "./descriptionForm";
import _ from "lodash";
import openAI from "../../../../hooks/cvWizard";
import ConfirmItemDelete from "../../../../components/itemDelete";

type SingleEducationFormProps = {
  initialValues?: any;
  onFinish: (values: any) => Promise<void>;
  onDelete?: () => void;
  saveLoading?: boolean;
};

const SingleEducationForm = ({
  initialValues,
  onFinish,
  onDelete,
  saveLoading,
}: SingleEducationFormProps) => {
  let startDate = initialValues.startDate
    ? dayjs(initialValues.startDate.toDate())
    : null;

  let endDate = initialValues.endDate
    ? dayjs(initialValues.endDate.toDate())
    : null;

  initialValues = {
    ...initialValues,
    dateRange: [startDate, endDate],
  };

  useEffect(() => {
    // TODO: Move this to add modules tip component itself 
    // For running the AI suggestion 

    checkAISuggestions({
      prevVal: {
        ...initialValues,
        school: "",
        degree: "",
      },
      newVal: initialValues,
    });
  

  }, [])
  const [educationData, setEducationData] = React.useState<any>(
    initialValues || {}
  );

  const [state, setState] = React.useState({
    current: 0,
    finished: false,
    loading: false,
    showSaved: false,
  });

  const educationHelper = openAI.useEducationHelper();

  const checkAISuggestions = async ({
    prevVal,
    newVal,
  }: {
    prevVal: Education;
    newVal: Education;
  }) => {
    console.log("Checking AI suggestions");
    // Check if the new value is different from the previous value
    if (newVal.school && newVal.degree && prevVal.degree != newVal.degree) {
      // Run Modules suggestion and show it to the user
      await educationHelper.suggestCourses({
        school: newVal.school,
        degree: newVal.degree,
      });
    }
  };

  const debounceSave = useCallback(
    _.debounce(async (details: any) => {
      await onFinish(details);
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000),
    []
  );

  const debouceCheckAI = useCallback(
    _.debounce(async (details: any) => checkAISuggestions(details), 3000),
    []
  );

  const onSave = async (details: any) => {
    // Complete and move to next
    let finalData = {
      ...educationData,
      ...details,
    };

    // Dont save if mandatory fields are not filled
    if (!finalData.degree || !finalData.school || !finalData.dateRange) {
      return;
    }
    if (JSON.stringify(finalData) == JSON.stringify(initialValues)) {
      return;
    }
    setEducationData((prev: any) => ({
      ...prev,
      ...details,
    }));
    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    if (finalData.dateRange) {
      finalData.startDate = Timestamp.fromDate(finalData.dateRange[0].toDate());
      finalData.endDate = finalData.dateRange[1]
        ? Timestamp.fromDate(finalData.dateRange[1].toDate())
        : null;

      delete finalData.dateRange;
    }

    // await onFinish(finalData);

    setState((prev) => ({
      ...prev,
      loading: true,
      showSaved: true,
    }));

    await debounceSave(finalData);
    await debouceCheckAI({
      prevVal: educationData,
      newVal: finalData,
    });

    // setState((prev) => ({
    //   ...prev,
    //   finished: true,
    //   loading: false,
    // }));
  };

  return (
    <div>
      {/* <div>
          <Typography.Title level={5}>
            {educationData?.degree || "New Degree"}
          </Typography.Title>
        </div> */}
      <Row
        style={{
          marginTop: "12px",
          width: "100%",
        }}
      >
        <Row align="middle" justify="space-between" style={{ width: "70%" }}>
          <div className="profile-input-section-title">
            <Typography.Text strong>Basic Details</Typography.Text>
          </div>
          {state.loading && state.showSaved ? (
            <div className="auto-save-label-loading">
              Saving changes <i className="fa-solid fa-cloud fa-beat"></i>
            </div>
          ) : state.showSaved ? (
            <div className="auto-save-label-success">
              Saved <i className="fa-solid fa-cloud"></i>
            </div>
          ) : null}
        </Row>

        <DetailForm
          value={educationData}
          onChange={(details) => onSave(details)}
          saveLoading={saveLoading}
        />
        <Divider className="profile-input-section-divider" />
        <CourseForm
          value={educationData}
          onChange={(details) => onSave(details)}
          saveLoading={saveLoading}
          courseSuggestions={
            educationHelper.courseSuggestions
              ? educationHelper.courseSuggestions
              : null
          }
          suggestionsLoading={educationHelper.loading}
        />
        <Divider className="profile-input-section-divider" />
        <DescriptionForm
          value={educationData}
          onChange={(details) => onSave(details)}
          saveLoading={saveLoading}
        />
        <ConfirmItemDelete onDelete={onDelete} text="Delete Education" />
      </Row>
    </div>
  );
};

export default SingleEducationForm;

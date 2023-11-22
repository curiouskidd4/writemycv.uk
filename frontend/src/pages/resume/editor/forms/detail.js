import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  Form,
  Input,
  Button,
  Row,
  DatePicker,
  Typography,
  Col,
  Skeleton,
  message,
  Popover,
  Card,
} from "antd";
import { EducationForm } from "../../../profile/forms/education";
import { PersonalInfoForm } from "../../../profile/forms/personalInfo";
import { SkillForm } from "../../../profile/forms/skills";
import { ProfessionalSummaryForm } from "../../../profile/forms/summary";
import { useAuth } from "../../../../authContext";
import { useDoc, useMutateDoc } from "../../../../firestoreHooks";
import { ExperienceForm } from "../../../profile/forms/experience";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { OpenAIContext } from "../../../../customContext";

const DetailForm = ({ resumeId }) => {
  const auth = useAuth();
  const resume = useDoc("resumes", resumeId);
  const updateResume = useMutateDoc("resumes", resumeId, true);
  const [state, setState] = useState({
    error: "",
    loading: true,
    loaded: false,
    resumeData: {
      personalInfo: {},
      educationList: [],
      experienceList: [],
      skillList: [],
      professionalSummary: "",
    },
  });

  useEffect(() => {
    // Sync the data to backend when the resume data changes
    if (
      JSON.stringify(resume.data) !== JSON.stringify(state.resumeData) &&
      state.loaded
    ) {
      console.log("Syncing data to backend");

      updateResume.mutate(state.resumeData).then(() => {
        message.success("Resume updated successfully");
      });
    }
  }, [state.resumeData]);

  useEffect(() => {
    // Sync the data from backend when the resume data changes
    if (
      JSON.stringify(resume.data) !== JSON.stringify(state.resumeData) &&
      resume.loading === false &&
      state.loaded === false
    ) {
      console.log("Syncing data from backend");
      setState((prevState) => ({
        ...prevState,
        resumeData: resume.data,
        loading: false,
        loaded: true,
      }));
    }
  }, [resume.data]);

  const handleChange = (section, data) => {
    if (section == "educationList") {
      data = data.map((item) => {
        let newItem = { ...item };
        newItem.startDate = newItem.dateRange[0].toDate();
        newItem.startDate = Timestamp.fromDate(newItem.startDate);
        newItem.endDate = newItem.dateRange[1]
          ? newItem.dateRange[1].toDate()
          : null;
        newItem.endDate = newItem.endDate
          ? Timestamp.fromDate(newItem.endDate)
          : null;

        delete newItem.dateRange;
        return newItem;
      });
    }
    if (section == "experienceList") {
      data = data.map((item) => {
        let newItem = { ...item };
        newItem.startDate = newItem.dateRange[0].toDate();
        newItem.startDate = Timestamp.fromDate(newItem.startDate);
        newItem.endDate = newItem.dateRange[1]
          ? newItem.dateRange[1].toDate()
          : null;
        newItem.endDate = newItem.endDate
          ? Timestamp.fromDate(newItem.endDate)
          : null;
        delete newItem.dateRange;
        return newItem;
      });
    }
    setState((prevState) => ({
      ...prevState,
      resumeData: {
        ...prevState.resumeData,
        [section]: data,
      },
    }));
  };

  const changeEducationInitVal = (values) => {
    if (!values) return [];
    values = values.map((item) => {
      let newItem = { ...item };
      newItem.dateRange = [
        item.startDate? dayjs(item.startDate.toDate()): null,
        item.endDate ? dayjs(item.endDate.toDate()) : null,
      ];
      delete newItem.startDate;
      delete newItem.endDate;
      return newItem;
    });

    return values;
  };

  const changeExperienceInitVal = (values) => {
    if (!values) return [];
    values = values.map((item) => {
      let newItem = { ...item };
      newItem.dateRange = [
        item.startDate? dayjs(item.startDate.toDate()): null,
        item.endDate ? dayjs(item.endDate.toDate()) : null,
      ];
      delete newItem.startDate;
      delete newItem.endDate;
      return newItem;
    });
    return values;
  };

  // console.log("resume data", state.resumeData)

  return (
    <div>
      <OpenAIContext.Provider
        value={{
          role: state.resumeData?.personalInfo?.currentRole,
        }}
      >
        <div
          style={{ height: "80vh", overflowY: "auto", padding: "0rem 0.5rem" }}
        >
          {!state.loaded ? <Skeleton /> : null}
          {state.loaded ? (
            <>
              {" "}
              <Typography.Title level={5}>Personal Info</Typography.Title>
              <PersonalInfoForm
                onFinish={(data) => {
                  handleChange("personalInfo", data);
                }}
                initialValues={state.resumeData.personalInfo || {}}
              />
              <Typography.Title level={5}>Education</Typography.Title>
              <EducationForm
                onFinish={(data) => {
                  handleChange("educationList", data.educationList);
                }}
                initialValues={
                  changeEducationInitVal(state.resumeData.educationList) || []
                }
              />
              <Typography.Title level={5}>Experience</Typography.Title>
              <ExperienceForm
                onFinish={(data) => {
                  handleChange("experienceList", data.experienceList);
                }}
                initialValues={
                  changeExperienceInitVal(state.resumeData.experienceList) || []
                }
              />
              <Typography.Title level={5}>Skills</Typography.Title>
              <SkillForm
                onFinish={(data) => {
                  handleChange("skillList", data.skillList);
                }}
                initialValues={state.resumeData.skillList || []}
              />
              <Typography.Title level={5}>
                Professional Summary
              </Typography.Title>
              <ProfessionalSummaryForm
                onFinish={(data) => {
                  handleChange("professionalSummary", data.professionalSummary);
                }}
                initialValues={
                  {
                    professionalSummary: state.resumeData.professionalSummary,
                  } || {}
                }
                resumeId={resumeId}
              />
            </>
          ) : null}
        </div>
      </OpenAIContext.Provider>
    </div>
  );
};

export default DetailForm;

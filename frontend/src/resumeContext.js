import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "./services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useDoc, useMutateDoc } from "./firestoreHooks";
import { objectId } from "./helpers";
const baseUrl = process.env.REACT_APP_API_URL;

const resumeContext = createContext();

const ProviderResume = ({ children, resumeId }) => {
  const val = useProviderResume({ resumeId });
  return (
    <resumeContext.Provider value={val}>{children}</resumeContext.Provider>
  );
};

const useResume = () => {
  return useContext(resumeContext);
};

const useProviderResume = ({ resumeId }) => {
  let resumeDoc = useDoc("resumes", resumeId);
  let updateResume = useMutateDoc("resumes", resumeId, true);

  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
    id: resumeId,
  });

  useEffect(() => {
    if (resumeDoc.data) {
      // Convert dates here
      let personalInfo = resumeDoc.data.personalInfo || {};
      personalInfo.dob = personalInfo.dob ? personalInfo.dob.toDate() : null;

      setState({
        loading: false,
        error: null,
        data: resumeDoc.data,
      });
    }
  }, [resumeDoc.data]);

  useEffect(() => {
    if (state.data) {

      if (
        (!resumeDoc.data.updatedAt ||
          state.data.updatedAt > resumeDoc.data.updatedAt) &&
        !resumeDoc.loading
      ) {
        updateResume.mutate(state.data);
      }
    }
  }, [state.data]);

  const updatePersonalInfo = async (data) => {
    // update the profile info
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        personalInfo: data,
        updatedAt: new Date(),
      },
    }));

    // update the firestore
  };

  const updateEducation = async (data) => {
    // update the profile info
    setState((prev) => {
      let educationList = prev.data.educationList || [];

      let index = educationList.findIndex((item) => item.id == data.id);
      educationList[index] = data;

      return {
        ...prev,
        data: {
          ...prev.data,
          educationList: educationList,
          updatedAt: new Date(),
        },
      };
    });
  };

  const addEducation = async (data) => {
    // update the profile info
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        educationList: [
          ...(prev.data.educationList || []),
          {
            ...data,
            id: objectId(),
          },
        ],
        updatedAt: new Date(),
      },
    }));

    // update the firestore
  };

  const updateExperience = async (data) => {
    // update the profile info
    setState((prev) => {
      let experienceList = prev.data.experienceList || [];

      let index = experienceList.findIndex((item) => item.id == data.id);
      experienceList[index] = data;

      return {
        ...prev,
        data: {
          ...prev.data,
          experienceList: experienceList,
          updatedAt: new Date(),
        },
      };
    });

    // update the firestore
  };

  const addExperience = async (data) => {
    // update the profile info
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experienceList: [
          ...(prev.data.experienceList || []),
          {
            ...data,
            id: objectId(),
          },
        ],
        updatedAt: new Date(),
      },
    }));

    // update the firestore
  };

  const updateSkills = async (data) => {
    // update the profile info
    setState((prev) => {
      let skillList = prev.data.skillList || [];

      let index = skillList.findIndex((item) => item.id == data.id);
      skillList[index] = data;

      return {
        ...prev,
        data: {
          ...prev.data,
          skillList: skillList,
          updatedAt: new Date(),
        },
      };
    });

    // update the firestore
  };

  const addSkills = async (data) => {
    // update the profile info
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skillList: [
          ...(prev.data.skillList || []),
          {
            ...data,
            id: objectId(),
          },
        ],
        updatedAt: new Date(),
      },
    }));

    // update the firestore
  };

  // return
  return {
    ...state,
    updatePersonalInfo,
    updateEducation,
    addEducation,
    updateExperience,
    addExperience,
    updateSkills,
    addSkills,
  };
};

export { ProviderResume, useResume };

import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useProfile } from "../../contexts/profile";
import { useResume } from "../../contexts/resume";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1";

const useEducationHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();

  const profileData  = useProfile(); 
  const role = profileData?.profile?.personalInfo?.currentRole ||  resumeData?.resume?.targetRole || resumeData?.resume?.personalInfo?.currentRole || "";
  // console.log("resumeData", resumeData)
  type AISuggestionType = {
    results: string[];
    message: string;
  };
  type EducationSummaryStateType = {
    loading: boolean;
    descriptionSuggestions: AISuggestionType | null;
    courseSuggestions: AISuggestionType | null;
    error: string | null;
  };

  const [state, setState] = useState<EducationSummaryStateType>({
    loading: false,
    descriptionSuggestions: null,
    courseSuggestions: null,
    error: null,
  });

  const suggestCourses = async ({
    degree,
    school,
    numberSummary = 3,
    existingCourses = [],
  }: {
    degree: string;
    school: string;
    numberSummary?: number;
    existingCourses?: string[];
  }) => {
    let data = {
      degree,
      school,
      role,
      numberSummary,
      existingCourses: existingCourses.join(","),
    };
    setState({
      loading: true,
      descriptionSuggestions: null,
      error: null,
      courseSuggestions: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/api/openai/eductionCoursesHelper`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        descriptionSuggestions: null,
        courseSuggestions: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        descriptionSuggestions: null,
        courseSuggestions: null,
        error: err.response.data.message,
      });
    }
  };

  const suggestDescription = async ({
    degree,
    school,
    numberSummary = 3,
    existingSummary = "",
    rewrite=false,
  }: {
    degree: string;
    school: string;
    numberSummary?: number;
    existingSummary?: string;
    rewrite?: boolean;
  }) => {
    let data = {
      degree,
      school,
      role,
      numberSummary,
      existingSummary,
        rewrite,
    };
    setState({
      loading: true,
      descriptionSuggestions: null,
      courseSuggestions: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/api/openai/educationSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        descriptionSuggestions: response.data,
        courseSuggestions: null,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        descriptionSuggestions: null,
        courseSuggestions: null,
        error: err.response.data.message,
      });
    }
  };


  return {
    loading: state.loading,
    descriptionSuggestions: state.descriptionSuggestions,
    courseSuggestions: state.courseSuggestions,
    error: state.error,
    suggestCourses,
    suggestDescription,
  };
};

export default useEducationHelper;

import axios from "axios";
import { useState } from "react";
import { useAuth } from "../authContext";
import { useOpenAIContext } from "../customContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

type OpenAIContextType = {
  getEducationSummary: (data: any) => void;
  getExperienceSummary: (data: any) => void;
  getProfessionalSummary: (data: any) => void;
  getSkills: (data: any) => void;
  getEducationCourses: (data: any) => void;
  getExperienceAchivements: (data: any) => void;
  getEducationCoursesSuggestion: (data: any) => void;
  getThemeSuggestions: (data: any) => void;
  getThemeDescription: (data: any) => void;
  getResumeSummary: (data: any) => void;
  getAchivementSuggestion: (data: any) => void;
  parseResume: (data: any) => void;
  loading: boolean;
  data: any;
  error: any;
};

type OpenAIStateType = {
  loading: boolean;
  data: any;
  error: any;
};
const useOpenAI = () => {
  const auth = useAuth();
  const openaiContext = useOpenAIContext();

  const [state, setState] = useState<OpenAIStateType>({
    loading: false,
    data: null,
    error: null,
  });

  const getEducationSummary = async (data: any) => {
    data = { ...openaiContext, ...data };
    setState({
      loading: true,
      data: {},
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/cv-wizard/educationSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getEducationCoursesSuggestion = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/cv-wizard/eductionCoursesHelper`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getExperienceSummary = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/experienceSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getProfessionalSummary = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/professionalSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getSkills = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/skillsSuggestions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getEducationCourses = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/educationCourses`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getExperienceAchivements = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/experienceAchivements`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getThemeSuggestions = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/themeSuggestions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getThemeDescription = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/themeDescription`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getAchivementSuggestion = async (data: any) => {
    data = { ...openaiContext, ...data };

    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/achievementHelper`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const getResumeSummary = async (data: any) => {
    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/cv-wizard/professionalSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data.message,
      });
    }
  };

  const parseResume = async (data: any) => {
    setState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/cv-wizard/parseResume`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "multipart/form-data",
          },
        }
      );

      setState({
        loading: false,
        data: response.data,
        error: null,
      });
      return response.data;
    } catch (err: any) {
      setState({
        loading: false,
        data: null,
        error: err.response.data,
      });
    }
  };

  return {
    ...state,
    getEducationSummary,
    getExperienceSummary,
    getProfessionalSummary,
    getSkills,
    getEducationCourses,
    getExperienceAchivements,
    getEducationCoursesSuggestion,
    getThemeSuggestions,
    getThemeDescription,
    getResumeSummary,
    getAchivementSuggestion,
    parseResume,
  };
};

export { useOpenAI };

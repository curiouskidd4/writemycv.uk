import axios from "axios";
import { useState } from "react";
import { useAuth } from "../authContext";

const BASE_URL =
  process.env.BASE_URL || "http://127.0.0.1:5001/resu-me-a5cff/us-central1";

const useOpenAI = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  const [error, setError] = useState("");

  const getEducationSummary = async (data) => {
    setLoading(true);
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
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getEducationCoursesSuggestion = async (data) => {
    setLoading(true);
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
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getExperienceSummary = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/experienceSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getProfessionalSummary = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/professionalSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getSkills = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/skillsSuggestions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getEducationCourses = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/educationCourses`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data?.result);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getExperienceAchivements = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/experienceAchivements`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data?.result);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getThemeSuggestions = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/themeSuggestions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data?.result);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getThemeDescription = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();
      console.log("lllll1", loading);

      const response = await axios.post(
        `${BASE_URL}/api/openai/themeDescription`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("lllll2", loading);

      setData(response.data?.result);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  const getResumeSummary = async (data) => {
    setLoading(true);
    try {
      const token = await auth.user.getIdToken();

      const response = await axios.post(
        `${BASE_URL}/api/openai/professionalSummary`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data?.result);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
    getEducationSummary,
    getExperienceSummary,
    getProfessionalSummary,
    getSkills,
    getEducationCourses,
    getExperienceAchivements,
    getEducationCoursesSuggestion,
    getThemeSuggestions,
    getThemeDescription,
    getResumeSummary
  };
};

export { useOpenAI };

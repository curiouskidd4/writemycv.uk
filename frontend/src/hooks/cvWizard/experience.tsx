import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useResume } from "../../contexts/resume";
import { useProfile } from "../../contexts/profile";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const useExperienceHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();

  const profileData  = useProfile(); 
  const role = profileData?.profile?.personalInfo?.currentRole ||  resumeData?.resume?.targetRole || resumeData?.resume?.personalInfo?.currentRole || "";

  type AISuggestionType = {
    results: string[];
    message: string;
  };
  type ExperienceSummaryStateType = {
    loading: boolean;
    descriptionSuggestions: AISuggestionType | null;
    error: string | null;
  };

  const [state, setState] = useState<ExperienceSummaryStateType>({
    loading: false,
    descriptionSuggestions: null,
    error: null,
  });

  const suggestDescription = async ({
    experienceRole,
    experienceOrg,
    numberSummary = 3,
    existingSummary = "",
    rewrite = false,
  }: {
    experienceRole: string;
    experienceOrg: string;
    numberSummary?: number;
    existingSummary?: string;
    rewrite: boolean;
  }) => {
    let data = {
      experienceRole,
      experienceOrg,
      role,
      numberSummary,
      existingSummary,
      rewrite
    };
    setState({
      loading: true,
      descriptionSuggestions: null,
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
        descriptionSuggestions: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        descriptionSuggestions: null,
        error: err.response?.data?.message || err.message,
      });
    }
  };

  return {
    loading: state.loading,
    descriptionSuggestions: state.descriptionSuggestions,
    error: state.error,
    suggestDescription,
  };
};

const useAchievementHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();

  type AISuggestionResultType = {
    examples: string[];
    explanations: string[];
  };
  type AISuggestionType = {
    results: AISuggestionResultType[];
    message: string;
  };

  type ThemeSuggestionType = {
    results: string[];
    message: string;
  };

  type AchievementStateType = {
    loading: boolean;
    achievementSuggestion: AISuggestionType | null;
    themeSuggestion: ThemeSuggestionType | null;
    error: string | null;
  };

  const [state, setState] = useState<AchievementStateType>({
    loading: false,
    achievementSuggestion: null,
    themeSuggestion: null,
    error: null,
  });

  const suggestThemes = async ({
    role,
    numberSummary = 3,
    existingThemes,
  }: {
    role: string;
    numberSummary: number;
    existingThemes: string;
  }) => {
    let data = {
      role,
      numberSummary,
      existingThemes,
    };
    setState({
      loading: true,
      achievementSuggestion: null,
      themeSuggestion: null,
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
        achievementSuggestion: null,
        themeSuggestion: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        achievementSuggestion: null,
        themeSuggestion: null,
        error: err.response?.data?.message || err.message,
      });
    }
  };

  const getSuggestions = async ({
    role,
    theme,
    existingAchievement = "",
    numberSummary = 3,
    rewrite = false,
  }: {
    role: string;
    theme: string;
    existingAchievement: string;
    numberSummary: number;
    rewrite: boolean;
  }) => {
    let data = {
      role,
      theme,
      numberSummary,
      existingAchievement,
      rewrite,
    };
    setState({
      loading: true,
      achievementSuggestion: null,
      themeSuggestion: null,
      error: null,
    });
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/cv-wizard/achievementSuggestions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        loading: false,
        achievementSuggestion: response.data,
        themeSuggestion: null,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        achievementSuggestion: null,
        themeSuggestion: null,
        error: err.response?.data?.message || err.message,
      });
    }
  };

  return {
    loading: state.loading,
    achievementSuggestion: state.achievementSuggestion,
    themeSuggestion: state.themeSuggestion,
    error: state.error,
    getSuggestions,
    suggestThemes,
  };
};

export {
  useExperienceHelper,
    useAchievementHelper,
}

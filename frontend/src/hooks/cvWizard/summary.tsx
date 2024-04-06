import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useResume } from "../../contexts/resume";
import { useProfile } from "../../contexts/profile";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const useProfessionalSummaryHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();
  const profile = useProfile();

  type AISuggestionType = {
    result: string[];
    message: string;
  };
  type ProfessionalSummaryStateType = {
    loading: boolean;
    suggestions: AISuggestionType | null;
    error: string | null;
  };

  const [state, setState] = useState<ProfessionalSummaryStateType>({
    loading: false,
    suggestions: null,
    error: null,
  });

  const getSuggestions = async ({
    existingSummary = "",
    numberSuggestions = 3,
    rewrite = false,
  }: {
    existingSummary: string;
    numberSuggestions: number;
    rewrite: boolean;
  }) => {
    let generateFromProfile = profile?.profile?.userId ? true : false;
    let resumeId = resumeData?.resume?.id;

    let data = {
        numberSuggestions,
        rewrite,
        existingSummary,
        generateFromProfile: profile.profile?.userId ? true : false,
        resumeId: generateFromProfile ? null : resumeId,
    };
    setState({
      loading: true,
      suggestions: null,
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
        suggestions: response.data,
        error: null,
      });
    } catch (err: any) {
      setState({
        loading: false,
        suggestions: null,
        error: err.response.data.message,
      });
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    suggestions: state.suggestions,
    getSuggestions,
  };
};

export default useProfessionalSummaryHelper;

import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useResume } from "../../resumeContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1";

const skillHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();

  type AISuggestionType = {
    results: string[];
    message: string;
  };
  type SkillSummaryStateType = {
    loading: boolean;
    suggestions: AISuggestionType | null;
    error: string | null;
  };

  const [state, setState] = useState<SkillSummaryStateType>({
    loading: false,
    suggestions: null,
    error: null,
  });

  const getSuggestions = async ({
    role,
    existingSkills,
    numberSuggestions = 10,
  }: {
    role: string;
    existingSkills: string[];
    numberSuggestions: number;
    existingSummary: string;
  }) => {
    let data = {
      role,
      existingSkills,
      numberSuggestions,
    };
    setState({
      loading: true,
      suggestions: null,
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

export default skillHelper;

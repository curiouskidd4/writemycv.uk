import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useResume } from "../../resumeContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1";

const professionalSummaryHelper = () => {
  const auth = useAuth();
  const resumeData = useResume();

  type AISuggestionType = {
    results: string[];
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
    numberSuggestions = 3,
    rewrite = false,
  }: {
    numberSuggestions: number;
    rewrite: boolean;
  }) => {
    let data = {
        numberSuggestions,
        rewrite,
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

export default professionalSummaryHelper;

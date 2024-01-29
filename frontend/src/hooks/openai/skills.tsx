import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { useAuth } from "../../authContext";
import { useProfile } from "../../contexts/profile";
import { useResume } from "../../contexts/resume";
import { Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import { RESUME_COLLECTION, SKILLS_COLLECTION } from "../../constants";
import { useParams } from "react-router-dom";
import { db } from "../../services/firebase";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const useSkillHelper = () => {
  const { resumeId } = useParams();

  const auth = useAuth();
  const resumeData = useResume();
  const profileData = useProfile();
  const role =
    profileData?.profile?.personalInfo?.currentRole ||
    resumeData?.resume?.targetRole ||
    resumeData?.resume?.personalInfo?.currentRole ||
    "";

  const isResume = resumeData.resume?.targetRole ? true : false;
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

  const _saveSuggestions = async (result: any) => {
    let skillSuggestions = {
      suggestions: result.results,
      createdAt: Timestamp.now(),
      role: role,
    };
    if (isResume && resumeId) {
      let skillDocRef = doc(db, RESUME_COLLECTION, resumeId);
      await setDoc(skillDocRef, {
        skillSuggestions: skillSuggestions,
      });
    } else {
      let skillDocRef = doc(db, SKILLS_COLLECTION, auth.user.uid);

      await setDoc(skillDocRef, {
        skillSuggestions: skillSuggestions,
      });
    }
  };

  const getSuggestions = async ({
    existingSkills,
    numberSuggestions = 10,
  }: {
    existingSkills: string[];
    numberSuggestions?: number;
  }) => {
    if (
      resumeId &&
      resumeData.resume?.skillSuggestions &&
      resumeData.resume?.skillSuggestions.role === role
    ) {
      setState({
        loading: false,
        suggestions: {
          results: resumeData.resume?.skillSuggestions.suggestions || [],
          message: "",
        },
        error: null,
      });
      return;
    } else if (
      profileData.profile?.skills?.skillSuggestions &&
      profileData.profile?.skills?.skillSuggestions.role === role
    ) {
      setState({
        loading: false,
        suggestions: {
          results:
            profileData.profile?.skills?.skillSuggestions.suggestions || [],
          message: "",
        },
        error: null,
      });
      return;
    }
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
        `${BASE_URL}/openai/skillsSuggestions`,
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
      await _saveSuggestions(response.data);
    } catch (err: any) {
      console.log(err);
      setState({
        loading: false,
        suggestions: null,
        error: err.response?.data?.message || err,
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

export default useSkillHelper;

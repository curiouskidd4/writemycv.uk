import React from "react";
import axios from "axios";
import { useAuth } from "../authContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const useResumeAPI = () => {
    const auth = useAuth();

  const copyProfileToResume = async (resumeId: string) => {
    const token = await auth.user.getIdToken();

    return axios.post(
      `${BASE_URL}/resume/copy-profile-data`,
      {
        resumeId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return {
    copyProfileToResume,
  };
};

export default useResumeAPI;
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

  const exportResume = async (resumeId: string) => {
    try {
      const authToken = await auth.user.getIdToken();
      const res = await axios.post(
        `${BASE_URL}/resume/${resumeId}/export-resume`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };


  const importResume = async (resumeId: string, file: any) => {
    const token = await auth.user.getIdToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resumeId", resumeId);

    return axios.post(
      `${BASE_URL}/openai/importToCV`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }


  return {
    copyProfileToResume,
    importResume, 
    exportResume
    
  };
};

export default useResumeAPI;
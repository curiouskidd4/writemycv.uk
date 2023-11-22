import axios from "axios";
import { useState } from "react";
import { useAuth } from "../authContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1";

const useUtils = () => {
  const [state, setState] = useState({
    error: "",
    loading: false,
    data: null,
  });

  const auth = useAuth();

  const exportResumeToDoc = async (data) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/api/download/export-word`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState((prevState) => ({
        ...prevState,
        data: response.data,
        loading: false,
      }));
      return response.data;
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err,
        loading: false,
      }));
    }
  };

  return { ...state, exportResumeToDoc };
};

export default useUtils;

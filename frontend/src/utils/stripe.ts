import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/authContext";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const useStripe = () => {
  type StripeState = {
    error: any;
    loading: boolean;
    data: any;
  };
  const [state, setState] = useState<StripeState>({
    error: "",
    loading: false,
    data: {}
  });

  const auth = useAuth();

  const getStripeSessionUrl = async (data: any) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/stripe/create-checkout-session`,
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

  const getInvoices = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const token = await auth.user.getIdToken();
      const response = await axios.get(`${BASE_URL}/stripe/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  return { ...state, getStripeSessionUrl, getInvoices };
};

export default useStripe;
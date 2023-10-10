import { createContext, useContext, useEffect } from "react";

export const UserContext = createContext(null);
export const FirebaseUserContext = createContext(null);


export const OpenAIContext = createContext({});



export const useOpenAIContext = () => {
  return useContext(OpenAIContext);
};
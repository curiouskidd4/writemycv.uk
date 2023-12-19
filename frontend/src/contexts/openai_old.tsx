// import axios from "axios";
// import { useContext, useState } from "react";
// import { useAuth } from "../authContext";
// import { createContext } from "vm";
// import { useResume } from "./resume";

// const BASE_URL =
//   process.env.REACT_APP_BASE_URL ||
//   "http://127.0.0.1:5001/resu-me-a5cff/us-central1";


// const useOpenAI = () => {
//     const auth = useAuth();
//     const resumeData = useResume();

//     const [state, setState] = useState({
//         loading: false,
//         data: {},
//         error: null,
//     });

//     const getEducationSummary = async (data: any) => {
//         data = { ...openaiContext, ...data };
//         setState({
//           loading: true,
//           data: {},
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/educationSummary`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getEducationCoursesSuggestion = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/eductionCoursesHelper`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getExperienceSummary = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/experienceSummary`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getProfessionalSummary = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/professionalSummary`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getSkills = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/skillsSuggestions`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getEducationCourses = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/educationCourses`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getExperienceAchivements = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/experienceAchivements`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getThemeSuggestions = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/themeSuggestions`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getThemeDescription = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/themeDescription`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
    
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getAchivementSuggestion = async (data: any) => {
//         data = { ...openaiContext, ...data };
    
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/achievementHelper`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
    
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const getResumeSummary = async (data: any) => {
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
    
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/professionalSummary`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
    
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data.message,
//           });
//         }
//       };
    
//       const parseResume = async (data: any) => {
//         setState({
//           loading: true,
//           data: null,
//           error: null,
//         });
//         try {
//           const token = await auth.user.getIdToken();
//           const response = await axios.post(
//             `${BASE_URL}/api/openai/parseResume`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "content-type": "multipart/form-data",
//               },
//             }
//           );
    
//           setState({
//             loading: false,
//             data: response.data,
//             error: null,
//           });
//           return response.data;
//         } catch (err: any) {
//           setState({
//             loading: false,
//             data: null,
//             error: err.response.data,
//           });
//         }
//       };
    





// };
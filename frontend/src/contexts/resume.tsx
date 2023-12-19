import React, { ReactNode } from "react";
import { ref } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../services/firebase";
import { useAuth } from "../authContext";
import { downloadStorageContent } from "../helpers";
import { useDoc } from "../firestoreHooks";
import { RESUME_COLLECTION } from "../constants";
import { FieldValue, Firestore, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { Education, Experience, PersonalInfo, Resume, Skill } from "../types/resume";

type ResumeContextType = {
  loadResumeHTML: () =>  Promise<void>;
  saveEducation:  (educationList: Education[]) => Promise<void>;
  saveExperience: (experienceList: Experience[]) =>  Promise<void>;
  saveSkills: (skillList: Skill[]) =>  Promise<void>;
  saveProfessionalSummary: (professionalSummary: string) =>  Promise<void>;
  savePersonalInfo: (personalInfo: PersonalInfo) =>  Promise<void>;
  saveResumeDetails: (resumeDetails: ResumeDetails) =>  Promise<void>;
  loading: boolean;
  resumeHTMLLoading: boolean;
  resumeHTML: string;
  resume: Resume | null;
};
type ResumeStateType = {
  loading: boolean;
  resumeHTMLLoading: boolean;
  resumeHTML: string;
  resume: Resume | null;
};

type ResumeDetails = {
  name: string;
  targetRole: string| null;
  jobDescription: string | null;
};

const ResumeContext = createContext<ResumeContextType>({
  resume: null,
  loadResumeHTML: async () => {},
  loading: true,
  resumeHTMLLoading: true,
  resumeHTML: "",
  saveEducation: async () => {},
  saveResumeDetails: async () => {},
  saveExperience: async () => {},
  saveSkills: async () => {},
  saveProfessionalSummary: async () => {},
  savePersonalInfo: async () => {},
});

const useResumeProvider = () => {
  const { resumeId } = useParams();
  const auth = useAuth();
  const [state, setState] = useState<ResumeStateType>({
    loading: true,
    resumeHTMLLoading: true,
    resumeHTML: "",
    resume: null,
  });
  //

  useEffect(() => {

    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadResume = async () => {
    const docRef = doc(db, RESUME_COLLECTION, resumeId!);
    const resumeDoc = await getDoc(docRef);
    const firebaseData = resumeDoc.data();
    if (firebaseData) {
      const resumeData = firebaseData as Resume;
      setState((prev) => ({ ...prev, loading: false, resume: resumeData }));
    }
  };

  const loadResumeHTML = async () => {
    setState((prev) => ({ ...prev, resumeHTMLLoading: true }));
    const gsRef = ref(
      storage,
      `userData/${auth.user.uid}/resumes/${resumeId}/resume.html`
    );

    // The data blob contains resume in html format
    let data = await downloadStorageContent(gsRef);
    let resumeHTML = await data.text();

    setState((prev) => ({
      ...prev,
      resumeHTMLLoading: false,
      resumeHTML: resumeHTML,
    }));
  };

  const saveEducation = async (educations: Education[]) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        educationList: educations,
        updatedAt: Timestamp.now(),

      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          educationList: educations,
        },
      }));
    }
  };

  const saveResumeDetails = async (resumeDetails: ResumeDetails) => {
    if (resumeId) {
      debugger
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        name: resumeDetails.name,
        targetRole: resumeDetails.targetRole,
        jobDescription: resumeDetails.jobDescription,
        updatedAt: Timestamp.now(),

      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          name: resumeDetails.name,
          targetRole: resumeDetails.targetRole,
          jobDescription: resumeDetails.jobDescription,
        },
      }));
    }
  }

  const saveExperience = async (experiences: Experience[]) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        experienceList: experiences,
        updatedAt: Timestamp.now(),

      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          experienceList: experiences,
        },
      }));
    }
  }

  const saveSkills = async (skills: Skill[]) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        skillList: skills,
        updatedAt: Timestamp.now(),

      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          skillList: skills,
        },
      }));
    }
  }

  const saveProfessionalSummary = async (professionalSummary: string) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        professionalSummary: professionalSummary,
        updatedAt: Timestamp.now(),

      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          professionalSummary: professionalSummary,
        },
      }));
    }
  }

  const savePersonalInfo = async (personalInfo: PersonalInfo) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        personalInfo: personalInfo,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          personalInfo: personalInfo,
          updatedAt: Timestamp.now(),
        },
      }));
    }
  }





  return {
    saveResumeDetails,
    saveEducation,
    saveExperience,
    saveSkills,
    saveProfessionalSummary,
    savePersonalInfo,
    loadResumeHTML,
    ...state,
  };
};

type ResumeProviderProps = {
  children: ReactNode;
};

const ResumeProvider = ({ children }: ResumeProviderProps) => {
  const resume = useResumeProvider();
  return (
    <ResumeContext.Provider value={resume}>{children}</ResumeContext.Provider>
  );
};

const useResume = () => useContext(ResumeContext);

export { ResumeProvider, useResume };

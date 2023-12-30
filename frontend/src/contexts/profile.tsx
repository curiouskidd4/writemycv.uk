import React, { ReactNode } from "react";
import { ref } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../services/firebase";
import { useAuth } from "../authContext";
import { downloadStorageContent } from "../helpers";
import { useDoc } from "../firestoreHooks";
import {
  EDUCATION_COLLECTION,
  EXPERIENCE_COLLECTION,
  PERSONAL_INFO_COLLECTION,
  PROFESSIONAL_SUMMARY_COLLECTION,
  SKILLS_COLLECTION,
} from "../constants";
import {
  FieldValue,
  Firestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
// import { Education, Experience, PersonalInfo, Resume, Skill } from "../types/resume";
import {

  Profile,
  ProfilePersonalInfo,
  ProfileEducationList,
  ProfileExperienceList,
  ProfileSkillList,
  ProfileProfessionalSummary,
} from "../types/profile";
import { Education, Experience, Skill } from "../types/resume";

type ProfileContextType = {
  saveEducation: (educationList: Education[]) => Promise<void>;
  saveExperience: (experienceList: Experience[]) => Promise<void>;
  saveSkills: (skillList: Skill[]) => Promise<void>;
  saveProfessionalSummary: (professionalSummary: string) => Promise<void>;
  savePersonalInfo: (personalInfo: ProfilePersonalInfo) => Promise<void>;
  loading: boolean;
  profile: Profile | null;
};
type ProfileStateType = {
  loading: boolean;
  //   resumeHTMLLoading: boolean;
  //   resumeHTML: string;
  profile: Profile | null;
};



const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  saveEducation: async () => {},
  saveExperience: async () => {},
  saveSkills: async () => {},
  savePersonalInfo: async () => {},
  saveProfessionalSummary: async () => {},
});

const useProfileContext = () => {
  const auth = useAuth();
  let userId = auth.user.uid;
  const [state, setState] = useState<ProfileStateType>({
    loading: true,
    // resumeHTMLLoading: true,
    // resumeHTML: "",
    profile: null,
  });
  //

  useEffect(() => {
      loadResume();
  }, []);

  const _fixUndefined = (data: any): any => {
    // Replace any underfined with null
    // This is needed because firestore doesn't support undefined

    if (data === undefined) {
      return null;
    }

    if (data === null) {
      return null;
    }

    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (data[key] === undefined) {
        data[key] = null;
      }
    }
    return data;
  };
  const loadResume = async () => {
    const personalInfoRef = doc(db, PERSONAL_INFO_COLLECTION, userId);
    const educationRef = doc(db, EDUCATION_COLLECTION, userId);
    const experienceRef = doc(db, EXPERIENCE_COLLECTION, userId);
    const skillRef = doc(db, SKILLS_COLLECTION, userId);
    const professionalSummaryRef = doc(
      db,
      PROFESSIONAL_SUMMARY_COLLECTION,
      userId
    );

    try {
      const [
        personalInfoDoc,
        educationDoc,
        experienceDoc,
        skillDoc,
        professionalSummaryDoc,
      ] = await Promise.all(
        [
          personalInfoRef,
          educationRef,
          experienceRef,
          skillRef,
          professionalSummaryRef,
        ].map((ref) => getDoc(ref))
      );
      let personalInfo = personalInfoDoc.exists()
        ? (personalInfoDoc.data() as ProfilePersonalInfo)
        : null;
      let education = educationDoc.exists()
        ? (educationDoc.data() as ProfileEducationList)
        : null;
      let experience = experienceDoc.exists()
        ? (experienceDoc.data() as ProfileExperienceList)
        : null;
      let skills = skillDoc.exists()
        ? (skillDoc.data() as ProfileSkillList)
        : null;
      let professionalSummary = professionalSummaryDoc.exists()
        ? (professionalSummaryDoc.data() as ProfileProfessionalSummary)
        : null;

      const profileData: Profile = {
        userId: auth.user.uid,
        personalInfo,
        education,
        experience,
        skills,
        professionalSummary,
      };

      setState((prev) => ({ ...prev, loading: false, profile: profileData }));
    } catch (err) {
      console.log(err);
      setState((prev) => ({ ...prev, loading: false, profile: null }));
    }
  };

  const saveEducation = async (educations: Education[]) => {
    let educationsFixed = educations.map((edu) => {
      return _fixUndefined(edu);
    });
    if (userId) {
      const docRef = doc(db, EDUCATION_COLLECTION, userId);
      await updateDoc(docRef, {
        educationList: educationsFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          education: {
            ...prev.profile!.education!,
            educationList: educationsFixed,
          },
        },
      }));
    }
  };

  const saveExperience = async (experiences: Experience[]) => {
    let experiencesFixed = experiences.map((exp) => {
      return _fixUndefined(exp);
    }
    );
    if (userId) {
      const docRef = doc(db, EXPERIENCE_COLLECTION, userId);
      await updateDoc(docRef, {
        experienceList: experiencesFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          experience: {
            ...prev.profile!.experience!,
            experienceList: experiencesFixed,
          },
        },
      }));
    }
  };

  const saveSkills = async (skills: Skill[]) => {
    if (userId) {
      const docRef = doc(db, SKILLS_COLLECTION, userId);
      await updateDoc(docRef, {
        skillList: skills,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          skills: {
            ...prev.profile!.skills!,
            skillList: skills,
          },
        },
      }));
    }
  };

  const saveProfessionalSummary = async (professionalSummary: string) => {
    let professionalSummaryFixed = _fixUndefined(professionalSummary);
    if (userId) {
      const docRef = doc(db, PROFESSIONAL_SUMMARY_COLLECTION, userId);
      await updateDoc(docRef, {
        professionalSummary: professionalSummaryFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          professionalSummary: {
            ...prev.profile!.professionalSummary!,
            professionalSummary: professionalSummaryFixed,
          },
        },
      }));
    }
  };

  const savePersonalInfo = async (personalInfo: ProfilePersonalInfo) => {
    let personalInfoFixed = _fixUndefined(personalInfo);
    if (userId) {
      const docRef = doc(db, PERSONAL_INFO_COLLECTION, userId);
      await updateDoc(docRef, {
        ...personalInfoFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile!,
          personalInfo: {
            ...prev.profile!.personalInfo!,
            ...personalInfoFixed,
          },
          updatedAt: Timestamp.now(),
        },
      }));
    }
  };

  return {
    saveEducation,
    saveExperience,
    saveSkills,
    saveProfessionalSummary,
    savePersonalInfo,
    ...state,
  };
};

type ProfileProviderProps = {
  children: ReactNode;
};

const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const profile = useProfileContext();
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => useContext(ProfileContext);

export { ProfileProvider, useProfile };

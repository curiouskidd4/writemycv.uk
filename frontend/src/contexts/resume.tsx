import React, { ReactNode } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../services/firebase";
import { useAuth } from "../authContext";
import { downloadStorageContent } from "../helpers";
import { useDoc } from "../firestoreHooks";
import { RESUME_COLLECTION } from "../constants";
import {
  FieldValue,
  Firestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
  DocumentReference,
} from "firebase/firestore";
import {
  Award,
  CandidateDetails,
  Education,
  Experience,
  Language,
  OtherInformation,
  PersonalInfo,
  Publication,
  Resume,
  Skill,
  Volunteering,
} from "../types/resume";
import { message } from "antd";
import ObjectID from "bson-objectid";

type ResumeContextType = {
  loadResumeHTML: () => Promise<void>;
  saveEducation: (educationList: Education[]) => Promise<void>;
  saveExperience: (experienceList: Experience[]) => Promise<void>;
  saveSkills: (skillList: Skill[]) => Promise<void>;
  saveProfessionalSummary: (professionalSummary: string) => Promise<void>;
  savePersonalInfo: (personalInfo: PersonalInfo) => Promise<void>;
  saveResumeDetails: (resumeDetails: ResumeDetails) => Promise<void>;
  saveAwards: (awards: Award[]) => Promise<void>;
  savePublication: (publications: Publication[]) => Promise<void>;
  saveVolunteering: (volunteerings: Volunteering[]) => Promise<void>;
  saveLanguages: (languages: Language[]) => Promise<void>;
  downloadResume: () => Promise<void>;
  softDeleteResume: () => Promise<void>;
  copyPublicLink: () => Promise<string>;
  markResumeComplete: () => Promise<void>;
  getResumeURL: () => Promise<string>;
  saveCandidateDetails: (candidateDetails: CandidateDetails) => Promise<void>;
  saveOtherInformation: (otherInformationList: OtherInformation[]) => Promise<void>;

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
  targetRole: string | null;
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
  downloadResume: async () => {},
  softDeleteResume: async () => {},
  copyPublicLink: async () => "",
  markResumeComplete: async () => {},
  saveAwards: async () => {},
  savePublication: async () => {},
  saveVolunteering: async () => {},
  saveLanguages: async () => {},
  getResumeURL: async () => "",
  saveCandidateDetails: async () => {},
  saveOtherInformation: async () => {},
});

const useResumeProvider = () => {
  const { resumeId } = useParams();
  const auth = useAuth();
  const userId = auth.user.uid;
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

  const _fixId = (data: any): any => {
    if (!data.id){
      data.id = ObjectID().toHexString();
    }
    return data;
  }

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
    const docRef = doc(db, RESUME_COLLECTION, resumeId!);
    const resumeDoc = await getDoc(docRef);
    const firebaseData = resumeDoc.data();
    if (firebaseData) {
      const resumeData = firebaseData as Resume;

      resumeData.awardList = (resumeData.awardList || []).map(_fixId)
      resumeData.educationList = (resumeData.educationList || []).map(_fixId)
      resumeData.experienceList = (resumeData.experienceList || []).map(_fixId)
      
      resumeData.publicationList = (resumeData.publicationList || []).map(_fixId)
      resumeData.volunteeringList = (resumeData.volunteeringList || []).map(_fixId)


      // Check if all the mandatory fields are present in the resume
      // If not, create them
      let experienceList = resumeData.experienceList;
      let educationList = resumeData.educationList;
      let skillList = resumeData.skillList;
      let personalInfo = resumeData.personalInfo;
      


      if (!experienceList) {
        experienceList = [];
      }
      if (!educationList) {
        educationList = [];
      }
      if (!skillList) {
        skillList = [];
      }

      for (let i = 0; i < experienceList.length; i++) {
        experienceList[i] = _fixUndefined(experienceList[i]);
        experienceList[i].startDate = experienceList[i].startDate || null;
        experienceList[i].endDate = experienceList[i].endDate || null;
      }

      for (let i = 0; i < educationList.length; i++) {
        educationList[i] = _fixUndefined(educationList[i]);
        educationList[i].startDate = educationList[i].startDate || null;
        educationList[i].endDate = educationList[i].endDate || null;
      }

      for (let i = 0; i < skillList.length; i++) {
        skillList[i] = _fixUndefined(skillList[i]);
      }

      personalInfo = _fixUndefined(personalInfo);

      // Update the resume with the fixed data
      resumeData.experienceList = experienceList;
      resumeData.educationList = educationList;

      resumeData.skillList = skillList;
      resumeData.personalInfo = personalInfo;
      console.log(resumeData);
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

  const downloadResume = async () => {
    const gsRef = ref(
      storage,
      `userData/${userId}/resumes/${resumeId}/resume.pdf`
    );

    // Download the resume
    let data = await downloadStorageContent(gsRef);
    // Convert blob to url
    let url = URL.createObjectURL(data);
    // Open the url in new tab
    window.open(url, "_blank");
  };

  const getResumeURL = async () => {
    const gsRef = ref(
      storage,
      `userData/${userId}/resumes/${resumeId}/resume.pdf`
    );

    // Get the download URL
    let url = await getDownloadURL(gsRef);
    return url;
  }


  const saveEducation = async (educations: Education[]) => {
    let educationsFixed = educations.map((edu) => {
      return _fixUndefined(edu);
    });
    // debugger;

    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        educationList: educationsFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          educationList: educationsFixed,
        },
      }));
    }
  };

  const saveResumeDetails = async (resumeDetails: ResumeDetails) => {
    if (resumeId) {
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
  };

  const saveExperience = async (experiences: Experience[]) => {
    let experiencesFixed = experiences.map((exp) => {
      return _fixUndefined(exp);
    });
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        experienceList: experiencesFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          experienceList: experiencesFixed,
        },
      }));
    }
  };

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
  };

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
  };

  const savePersonalInfo = async (personalInfo: PersonalInfo) => {
    let personalInfoFixed = _fixUndefined(personalInfo);
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        personalInfo: personalInfoFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          personalInfo: personalInfoFixed,
          updatedAt: Timestamp.now(),
        },
      }));
    }
  };

  const saveAwards = async (awards: Award[]) => {
    let awardsFixed = awards.map((award) => {
      return _fixUndefined(award);
    });
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        awardList: awardsFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          awardList: awardsFixed,
        },
      }));
    }
  }

  const savePublication = async (publications: Publication[]) => {
    let publicationsFixed = publications.map((pub) => {
      return _fixUndefined(pub);
    });
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        publicationList: publicationsFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          publicationList: publicationsFixed,
        },
      }));
    }
  }

  const saveVolunteering = async (volunteerings: Volunteering[]) => {
    let volunteeringsFixed = volunteerings.map((vol) => {
      return _fixUndefined(vol);
    });
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        volunteeringList: volunteeringsFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          volunteeringList: volunteeringsFixed,
        },
      }));
      debugger
    }
  }

  const saveLanguages = async (languages: Language[]) => {
    let languagesFixed = languages.map((lang) => {
      return _fixUndefined(lang);
    });
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        languageList: languagesFixed,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          languageList: languagesFixed,
        },
      }));
    }
  }

  const saveOtherInformation = async (otherInformationList: OtherInformation[]) => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        otherInformationList: otherInformationList,
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          otherInformationList: otherInformationList,
        },
      }));
    }
  }

  const saveCandidateDetails = async (candidateDetails: CandidateDetails) => {
    // Remove any undefined fields
    candidateDetails = _fixUndefined(candidateDetails);
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        candidateDetails: candidateDetails,
        personalInfo : {
          firstName: candidateDetails.firstName,
          lastName: candidateDetails.lastName,
          currentRole: candidateDetails.currentRole,
          location: candidateDetails.location,
          ...state.resume?.personalInfo
        },
        updatedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          candidateDetails: candidateDetails,
        },
      }));
    }
  }

  const copyPublicLink = async () => {
    // Get public link
    let publicItemId = state.resume?.publicResumeId;
    let item: DocumentReference;

    if (!publicItemId) {

      console.log({
        resumeId: resumeId,
        userId: auth.user.uid,
        createdAt: Timestamp.now(),
      })
      item = await addDoc(collection(db, "publicResume"), {
        resumeId: resumeId,
        userId: auth.user.uid,
        createdAt: Timestamp.now(),
      });
      publicItemId = item.id;

      if (publicItemId) {
        // Set the public resume ID in the resume
        let resumeRef = doc(db, "resumes", resumeId!);
        await updateDoc(resumeRef, {
          publicResumeId: publicItemId,
        });

        setState((prev) => ({
          ...prev,
          resume: {
            ...prev.resume!,
            publicResumeId: publicItemId!,
          },
        }));
      }
    } else {
      item = doc(db, "publicResume", publicItemId);
    }


    if (publicItemId) {
      let publicLink =
        window.location.origin + "/public-resume/" + publicItemId;
      // Copy to clipboard
      return publicLink;
    } else {
      message.error("Something went wrong");
      return "";  
    }
  };

  const softDeleteResume = async () => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        deletedAt: Timestamp.now(),
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          isDeleted: true,
          deletedAt: Timestamp.now(),
        },
      }));
    }
    
  };

  const markResumeComplete = async () => {
    if (resumeId) {
      const docRef = doc(db, RESUME_COLLECTION, resumeId);
      await updateDoc(docRef, {
        isComplete: true,
      });

      // Update the local state
      setState((prev) => ({
        ...prev,
        resume: {
          ...prev.resume!,
          isComplete: true,
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
    downloadResume,
    softDeleteResume, 
    copyPublicLink,
    markResumeComplete,
    saveAwards,
    savePublication,
    saveVolunteering,
    saveLanguages,
    getResumeURL,
    saveCandidateDetails, 
    saveOtherInformation,
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

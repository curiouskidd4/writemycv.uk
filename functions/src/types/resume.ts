import { Education } from "./education";
import { Experience } from "./experience";
import { PersonalInfo } from "./personalInfo";
import { Skill } from "./skills";
import { Timestamp } from "firebase-admin/firestore";

interface Volunteering {
    id  : string;
    title: string;
    startDate: Timestamp;
    endDate: Timestamp | null;
    description: string;
  }

  interface Publication {
    id: string;
    title: string;
    description: string;
    link: string | null;
    date: Timestamp;
  }


interface Language {
    name: string;
    fluency: string;
  }

  interface Award {
    id: string;
    title: string;
    organization: string | null;
    date: Timestamp;
    description: string;
  }
  
  
  
interface Resume {
    id: string;
    name: string;
    userId: string;
    role: string;
    geography?: string;
    sector?: string;
    companies: string[];
    createdAt: string;
    updatedAt?: string;
    experienceList?: Experience[];
    personalInfo?: PersonalInfo;
    educationList?: Education[];
    awardList: Award[];
    languageList: Language[];
    publicationList: Publication[];
    volunteeringList: Volunteering[];
    skillList?: Skill[];
    professionalSummary?: string;
    sectionOrder?: string[];
    exportHash?: string;
    jobDescription?: string;
}

export { Resume, Volunteering, Publication, Language, Award };
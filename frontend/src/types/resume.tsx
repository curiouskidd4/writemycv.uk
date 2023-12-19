import { Timestamp } from "@firebase/firestore-types";

interface PhoneNumber {
  countryCode: string;
  number: string;
}

interface PersonalInfo {
  city: string | null;
  country: string | null;
  linkedIn: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: PhoneNumber | null;
  currentRole: string | null;
  location: string | null;
}

interface EducationDisseration {
  title: string;
  abstract: string;
  supervisor: string;
}

interface AIEducationSuggestion {
  descriptions: string[];
  courses: string[];
  degree: string;
  createdAt: Timestamp;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  grade: string | null;
  modules: string | null;
  dissertation: EducationDisseration | null;
  description: string | null;
  aiSuggestions: AIEducationSuggestion[] | null;
}

interface EducationList {
  educationList: Education[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}
interface Achievement {
  theme: string | null;
  description: string;
}

interface AIExperienceSuggestion {
  descriptions: string[];
  achievements: string[];
  role: string;
  createdAt: Timestamp;
}
interface Experience {
  id: string;
  employerName: string;
  location?: string;
  position: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  description: string;
  achievements: Achievement[] | null;
  aiSuggestions: AIExperienceSuggestion[] | null;
}

// updatedAt as firebase datetime
interface ExperienceList {
  experienceList: Experience[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Skill {
  name: string;
  level: string;
}

interface SkillList {
  skillList: Skill[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface aiSkillSuggestions {
  suggestions: string[];
  createdAt: Timestamp;
  role: string;
}

interface Resume {
  id: string;
  targetRole: string | null;
  jobDescription: string | null;
  name: string;
  role: string;
  personalInfo: PersonalInfo;
  educationList: Education[];
  experienceList: Experience[];
  skillList: Skill[];
  skillSuggestions: aiSkillSuggestions[] | null;
  professionalSummary: string | null;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}
export type {
  PersonalInfo,
  Education,
  EducationList,
  Experience,
  Achievement,
  ExperienceList,
  Skill,
  SkillList,
  PhoneNumber,
  EducationDisseration,
  Resume,
};

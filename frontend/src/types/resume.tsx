import { Timestamp } from "@firebase/firestore-types";

interface PublicResume {
  resumeId: string;
  userId: string;
  createdAt: Timestamp;
}
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
  // modules: string | null;
  modules: string[] | null;
  dissertation: EducationDisseration | null;
  description: string | null;
  aiSuggestions: AIEducationSuggestion[] | null;
  isNew?: boolean;
}


interface EducationList {
  educationList: Education[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Award {
  id: string;
  title: string;
  organization: string | null;
  date: Timestamp;
  description: string;
}

interface AwardList {
  awardList: Award[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Achievement {
  id?: string;
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
  endDate: Timestamp|null;
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

interface Language {
  name: string;
  fluency: string;
}

interface LanguageList {
  languageList: Language[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Publication {
  id: string;
  title: string;
  description: string;
  link: string | null;
  date: Timestamp;
}

interface PublicationList {
  publicationList: Publication[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Volunteering {
  id  : string;
  title: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  description: string;
}

interface VolunteeringList {
  volunteeringList: Volunteering[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
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

interface CandidateDetails {
  firstName: string;
  lastName: string;
  currentRole: string;
  location?: string;
  salaryExpectation?: string;
  availability?: string;
  candidateSummary?: string;
}

interface OtherInformation {
  id: string;
  title: string;
  description: string;
}


interface Resume {
  id: string;
  targetRole: string | null;
  jobDescription: string | null;
  name: string;
  role: string;
  personalInfo: PersonalInfo;
  candidateDetails?: CandidateDetails;
  educationList: Education[];
  experienceList: Experience[];
  awardList: Award[];
  publicationList: Publication[];
  volunteeringList: Volunteering[];
  languageList: Language[];
  skillList: Skill[];
  otherInformationList?: OtherInformation[];
  skillSuggestions: aiSkillSuggestions | null;
  professionalSummary: string | null;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
  isDeleted: boolean;
  userId: string;
  publicResumeId: string | null;
  templateId: string | null;
  sectionOrder?: string[];

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
  PublicResume, 
  Language, Award, AwardList, 
  Publication, PublicationList,
  Volunteering, VolunteeringList,
  LanguageList,
  CandidateDetails,
  OtherInformation,
};

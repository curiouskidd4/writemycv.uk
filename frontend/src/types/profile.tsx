import { Timestamp } from "@firebase/firestore-types";
import {
  Skill,
  Education,
  Experience,
  AwardList,
  PublicationList,
  Volunteering,
  VolunteeringList,
  LanguageList,
} from "./resume";
interface PhoneNumber {
  countryCode: string;
  number: string;
}

interface ProfilePersonalInfo {
  city: string | null;
  country: string | null;
  linkedin: string | null;
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

// interface ProfileEducation {
//   id: string;
//   school: string;
//   degree: string;
//   startDate: Timestamp;
//   endDate: Timestamp | null;
//   grade: string | null;
//   modules: string | null;
//   dissertation: EducationDisseration | null;
//   description: string | null;
//   aiSuggestions: AIEducationSuggestion[] | null;
// }

interface ProfileEducationList {
  educationList: Education[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}
interface ProfileAchievement {
  theme: string | null;
  description: string;
}

interface AIExperienceSuggestion {
  descriptions: string[];
  achievements: string[];
  role: string;
  createdAt: Timestamp;
}
// interface ProfileExperience {
//   id: string;
//   employerName: string;
//   location?: string;
//   position: string;
//   startDate: Timestamp;
//   endDate?: Timestamp;
//   description: string;
//   achievements: ProfileAchievement[] | null;
//   aiSuggestions: AIExperienceSuggestion[] | null;
// }

// updatedAt as firebase datetime
interface ProfileExperienceList {
  experienceList: Experience[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

// interface Skill {
//   name: string;
//   level: string;
// }
interface aiSkillSuggestions {
  suggestions: string[];
  createdAt: Timestamp;
  role: string;
}

interface ProfileSkillList {
  skillList: Skill[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  skillSuggestions: aiSkillSuggestions | null;
  userId: string;
}
interface AIProfessionalSummarySuggestion {
  suggestions: string[];
  createdAt: Timestamp;
}
interface ProfileProfessionalSummary {
  professionalSummary: string;
  aiSuggestions: AIProfessionalSummarySuggestion | null;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

interface Profile {
  personalInfo: ProfilePersonalInfo | null;
  education: ProfileEducationList | null;
  experience: ProfileExperienceList | null;
  skills: ProfileSkillList | null;
  professionalSummary: ProfileProfessionalSummary | null;
  awards: AwardList | null;
  publications: PublicationList | null;
  volunteering: VolunteeringList | null;
  languages: LanguageList | null;
  userId: string;
  // updatedAt: Timestamp;
  // createdAt: Timestamp;
}
export type {
  ProfilePersonalInfo,
  ProfileEducationList,
  ProfileAchievement,
  ProfileExperienceList,
  ProfileSkillList,
  PhoneNumber,
  EducationDisseration,
  ProfileProfessionalSummary,
  Profile,
};

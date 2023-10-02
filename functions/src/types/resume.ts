import { Education } from "./education";
import { Experience } from "./experience";
import { PersonalInfo } from "./personalInfo";
import { Skill } from "./skills";

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
    skillList?: Skill[];
    professionalSummary?: string;
}

export { Resume };
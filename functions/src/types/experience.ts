import { Timestamp } from "firebase-admin/firestore";

interface Experience {
    id: string;
    employerName: string;
    location?: string;
    position: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    description: string;
}

// updatedAt as firebase datetime 
interface ExperienceInput {
    experienceList: Experience[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}
export { Experience, ExperienceInput };
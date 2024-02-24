import { Timestamp } from "firebase-admin/firestore";
import { Award, Publication, Volunteering } from "./resume";

interface EducationDisseration {
    title: string;
    abstract?: string;
    supervisor?: string;
}
interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: Timestamp;
    endDate?: Timestamp;
    grade?: string;
    modules?: string;
    dissertation?: EducationDisseration;
    description?: string;
}

interface EducationInput {
    educationList: Education[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}

interface AwardInput {
    awardList: Award[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}

interface PublicationInput {
    publicationList: Publication[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}

interface VolunteeringInput {
    volunteeringList: Volunteering[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}
export { Education, EducationInput, EducationDisseration, 
    AwardInput, PublicationInput, VolunteeringInput};
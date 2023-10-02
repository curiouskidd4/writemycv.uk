import { Timestamp } from "firebase-admin/firestore";

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

export { Education, EducationInput, EducationDisseration };
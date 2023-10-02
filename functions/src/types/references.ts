import { Timestamp } from "firebase-admin/firestore";

interface Reference {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
}

// updatedAt as firebase datetime
interface ReferenceInput {
    referenceList: Reference[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}

export { Reference, ReferenceInput };
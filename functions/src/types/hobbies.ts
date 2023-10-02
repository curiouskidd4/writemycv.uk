import { Timestamp } from "firebase-admin/firestore";

interface Hobbies {
    hobbiesList: string[];
    updatedAt: Timestamp;
    createdAt: Timestamp;
    userId: string;
}    

export { Hobbies };
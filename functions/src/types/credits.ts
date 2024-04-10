import { Timestamp } from "firebase-admin/firestore";

enum CreditRef {
    PURCHASE = "PURCHASE",
    PROMOTION = "PROMOTION",
    REFUND = "REFUND",
    CREDIT = "CREDIT",
}

interface CreditItem {
    id: string;
    type: "credit" | "debit";
    message?: string;
    planId?: string;
    planRef?: string;
    key: string;
    amount: number;
    createdAt: Timestamp;
}

interface CreditHistory {
    userId: string;
    credits: number;
    totalCredits: number;
    updatedAt: Timestamp
}

export { CreditItem, CreditHistory };
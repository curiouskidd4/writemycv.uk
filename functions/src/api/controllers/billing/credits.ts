import { firestore } from "firebase-admin";
import { CreditItem } from "../../../types/credits";
import { db } from "../../../utils/firebase";
import { v4 as uuidv4 } from 'uuid';
import { BILLING_PRODUCTS, CREDIT_PACKAGES, CREDITS_MAP, DEDUCT_TYPES } from "../../../utils/billing";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const addCredits = async (
  planRef: BILLING_PRODUCTS | CREDIT_PACKAGES,
  userId: string
) => {
  let amount = CREDITS_MAP[planRef];
  console.log("Adding credits", planRef, amount)

  if (!amount) {
    return;
  }

  let credit: CreditItem = {
    id: uuidv4(),
    type: "credit",
    key: planRef,
    amount: amount,
    createdAt: Timestamp.now(),
  };

  // This is to check if the next credit due should be updated
  let shouldUpdateNextCreditDue = false;
  if (
    planRef === BILLING_PRODUCTS.PRO_BI_WEEKLY ||
    planRef === BILLING_PRODUCTS.PRO_QUATERLY ||
    planRef === BILLING_PRODUCTS.PRO_YEARLY
  ) {
    shouldUpdateNextCreditDue = true;
  }

  let ref = db
    .collection("credits")
    .doc(userId)
    .collection("history")
    .doc(credit.id);

  await ref.set(credit);

  // Update user credits
  let creditRef = db.collection("credits").doc(userId);
  // Check if it exists
  let creditDoc = await creditRef.get();
  if (!creditDoc.exists) {
    await creditRef.set({
      userId: userId,
      credits: amount,
      totalCredits: amount,
      nextCreditDue: shouldUpdateNextCreditDue
        ? Timestamp.now().seconds + 24 * 60 * 60 * 14
        : null,
      updatedAt: Timestamp.now(),
    });
  } else {
    await creditRef.update({
      credits: FieldValue.increment(amount),
        totalCredits: FieldValue.increment(amount),
      updatedAt: Timestamp.now(),
    });
  }

  // Update user doc
  let userRef = db.collection("users").doc(userId);
  await userRef.update({
    nextCreditDue: shouldUpdateNextCreditDue
      ? Timestamp.now().seconds + 24 * 60 * 60 * 14
      : null,
  });

  //   await userRef.update({
  //     credits: firestore.FieldValue.increment(amount),
  //     updatedAt: firestore.Timestamp.now(),
  //   });
  //   return;
};

const deductCredits = async (deductRef: DEDUCT_TYPES, userId: string) => {
  let amount = 1;
  if (deductRef === DEDUCT_TYPES.RESUME_DOWNLOAD) {
    amount = 10;
  } else if (deductRef === DEDUCT_TYPES.RESUME_UPLOAD) {
    amount = 50;
  } else {
    return;
  }

  let credit: CreditItem = {
    id: uuidv4(),
    type: "debit",
    key: deductRef,
    amount: amount,
    createdAt: Timestamp.now(),
  };

  let ref = db
    .collection("credits")
    .doc(userId)
    .collection("history")
    .doc(credit.id);

  await ref.set(credit);

  // Update user credits
  let userRef = db.collection("users").doc(userId);
  await userRef.update({
    credits: FieldValue.increment(-amount),
    updatedAt: Timestamp.now(),
  });
  return;
};

export { addCredits, deductCredits };
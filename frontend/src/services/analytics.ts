import { analytics } from "./firebase";
import {
  setUserId as setUserIdA,
  setUserProperties as setUserPropertiesA,
  logEvent as logEventA,
} from "firebase/analytics";

const setUserId = (userId: string) => {
  setUserIdA(analytics, userId);
};

const setUserProperties = (properties: { [key: string]: any }) => {
  setUserPropertiesA(analytics, properties);
};

const logEvent = (eventName: string, properties?: { [key: string]: any }) => {
  logEventA(analytics, eventName, properties);
};

const beginCheckoutEvent = (
  planID: string,
  planName: string,
  category: string,
  priceID: string,
  price: string
) => {
  logEvent("begin_checkout", {
    currency: "EUR",
    value: price,
    items: [
      {
        item_id: planID,
        item_name: planName,
        item_category: category,
        quantity: 1,
        price: price,
      },
    ],
  });
};

const purchaseEvent = (
  planID: string,
  planName: string,
  category: string,
  transactionId: string,
  priceID: string,
  price: string
) => {
  logEvent("purchase", {
    currency: "EUR",
    value: price,
    transaction_id: transactionId,
    items: [
      {
        item_id: planID,
        item_name: planName,
        item_category: category,
        quantity: 1,
        price: price,
      },
    ],
  });
};

const ga = {
  setUserId,
  setUserProperties,
  logEvent,
  beginCheckoutEvent,
  purchaseEvent,
};
export default ga;

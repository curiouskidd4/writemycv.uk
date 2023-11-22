import { defineBoolean, defineString } from "firebase-functions/params";

const OPEN_API_KEY = defineString("OPEN_API_KEY");
const STRIPE_BACKEND_KEY = defineString("STRIPE_BACKEND_KEY");
const ADOBE_CLIENT_ID = defineString("ADOBE_CLIENT_ID");
const ADOBE_CLIENT_SECRET = defineString("ADOBE_CLIENT_SECRET");

export { OPEN_API_KEY, STRIPE_BACKEND_KEY, ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET };
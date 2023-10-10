import { defineBoolean, defineString } from "firebase-functions/params";

const OPEN_API_KEY = defineString("OPEN_API_KEY");
const STRIPE_BACKEND_KEY = defineString("STRIPE_BACKEND_KEY");
export { OPEN_API_KEY, STRIPE_BACKEND_KEY };
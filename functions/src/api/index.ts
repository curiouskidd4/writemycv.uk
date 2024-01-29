// app.ts

import express from "express";
import { generalRoutes, openaiRoutes, resumeDownloadRoutes, resumeRoutes, stripeRoutes, stripeWebhookRoutes, unAuth } from "./routes";
import { db, bucket, functions } from "../utils/firebase";
import {
  extractFiles,
  validateFirebaseIdToken,
  validationErrorMiddleware,
} from "./middlewares/validation";
import bodyParser from "body-parser";
import cors from "cors";
import { HttpsOptions, onRequest } from "firebase-functions/v2/https";
// import { Sentry } from "../utils/sentry";

const app = express();
app.use(cors({}));

// app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);


// Middleware for all routes
app.use("/stripe", bodyParser.raw({ type: '*/*' }),  stripeWebhookRoutes);
app.use("/unauth", unAuth);
app.use(extractFiles);

app.use(validateFirebaseIdToken);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use("/openai", openaiRoutes);
app.use("/", generalRoutes);
app.use("/resume", resumeRoutes);




app.use(express.json());
app.use("/stripe", stripeRoutes);

// Use the route files
app.use("/download", resumeDownloadRoutes);

// app.use("/workout", workoutRoutes);
// app.use("/strength-workout", strengthWorkout);
// app.use("/misc", miscRoutes);
// app.use("/debug-sentry", debugSentryRoutes);

app.use(validationErrorMiddleware);

// app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

// Expose Express API as a single Cloud Function:
// let api = functions.runWith({
//   timeoutSeconds: 400,

// }).https.onRequest(app);

let options = {
  timeoutSeconds: 400,
  memory: "2GiB",
} as HttpsOptions;

let api =  onRequest(options, app)
export { api };

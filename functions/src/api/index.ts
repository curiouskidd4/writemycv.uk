// app.ts

import express from "express";
import {
    openaiRoutes
} from "./routes";
import { db, bucket, functions } from "../utils/firebase";
import {
  extractFiles,
  validateFirebaseIdToken,
  validationErrorMiddleware,
} from "./middlewares/validation";
import bodyParser from "body-parser";
import cors from "cors";
// import { Sentry } from "../utils/sentry";

const app = express();
app.use(cors(
    {
        
    }
));

// app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

// Middleware for all routes
app.use(extractFiles);
app.use(validateFirebaseIdToken);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

console.log(openaiRoutes)
// Use the route files
app.use("/openai", openaiRoutes);
// app.use("/workout", workoutRoutes);
// app.use("/strength-workout", strengthWorkout);
// app.use("/misc", miscRoutes);
// app.use("/debug-sentry", debugSentryRoutes);

app.use(validationErrorMiddleware);

// app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

// Expose Express API as a single Cloud Function:
let api = functions.https.onRequest(app);

export { api };

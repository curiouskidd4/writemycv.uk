import { Resume } from "../../types/resume";
import { functions } from "../../utils/firebase";
import _ from "lodash";
import { populateResumeDetails } from "./actions/populateResumeDetails";
import { exportResume } from "./actions/export";

// Cloud functions which depends on workout update (create/update/delete)
export const onWrite = functions.firestore
  .document("resumes/{resumeId}")
  .onWrite(async (change, context) => {
    try {
      const oldData = change.before.data()
        ? (change.before.data() as Resume)
        : null;
      const newData = change.after.data()
        ? (change.after.data() as Resume)
        : null;

      // If new data exists
      if (newData) {
        await populateResumeDetails(context.params.resumeId, newData.userId);
        await exportResume(context.params.resumeId, newData.userId);
      }
    } catch (error) {}
  });

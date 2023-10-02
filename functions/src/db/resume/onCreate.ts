import { Resume } from "../../types/resume";
import { functions } from "../../utils/firebase";
import _ from "lodash";
import { populateResumeDetails } from "./actions/populateResumeDetails";
import { exportResume } from "./actions/export";

// Cloud functions which depends on workout update (create/update/delete)
export const onWrite = functions.firestore
  .document("resumes/{resumeId}")
  .onCreate(async (snapshot, context) => {
    try {
      const data = snapshot.data() ? (snapshot.data() as Resume) : null;

      // If new data exists
      if (data) {
        await populateResumeDetails(context.params.resumeId, data.userId);
        await exportResume(context.params.resumeId, data.userId);
      }
    } catch (error) {}
  });

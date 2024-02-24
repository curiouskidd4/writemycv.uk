import { Resume } from "../../types/resume";
import { functions } from "../../utils/firebase";
import _ from "lodash";
import { populateResumeDetails } from "./actions/populateResumeDetails";
import { exportResume } from "./actions/export";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

// Cloud functions which depends on workout update (create/update/delete)
export const onWrite = onDocumentWritten(
  {
    memory: "1GiB",
    timeoutSeconds: 300,
    document: "resumes/{resumeId}",
  },
  async (event) => {
    try {
      const oldData = event.data?.before.data()
        ? (event.data?.before.data() as Resume)
        : null;
      const newData = event.data?.after.data()
        ? (event.data?.after.data() as Resume)
        : null;

      const resumeId = event.params.resumeId;

      // Check if resume is newly created
      if (!oldData && newData) {
        await populateResumeDetails(resumeId, newData.userId);
        await exportResume(resumeId, newData.userId);
        return;
      }
      // If new data exists
      if (newData) {
        // await populateResumeDetails(context.params.resumeId, newData.userId);
        await exportResume(resumeId, newData.userId);
      }
    } catch (error) {}
  }
);

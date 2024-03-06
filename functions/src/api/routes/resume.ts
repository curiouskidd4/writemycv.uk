import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types/requests";
import { populateResumeDetails } from "../../db/resume/actions/populateResumeDetails";
import { db } from "../../utils/firebase";
import { exportResume } from "../../db/resume/actions/export";

const router = Router();
router.post("/copy-profile-data", async (req: CustomRequest, res: Response) => {
  let user = req.user;
  let resumeId = req.body.resumeId;
  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  if (!resumeId) {
    res.status(400).send("Resume not found");
    return;
  }

  try {
    await populateResumeDetails(resumeId, user.uid);
    res.status(200).send({ success: true });
    return;
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "ERR_COPYING_RESUME_DATA",
      message: "Error while copying profile data",
    });
    return;
  }
});

router.post(
  "/:resumeId/export-resume",
  async (req: CustomRequest, res: Response) => {
    const userId = req.user?.uid;
    const resumeId = req.params.resumeId;
    if (!userId) {
      res.status(400).send("User not found");
      return;
    }

    // Load resume data

    const resumeRef = await db.collection("resumes").doc(resumeId).get();
    const resumeData = resumeRef.data();
    if (!resumeData) {
      res.status(400).send("Resume not found");
      return;
    }

    try {
      await exportResume(resumeId, userId);
      res.status(200).send({ success: true });
      return;
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error: "ERR_EXPORTING_RESUME",
        message: "Error while exporting resume",
      });
      return;
    }
  }
);

export default router;

// userRoutes.ts

import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import skillSuggestion from "../controllers/openai/skillsSuggestion";
import {
  educationHelper,
  experienceHelper,
  experienceSummaryRewrite,
  experienceSummarySuggestion,
  educationSummaryRewrite,
  educationSummarySuggestion,
  eductionCoursesHelper,
  themeSuggestion,
  themeDescriptionSuggestion,
} from "../controllers/openai/resumeai";
import {
  generateProfessionalSummary,
  rewriteProfessionalSummary,
} from "../controllers/openai/professionalSummary";

const { validate } = new Validator({});

const router = Router();

// Route handler for the '/users' route with middleware
router.post(
  "/skillsSuggestions",
  //   validate({ body: workoutSchema }),
  async (req: Request, res: Response) => {
    const role = req.body.role;
    let skills = req.body.skills;
    console.log("ROLE", role);

    if (!role) {
      res.status(400).json({ message: "role is required" });
    }
    if (!skills) {
      skills = [];
    }

    let generatedSuggestions = await skillSuggestion(role, skills);

    res.status(200).json({ results: generatedSuggestions, message: "success" });
  }
);

router.post("/educationSummary", async (req: Request, res: Response) => {
  const degree = req.body.degree;
  const school = req.body.school;
  const role = req.body.role;
  const numberSummary = req.body.numberSummary || 3;
  const existingSummary = req.body.existingSummary || "";

  // is it a rewrite mode
  const rewrite = req.body.rewrite;

  if (!degree) {
    res.status(400).json({ message: "degree is required" });
  }
  if (!school) {
    res.status(400).json({ message: "school is required" });
  }
  if (!role) {
    res.status(400).json({ message: "role is required" });
  }

  if (rewrite) {
    const summaries = await educationSummaryRewrite(
      degree,
      school,
      role,
      existingSummary,
      rewrite.instructions,
      numberSummary
    );
    res.status(200).json({ results: summaries, message: "success" });
    return;
  } else {
    const summaries = await educationSummarySuggestion(
      degree,
      school,
      role,
      numberSummary
    );
    res.status(200).json({ results: summaries, message: "success" });
    return;
  }
});

router.post("/eductionCoursesHelper", async (req: Request, res: Response) => {
  const degree = req.body.degree;
  const school = req.body.school;
  const role = req.body.role;
  const numberSummary = req.body.numberSummary || 3;
  const existingSummary = req.body.existingSummary || "";

  // is it a rewrite mode
  // const rewrite = req.body.rewrite;

  if (!degree) {
    res.status(400).json({ message: "degree is required" });
    return;
  }
  if (!school) {
    res.status(400).json({ message: "school is required" });
    return;
  }
  if (!role) {
    res.status(400).json({ message: "role is required" });
    return;
  }

  let summaries = await eductionCoursesHelper(
    degree,
    school,
    role,
    undefined,
    numberSummary
  );

  res.status(200).json({ results: summaries, message: "success" });
});

router.post("/experienceSummary", async (req: Request, res: Response) => {
  const role = req.body.role;
  const experienceRole = req.body.experienceRole;
  const experienceOrg = req.body.experienceOrg;
  const numberSummary = req.body.numberSummary || 1;
  const existingSummary = req.body.existingSummary || "";
  const rewrite = req.body.rewrite;
  if (!role) {
    res.status(400).json({ message: "role is required" });
  }
  if (!experienceRole) {
    res.status(400).json({ message: "experienceRole is required" });
  }
  if (!experienceOrg) {
    res.status(400).json({ message: "experienceOrg is required" });
  }

  if (rewrite) {
    const summaries = await experienceSummaryRewrite(
      experienceRole,
      experienceOrg,
      role,
      existingSummary,
      numberSummary
    );
    res.status(200).json({ results: summaries, message: "success" });
    return;
  } else {
    const summaries = await experienceSummarySuggestion(
      role,
      experienceRole,
      experienceOrg,
      numberSummary
    );

    res.status(200).json({ results: summaries, message: "success" });
    return;
  }
});

router.post("/experienceHelper", async (req: Request, res: Response) => {
  /*
  API for chatbot which helps user to write experience section for a resume
  */
  const currentRole = req.body.currentRole;
  const targetRole = req.body.targetRole;
  const messages = req.body.messages || [];

  if (!currentRole) {
    res.status(400).json({ message: "currentRole is required" });
    return;
  }
  if (!targetRole) {
    res.status(400).json({ message: "targetRole is required" });
    return;
  }

  let response = await experienceHelper(currentRole, targetRole, messages);
  res.status(200).json({ result: response, message: "success" });

  return;
});

router.post("/educationHelper", async (req: Request, res: Response) => {
  /*
  API for chatbot which helps user to write education section for a resume
  */
  const currentRole = req.body.currentRole;
  const targetRole = req.body.targetRole;
  const messages = req.body.messages || [];

  if (!currentRole) {
    res.status(400).json({ message: "currentRole is required" });
  }
  if (!targetRole) {
    res.status(400).json({ message: "targetRole is required" });
  }

  let response = await educationHelper(currentRole, targetRole, messages);

  res.status(200).json({ result: response, message: "success" });
});

router.post("/resumeSummary", async (req: Request, res: Response) => {
  const resumeId = req.body.resumeId;
  const resume = await db.collection("resumes").doc(resumeId).get();
});

router.post("/themeSuggestions", async (req: Request, res: Response) => {
  const role = req.body.role;
  const existingTheme = req.body.existingTheme || "";

  if (!role) {
    res.status(400).json({ message: "role is required" });
    return;
  }

  let suggestion = await themeSuggestion(role, existingTheme.split(","));
  res.status(200).json({ result: suggestion, message: "success" });
});

router.post("/themeDescription", async (req: Request, res: Response) => {
  const theme = req.body.theme;
  const role = req.body.role;

  if (!role) {
    res.status(400).json({ message: "role is required" });
    return;
  }
  if (!theme) {
    res.status(400).json({ message: "theme is required" });
    return;
  }

  // let suggestion = await themeSuggestion(role, theme.split(","));
  let suggestion = await themeDescriptionSuggestion(role, theme);
  console.log(suggestion);
  res.status(200).json({ result: suggestion, message: "success" });
});

router.post("/professionalSummary", async (req: Request, res: Response) => {
  const resumeId = req.body.resumeId;
  const generateFromProfile = req.body.generateFromProfile;
  const rewrite = req.body.mode;

  if (!resumeId && !generateFromProfile) {
    res.status(400).json({ message: "resumeId is required" });
    return;
  }

  if (generateFromProfile) {
    // TODO
    res.status(400).json({ message: "generateFromProfile is not implemented" });
    return;
  } else {
    if (rewrite) {
      let suggestion = await rewriteProfessionalSummary(resumeId, 3);
      console.log(suggestion);
      res.status(200).json({ result: suggestion, message: "success" });
      return;
    } else {
      let suggestion = await generateProfessionalSummary(resumeId, 3);
      console.log(suggestion);
      res.status(200).json({ result: suggestion, message: "success" });
      return;
    }
  }
});

export default router;

import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import skillSuggestion from "../controllers/openai/skillsSuggestion";
import {
  educationSummaryRewrite,
  educationSummarySuggestion,
  eductionCoursesHelper,
} from "../controllers/openai/education";
import {
  experienceSummaryRewrite,
  experienceSummarySuggestion,
} from "../controllers/openai/experience";
import {
  themeSuggestion,
  themeDescriptionSuggestion,
  achievementRewrite,
} from "../controllers/openai/achievements";
import {
  generateProfessionalSummary,
  rewriteProfessionalSummary,
} from "../controllers/openai/professionalSummary";
import { CustomRequest } from "../../types/requests";
import resumeExtractionForCV from "../controllers/openaiV2/resumeParsing";
import importResumeToRepo from "../controllers/openai/resumeParsing";

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
  const numberSummary = req.body.numberSummary || 3;
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

router.post("/achievementHelper", async (req: Request, res: Response) => {
  const role = req.body.role;
  let theme = req.body.theme;
  const existingAchievement = req.body.existingAchievement || "";
  const rewrite = req.body.rewrite;
  if (!theme && !rewrite) {
    res.status(400).json({ message: "theme is required" });
    return;
  }

  if (rewrite) {
    if (!theme) {
      theme = "Unknown";
    }
    let suggestion = await achievementRewrite(theme, existingAchievement!, 3);
    console.log(suggestion);
    res.status(200).json({ result: suggestion, message: "success" });
    return;
  } else {
    let suggestion = await themeDescriptionSuggestion(role, theme!);
    console.log(suggestion);
    res.status(200).json({ result: suggestion, message: "success" });
    return;
  }
});

router.post(
  "/professionalSummary",
  async (req: CustomRequest, res: Response) => {
    const resumeId = req.body.resumeId;
    const generateFromProfile = req.body.generateFromProfile;
    const rewrite = req.body.mode;
    const existingSummary = req.body.existingSummary || "";
    const userId = req.user?.uid;
    if (!resumeId && !generateFromProfile) {
      res.status(400).json({ message: "resumeId is required" });
      return;
    }

    if (rewrite) {
      let suggestion = await rewriteProfessionalSummary(
        resumeId,
        existingSummary!,
        userId!,
        3
      );
      console.log(suggestion);
      res.status(200).json({ result: suggestion, message: "success" });
      return;
    } else {
      let suggestion = await generateProfessionalSummary(resumeId, userId!, 3);
      console.log(suggestion);
      res.status(200).json({ result: suggestion, message: "success" });
      return;
    }
  }
);

router.post("/parseResume", async (req: CustomRequest, res: Response) => {
  let userId = req.user?.uid;
  console.log(req.files);
  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  await importResumeToRepo(req.files["file"][0], userId);
  res.status(200).json({ message: "success" });
});

router.post("/importToCV", async (req: CustomRequest, res: Response) => {
  let userId = req.user?.uid;
  let resumeId = req.body.resumeId;
  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }
  if (!resumeId) {
    res.status(400).json({ message: "resumeId is required" });
    return;
  }
  // await importToCV(resumeId, userId, res);
  // Response is sent from the function
  let result = await resumeExtractionForCV(req.files["file"][0], userId, resumeId);
  res.status(200).json({ message: "success" });
});

export default router;

import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types/requests";
import { populateResumeDetails } from "../../db/resume/actions/populateResumeDetails";
import { db } from "../../utils/firebase";
import { exportResume } from "../../db/resume/actions/export";
const  PDFServicesSdk = require("@adobe/pdfservices-node-sdk");
import { storage } from "firebase-admin";
import { ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET } from "../../utils/vars";
import { deductCredits } from "../controllers/billing/credits";
import { DEDUCT_TYPES } from "../../utils/billing";

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


router.post("/:resumeId/export-word", async (req: CustomRequest, res: Response) => {
  try {
    let resumeId = req.params.resumeId;
    let userId = req.user?.uid;

    if (!userId) {
      res.status(400).send("User not found");
      return;
    }

    if (!resumeId) {
      res.status(400).send("Resume not found");
      return;
    }
    // Initial setup, create credentials instance.
    const credentials =
      PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
        .withClientId(ADOBE_CLIENT_ID.value())
        .withClientSecret(ADOBE_CLIENT_SECRET.value())
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext =
        PDFServicesSdk.ExecutionContext.create(credentials),
      exportPDF = PDFServicesSdk.ExportPDF,
      exportPDFOperation = exportPDF.Operation.createNew(
        exportPDF.SupportedTargetFormats.DOCX
      );

    // Set operation input from a source file
    // const input = PDFServicesSdk.FileRef(
    //   "resources/exportPDFInput.pdf"
    // );

    let pdfPath = `userData/${userId}/resumes/${resumeId}/resume.pdf`;
    let bucket = storage().bucket();
    let file = bucket.file(pdfPath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      res.status(400).send("File not found");
      return;
    }

    let fileStream = file.createReadStream();
    let mediaType = "application/pdf";

    const input = PDFServicesSdk.FileRef.createFromStream(
       fileStream ,
      mediaType
    );

    exportPDFOperation.setInput(input);

    //Generating a file name

    // Execute the operation and Save the result to the specified location.
    let result = await exportPDFOperation.execute(executionContext);

    // Save the docx file to storage
    let docxPath = `userData/${userId}/resumes/${resumeId}/resume.docx`;
    let outputFile = bucket.file(docxPath);
    result.writeToStream(outputFile.createWriteStream());

    // Deduct credits here 
    await deductCredits(DEDUCT_TYPES.RESUME_DOWNLOAD, userId);
    res.status(200).send({
      message: "Success",
      url: outputFile.publicUrl(),
    });


  } catch (err) {
    console.log("Exception encountered while executing operation", err);
    res.status(400).send({
      message: "Error",
      error: err,
    
    });
  }
});

router.post("/:resumeId/export-pdf", async (req: CustomRequest, res: Response) => {
  try {
    let resumeId = req.params.resumeId;
    let userId = req.user?.uid;

    if (!userId) {
      res.status(400).send("User not found");
      return;
    }

    if (!resumeId) {
      res.status(400).send("Resume not found");
      return;
    }

    const bucket = storage().bucket();
    
    // Save the docx file to storage
    let pdfPath_ = `userData/${userId}/resumes/${resumeId}/resume.pdf`;
    let outputFile = bucket.file(pdfPath_);

    // Deduct credits here 
    await deductCredits(DEDUCT_TYPES.RESUME_DOWNLOAD, userId);
    res.status(200).send({
      message: "Success",
      url: outputFile.publicUrl(),
    });
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
});


export default router;

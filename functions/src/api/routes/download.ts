import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import stripe_ from "stripe";
import {
  ADOBE_CLIENT_ID,
  ADOBE_CLIENT_SECRET,
} from "../../utils/vars";
import { CustomRequest } from "../../types/requests";
import { storage } from "firebase-admin";
const  PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

const router = Router();

router.post("/export-word", async (req: CustomRequest, res: Response) => {
  try {
    let resumeId = req.body.resumeId;
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
    
    res.status(200).send({
      message: "Success",
      url: outputFile.publicUrl(),
    });


  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
});

export default router;
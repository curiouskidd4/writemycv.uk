import { storage } from "firebase-admin";
import { db } from "../../../utils/firebase";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { Resume } from "../../../types/resume";
import hash from "object-hash";
// import inlinCss from "inline-css";

let PATH_TO_TEMPLATE = "data/resume-templates";

nunjucks.configure([PATH_TO_TEMPLATE], { autoescape: true });

const getResume = async (resumeId: string) => {
  // Get resume details
  const resumeRef = db.collection("resumes").doc(resumeId);
  const resumeDoc = await resumeRef.get();
  const resumeData = resumeDoc.data() as Resume;
  resumeData.id = resumeId;

  // Now extract other information
  return resumeData;
};

const generatePdfnScreenShot = async (
  html: string,
  userId: string,
  resumeId: string
) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html);
  await page.emulateMediaType("screen");
  await page.setViewport({ width: 1920, height: 1080 });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });
  // Now generate screenshot in portrain mode as a4
  await page.setViewport({ width: 595, height: 842 });
  const screenshot = await page.screenshot({
    fullPage: true,
  });

  // Save PDF and screenshot to storage
  let pdfPath = `userData/${userId}/resumes/${resumeId}/resume.pdf`;
  let screenshotPath = `userData/${userId}/resumes/${resumeId}/resume.png`;
  const bucket = storage().bucket();
  const pdfFile = bucket.file(pdfPath);
  const screenshotFile = bucket.file(screenshotPath);

  await pdfFile.save(pdf);
  await screenshotFile.save(screenshot);
  await browser.close();
};

const exportResume = async (resumeId: string, userId: string) => {
  try {
    const resumeData = await getResume(resumeId);

    // Compute hash of relevant data to check if resume needs to be exported
    if (resumeData.personalInfo) {
      resumeData.personalInfo.phoneString = `${resumeData.personalInfo?.phone.countryCode}-${resumeData.personalInfo?.phone.number}`;
    }
    console.log("resumeData.personalInfo", resumeData.personalInfo);
    let relevantData = {
      experienceList: resumeData.experienceList,
      educationList: resumeData.educationList,
      skillList: resumeData.skillList,
      professionalSummary: resumeData.professionalSummary,
      sectionOrder: resumeData.sectionOrder,
      personalInfo: resumeData.personalInfo,
    };

    // Compute hash of relevant data
    const relevantDataHash = hash(relevantData);
    let resumeHash = resumeData.exportHash || "";
    let newHash = hash(relevantDataHash);

    // If hash has changed, then export resume
    // console.log(resumeData);
    if (resumeData && newHash != resumeHash) {
      const resumeTemplate = "simple/resume";
      let experienceList = resumeData.experienceList?.map((experience) => {
        // Convert start date and end date to "MMM YYYY" format
        let startDate = experience.startDate
          ? experience.startDate.toDate()
          : null;
        let endDate = experience.endDate
          ? experience.endDate.toDate()
          : "Current";
        if (startDate == null) {
          endDate = "";
          startDate = null;
        }
        return {
          ...experience,
          startDate: startDate? startDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }) : startDate,
          endDate:
          endDate ? endDate != "Current"
              ? endDate.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
              : endDate: endDate,
        };
      });

      let educationList = resumeData.educationList?.map((education) => {
        // Convert start date and end date to "MMM YYYY" format
        let startDate = education.startDate
          ? education.startDate.toDate()
          : null;
        let endDate = education.endDate
          ? education.endDate.toDate()
          : "Current";
        return {
          ...education,
          isSubDetailAvailable: startDate && endDate ? true : false,
          startDate: startDate? startDate.toLocaleString("default", {
            // month: "short",
            year: "numeric",
          }) : null,
          endDate:
            endDate != "Current"
              ? endDate.toLocaleString("default", {
                  // month: "short",
                  year: "numeric",
                })
              : endDate,
        };
      });
      console.log("educationList", educationList);
      const sectionOrder = resumeData.sectionOrder || [
        "professionalSummary",
        "education",
        "experience",
        "skills",
      ];

      const resumeTemplateHtml = nunjucks.render(`${resumeTemplate}.njk`, {
        ...resumeData,
        experienceList,
        educationList,
      });

      // console.log(resumeTemplateHtml);
      // Save html to storage
      let htmlPath = `userData/${userId}/resumes/${resumeId}/resume.html`;
      const bucket = storage().bucket();
      const htmlFile = bucket.file(htmlPath);
      await htmlFile.save(resumeTemplateHtml);

      await generatePdfnScreenShot(resumeTemplateHtml, userId, resumeId);

      // Update the resume export date in firestore

      await db.collection("resumes").doc(resumeId).update({
        // exportDate: new Date(),
        exportHash: newHash,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export { exportResume };

import { storage } from "firebase-admin";
import { db } from "../../../utils/firebase";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { Resume } from "../../../types/resume";

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
      bottom: "40px",
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
    // console.log(resumeData);
    if (resumeData) {
      const resumeTemplate = "simple/resume";
      let experienceList = resumeData.experienceList?.map((experience) => {
        // Convert start date and end date to "MMM YYYY" format
        let startDate = experience.startDate.toDate();
        let endDate = experience.endDate
          ? experience.endDate.toDate()
          : "Current";
        return {
          ...experience,
          startDate: startDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          endDate:
            endDate != "Current"
              ? endDate.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
              : endDate,
        };
      });

      let educationList = resumeData.educationList?.map((education) => {
        // Convert start date and end date to "MMM YYYY" format
        let startDate = education.startDate.toDate();
        let endDate = education.endDate
          ? education.endDate.toDate()
          : "Current";
        return {
          ...education,
          startDate: startDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          endDate:
            endDate != "Current"
              ? endDate.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
              : endDate,
        };
      });

      const resumeTemplateHtml = nunjucks.render(`${resumeTemplate}.njk`, {
        ...resumeData,
        experienceList,
        educationList,
      });

      console.log(resumeTemplateHtml);
      // Save html to storage
      let htmlPath = `userData/${userId}/resumes/${resumeId}/resume.html`;
      const bucket = storage().bucket();
      const htmlFile = bucket.file(htmlPath);
      await htmlFile.save(resumeTemplateHtml);

      await generatePdfnScreenShot(resumeTemplateHtml, userId, resumeId);
    }
  } catch (error) {
    console.log(error);
  }
};

export { exportResume };

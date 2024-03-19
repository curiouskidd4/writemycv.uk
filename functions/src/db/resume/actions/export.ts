import { storage } from "firebase-admin";
import { db } from "../../../utils/firebase";
import nunjucks from "nunjucks";
import puppeteer from "puppeteer";
import { Resume } from "../../../types/resume";
import hash from "object-hash";
import { footerTemplate, headerTemplate } from "./pdfExtra";
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
  // Wait for all images to load
  await page.evaluateHandle("document.fonts.ready");
  // Make sure no network requests are pending
  try {
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 2000 });
  } catch (error) {
    console.log(error);
  }

  await page.emulateMediaType("screen");
  await page.setViewport({ width: 1920, height: 1080 });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "96px",
      bottom: "60px",
      left: "32px",
      right: "32px",
    },
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    displayHeaderFooter: true,
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
    let relevantData = {
      candidateDetails: resumeData.candidateDetails,
      otherInformationList: resumeData.otherInformationList,
      experienceList: resumeData.experienceList,
      educationList: resumeData.educationList,
      skillList: resumeData.skillList,
      awardList: resumeData.awardList,
      publicationList: resumeData.publicationList,
      languageList: resumeData.languageList,
      volunteeringList: resumeData.volunteeringList,
      professionalSummary: resumeData.professionalSummary,
      sectionOrder: resumeData.sectionOrder,
      personalInfo: resumeData.personalInfo,
      templateId: resumeData.templateId,
    };

    // Compute hash of relevant data
    const relevantDataHash = hash(relevantData);
    let resumeHash = resumeData.exportHash || "";
    let newHash = hash(relevantDataHash);

    // If hash has changed, then export resume
    // console.log(resumeData);
    if (resumeData && newHash != resumeHash) {
      // const resumeTemplate = "simple/resume";
      const resumeTemplate = "howell/resume";

      let templateMeta: any = null;
      // Load template Meta
      if (resumeData.templateId) {
        const templateRef = db
          .collection("templates")
          .doc(resumeData.templateId);
        const templateDoc = await templateRef.get();
        const templateData = templateDoc.data();
        if (templateData) {
          // PATH_TO_TEMPLATE = `data/resume-templates/${templateData.folder}`;
          // nunjucks.configure([PATH_TO_TEMPLATE], { autoescape: true });
          templateMeta = templateData.meta;
        } else {
          templateMeta = {
            contact: "07943388003",
            recruiter: "Lucy Chapman",
          };
        }
      }else{
        templateMeta = {
          contact: "07943388003",
          recruiter: "Lucy Chapman",
        };
      }

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
          isSubDetailAvailable: true,

          startDate: startDate
            ? startDate.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            : startDate,
          endDate: endDate
            ? endDate != "Current"
              ? endDate.toLocaleString("default", {
                  month: "short",
                  year: "numeric",
                })
              : endDate
            : endDate,
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
          startDate: startDate
            ? startDate.toLocaleString("default", {
                // month: "short",
                year: "numeric",
              })
            : null,
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
      const sectionOrder = resumeData.sectionOrder? ["candidateSummary", ...resumeData.sectionOrder] : [
        "candidateSummary",
        "professionalSummary",
        "education",
        "experience",
        "awards",
        "publications",
        "languages",
        "volunteering",
        "languages",
        "skills",
      ];

      let publicationList = resumeData.publicationList?.map((publication) => {
        // Convert start date and end date to "MMM YYYY" format
        let date = publication.date ? publication.date.toDate() : null;
        return {
          ...publication,
          date: date
            ? date.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            : null,
        };
      });

      let awardList = resumeData.awardList?.map((award) => {
        // Convert start date and end date to "MMM YYYY" format
        let date = award.date ? award.date.toDate() : null;
        return {
          ...award,
          date: date
            ? date.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            : null,
        };
      });

      let languageList = resumeData.languageList?.map((language) => {
        return {
          ...language,
        };
      });

      let volunteeringList = resumeData.volunteeringList?.map(
        (volunteering) => {
          // Convert start date and end date to "MMM YYYY" format
          let startDate = volunteering.startDate
            ? volunteering.startDate.toDate()
            : null;
          let endDate = volunteering.endDate
            ? volunteering.endDate.toDate()
            : "Current";
          return {
            ...volunteering,
            isSubDetailAvailable: startDate && endDate ? true : false,
            startDate: startDate
              ? startDate.toLocaleString("default", {
                  // month: "short",
                  year: "numeric",
                })
              : null,
            endDate:
              endDate != "Current"
                ? endDate.toLocaleString("default", {
                    // month: "short",
                    year: "numeric",
                  })
                : endDate,
          };
        }
      );

      const data = {
        ...resumeData,
        personalInfo: {
          ...resumeData.personalInfo,
          ...resumeData.candidateDetails,
        },
        professionalSummary: resumeData.professionalSummary || "",
        experienceList,
        educationList,
        awardList,
        publicationList,
        languageList,
        volunteeringList,
        otherInformationList: resumeData.otherInformationList || [],
        skillText:
          resumeData.skillList?.map((skill) => skill.name).join(", ") || "",
        templateMeta,
        sectionOrder
      };
      console.log("data", data);
      const resumeTemplateHtml = nunjucks.render(`${resumeTemplate}.njk`, data);

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

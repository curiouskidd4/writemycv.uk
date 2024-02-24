import { AddPrefixToKeys } from "firebase-admin/firestore";
import {
  AwardInput,
  EducationInput,
  PublicationInput,
  VolunteeringInput,
} from "../../../types/education";
import { ExperienceInput } from "../../../types/experience";
import { PersonalInfo } from "../../../types/personalInfo";
import { ProfessionalSummary } from "../../../types/professionalSummary";
import { Award, Resume } from "../../../types/resume";
import { SkillsInput } from "../../../types/skills";
import { db } from "../../../utils/firebase";

const populateResumeDetails = async (resumeId: string, userId: string) => {
  try {
    console.log("Populating resume details");
    // Get all the experiences
    const experiences = await db.collection("experience").doc(userId).get();
    const experiencesData = experiences.data() as ExperienceInput;

    // Get all the skills
    const skills = await db.collection("skill").doc(userId).get();
    const skillsData = skills.data() as SkillsInput;

    // Get all the personal details
    const personalDetails = await db
      .collection("personalInfo")
      .doc(userId)
      .get();
    const personalDetailsData = personalDetails.data() as PersonalInfo;

    // Get all the Education details
    const educationDetails = await db.collection("education").doc(userId).get();
    const educationDetailsData = educationDetails.data() as EducationInput;

    // Get all the awards details
    const awards = await db.collection("awards").doc(userId).get();
    const awardsData = awards.data() as AwardInput;

    // Get all the publication details
    const publications = await db.collection("publications").doc(userId).get();
    const publicationsData = publications.data() as PublicationInput;

    // Get all the volunteering details
    const volunteering = await db.collection("volunteering").doc(userId).get();
    const volunteeringData = volunteering.data() as VolunteeringInput;

    // Get the professional summary
    const summary = await db
      .collection("professionalSummary")
      .doc(userId)
      .get();
    const summaryData = summary.data() as ProfessionalSummary;

    // Now populate the resume details

    // Get the resume document
    const resumeRef = db.collection("resumes").doc(resumeId);
    const resumeDoc = await resumeRef.get();
    const resumeData = resumeDoc.data() as Resume;
    resumeData.id = resumeId;

    // Now populate the resume details
    resumeData.experienceList = experiencesData?.experienceList || [];
    resumeData.skillList = skillsData?.skillList || [];
    resumeData.personalInfo = personalDetailsData || {};
    resumeData.educationList = educationDetailsData?.educationList || [];
    resumeData.professionalSummary = summaryData?.professionalSummary || "";
    resumeData.awardList = awardsData?.awardList || [];
    resumeData.publicationList = publicationsData?.publicationList || [];
    resumeData.volunteeringList = volunteeringData?.volunteeringList || [];

    // Now update the resume document
    await resumeRef.update({ ...resumeData });
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export { populateResumeDetails };

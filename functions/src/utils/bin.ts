import ObjectID from "bson-objectid";
import Template from "../types/template";
import { db } from "./firebase";
import resumeExtraction from "../api/controllers/openai/resumeParsing";
import resumeExtractionForCV from "../api/controllers/openaiV2/resumeParsing";
import { File } from "../types/requests";
import fs from "fs";
// const recruiterContacts = [
//   {
//     name: "Bianca Manser",
//     number: "07534924521",
//   },
//   {
//     name: "David Widdison",
//     number: "07375046586",
//   },
//   {
//     name: "Grace Smith",
//     number: "07876444076",
//   },
//   {
//     name: "Julianne Matthew",
//     number: "07881229439",
//   },
//   {
//     name: "Lucy Chapman",
//     number: "07943388003",
//   },
//   {
//     name: "Mia Hockridge",
//     number: "07538237552",
//   },
//   {
//     name: "Rosie Poole",
//     number: "07768066516",
//   },
//   {
//     name: "Sommer Baseby",
//     number: "07502427533",
//   },
// ];

// let imgUrl =
//   "https://firebasestorage.googleapis.com/v0/b/resu-me-a5cff.appspot.com/o/public%2Fimages%2Fhowell-template.png?alt=media&token=e3675749-91fb-41b6-81a9-a50069ca25fc";
// const saveTemplates = async () => {
//     // Get all templates
//   let templates =   await db.collection("templates").get();
//     let templateList: Template[] = [];
//     templates.forEach((doc) => {
//         let template = doc.data() as Template;
//         templateList.push(template);
//     });
//     console.log(templateList);
//     if (templateList.length > 0) {
//         return;
//     }
//   for (let item of recruiterContacts) {
//     let template: Template = {
//       id: ObjectID().toHexString(),
//       name: `${item.name}'s Template - Howell`,
//       imgUrl: imgUrl,
//       meta: {
//         recruiter: item.name,
//         contact: item.number,
//       },
//       isPublic: false,
//     };

//     await db.collection("templates").doc(template.id).set(template);
//   }
// };

// saveTemplates();

const extractResume = async () => {
  let resumeId = "65e74688620b5f8f72a63aaa";
  let userId = "iUZOPWVGWhNiWAiLj5OUn1Imfie2";
  let filePath = "/Users/vivekverma/Downloads/Nick Harvey CV draft.docx";
  let readbaleFileStream = fs.createReadStream(filePath);

  let file: File = {
    path: filePath,
    filename: "Nick Harvey CV draft.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file: readbaleFileStream,
  };
  await resumeExtractionForCV(file, userId, resumeId);
};
extractResume()
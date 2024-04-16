import { Router, Request, Response } from "express";
import { CustomRequest } from "../../types/requests";
import { admin, db } from "../../utils/firebase";
const router = Router();
import ObjectID from "bson-objectid";

router.post(
  "/enterprise-contact-us",
  async (req: CustomRequest, res: Response) => {
    const { email, name, company, message } = req.body;
    try {
      // Create a document enterpriseContactUs
      let doc = {
        email,
        name,
        company,
        message,
        createdAt: new Date(),
      };
      let id = new ObjectID();
      let result = await db.collection("enterpriseContactUs").doc(
        id.toHexString()
      ).set(doc);
      console.log(id.toHexString());

      res.json({ message: "Details Saved" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error sending email" });
    }
  }
);

export default router;

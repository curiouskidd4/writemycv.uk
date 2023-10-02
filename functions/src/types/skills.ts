import { Timestamp } from "firebase-admin/firestore";

interface Skill {
    name: string;
    level: string;
}

interface SkillsInput {
  skillList: Skill[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
  userId: string;
}

export { Skill, SkillsInput };
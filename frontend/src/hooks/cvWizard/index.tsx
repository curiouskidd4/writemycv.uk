import useEducationHelper from "./education";
import {
    useAchievementHelper,
    useExperienceHelper,
} from "./experience";
import useSkillHelper from "./skills";
import useProfessionalSummaryHelper  from "./summary";


const openAI = {
    useEducationHelper,
    useAchievementHelper,
    useExperienceHelper,
    useSkillHelper,
    useProfessionalSummaryHelper,
};

export default openAI;

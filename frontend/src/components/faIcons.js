import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshakeAngle,
  faWandMagicSparkles,
  faCalendar,
  faStar,
  faHouse,
  faPhone,
  faCalendarAlt,
  faEnvelope,
  faDownload,
  faShare,
  faTrash,
  faPenToSquare,
  faChevronLeft,
  faChevronRight,
  faUpload,
  faPlus,
  faUserTie,
  faGraduationCap,
  faBriefcase,
  faScrewdriverWrench,
  faBullhorn,
  faLightbulb,
  faRetweet,
  faCheck,
  faCircleMinus,
  faUser,
  faEllipsisVertical,
  faTriangleExclamation,
  faNewspaper,
  faLanguage,
  faAward,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export const MagicWandIcon = ({ color = "#E9AFA3", marginRight = "6px" }) => (
  <FontAwesomeIcon
    icon={faWandMagicSparkles}
    style={{
      marginRight: marginRight,
      color: color,
    }}
  />
);

export const MagicWandLoading = () => (
  <FontAwesomeIcon
    icon={faWandMagicSparkles}
    style={{
      //   marginRight: "6px",
      color: "#E9AFA3",
      fontSize: "6em",
      textAlign: "center",
      //   animation: "spin 2s linear infinite",
    }}
    //  shake
    fade
  />
);

export const HomeIcon = () => (
  <FontAwesomeIcon
    icon={faHouse}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const PhoneIcon = () => (
  <FontAwesomeIcon
    icon={faPhone}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const EmailIcon = () => (
  <FontAwesomeIcon
    icon={faEnvelope}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const CalendarIcon = () => (
  <FontAwesomeIcon
    icon={faCalendar}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const StarIcon = () => (
  <FontAwesomeIcon
    icon={faStar}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const DownloadIcon = (
  {
    color = "#E9AFA3",
  }
) => (
  <FontAwesomeIcon
    icon={faDownload}
    style={{
      marginRight: "6px",
      color: color
    }}
  />
);

export const ShareIcon = () => (
  <FontAwesomeIcon
    icon={faShare}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const DeleteIcon = ({ color = "#ff4d4f", marginRight = "6px" }) => (
  <FontAwesomeIcon
    icon={faTrash}
    style={{
      marginRight: marginRight ? marginRight : "6px",
      color: color ? color : "#ff4d4f",
    }}
  />
);

export const EditIcon = ({ color = "#E9AFA3", marginRight = "6px" }) => (
  <FontAwesomeIcon
    icon={faPenToSquare}
    style={{
      marginRight: marginRight ? marginRight : "6px",
      color: color ? color : "#E9AFA3",
    }}
  />
);

export const UploadIcon = (
  { color = "#E9AFA3", marginRight = "6px" },
) => (
  <FontAwesomeIcon
    icon={faUpload}
    style={{
      color: color,
      marginRight: marginRight,
    }}
  />
);

export const CircleCheckIcon = (
  { color = "#E9AFA3", marginRight = "6px" },
) => (
  <FontAwesomeIcon
    icon={faCircleCheck}
    style={{
      color: color,
      marginRight: marginRight,
    }}
  />
);

export const PlusIcon = (
  { color = "#E9AFA3", marginRight = "6px" },
) => (
  <FontAwesomeIcon
    icon={faPlus}
    style={{
      color: color,
      marginRight: marginRight,
    }}
  />
);

export const CollapseLeft = () => (
  <FontAwesomeIcon
    icon={faChevronLeft}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const CollapseRight = () => (
  <FontAwesomeIcon
    icon={faChevronRight}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
      transform: "rotate(180deg)",
    }}
  />
);

export const PersonalInfoIcon = () => (
  <FontAwesomeIcon
    icon={faUserTie}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const EducationIcon = () => (
  <FontAwesomeIcon
    icon={faGraduationCap}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const ExperienceIcon = () => (
  <FontAwesomeIcon
    icon={faBriefcase}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const SkillsIcon = () => (
  <FontAwesomeIcon
    icon={faScrewdriverWrench}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const ReferencesIcon = () => (
  <FontAwesomeIcon
    icon={faBullhorn}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const LightBulbIcon = () => (
  <FontAwesomeIcon
    icon={faLightbulb}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const RepharseIcon = () => (
  <FontAwesomeIcon
    icon={faRetweet}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const CheckIcon = () => (
  <FontAwesomeIcon
    icon={faCheck}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const AIWizardHideIcon = () => (
  <FontAwesomeIcon
    icon={faCircleMinus}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const ProfileIcon = () => (
  <FontAwesomeIcon
    icon={faUser}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const MoreIcon = () => (
  <FontAwesomeIcon
    icon={faEllipsisVertical}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const APIErrorIcon = () => (
  <FontAwesomeIcon
    icon={faTriangleExclamation}
    style={{
      marginRight: "6px",
      // color: "#ff4d4f",
      color: "#ca5858",
    }}
  />
);

export const NewsPaperIcon = () => (
  <FontAwesomeIcon
    icon={faNewspaper}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const LanguageIcon = () => (
  <FontAwesomeIcon
    icon={faLanguage}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const HelpIcon = () => (
  <FontAwesomeIcon
    icon={faHandshakeAngle}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const AwardIcon = () => (
  <FontAwesomeIcon
    icon={faAward}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
    }}
  />
);

export const AIWizardIcon = () => (
  <div className="ai-wizard-icon">
    <FontAwesomeIcon icon={faWandMagicSparkles} style={{}} />
  </div>
);

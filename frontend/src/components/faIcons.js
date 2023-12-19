import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles , faCalendar, faStar, faHouse, faPhone, faCalendarAlt, faEnvelope, faDownload, faShare, faTrash, faPenToSquare, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

export const MagicWandIcon = () => (
  <FontAwesomeIcon
    icon={faWandMagicSparkles}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
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

export const DownloadIcon = () => (
  <FontAwesomeIcon
    icon={faDownload}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
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


export const DeleteIcon = () => (
  <FontAwesomeIcon
    icon={faTrash}
    style={{
      marginRight: "6px",
      color: "#ff4d4f",
    }}
  />
);

export const EditIcon = () => (
  <FontAwesomeIcon
    icon={faPenToSquare}
    style={{
      marginRight: "6px",
      color: "#E9AFA3",
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
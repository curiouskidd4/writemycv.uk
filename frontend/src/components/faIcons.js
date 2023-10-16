import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

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

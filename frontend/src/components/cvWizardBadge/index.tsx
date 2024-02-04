import React from "react";
import { MagicWandIcon } from "../faIcons";
import "./index.css";
const CVWizardBadge = () => {

  return (
    <div className="wizard-badge">
      <span className="icon"><MagicWandIcon/></span>
      <span className="text">CV Wizard</span>

    </div>
  );
};

export default CVWizardBadge;
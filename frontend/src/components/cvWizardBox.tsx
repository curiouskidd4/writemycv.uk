import React from "react";

const CVWizardBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
    className="cv-wizard-box"
      // style={{
      //   padding: "20px",
      //   border: "1px solid --var(primary-400)",
      //   borderRadius: "5px",
      //   marginBottom: "20px",
      //   backgroundColor: "--var(primary-200)",
      // }}
    >
      {children}
    </div>
  );
};


export default CVWizardBox;
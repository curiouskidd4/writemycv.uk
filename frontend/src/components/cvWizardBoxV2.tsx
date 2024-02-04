import React from "react";
import { AIWizardIcon } from "./faIcons";
import { Button } from "antd";

const CVWizardBox = ({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) => {

  const [show, setShow] = React.useState(true);
  return (
    <div
      className="cv-wizard-box-v2"
      // style={{
      //   padding: "20px",
      //   border: "1px solid --var(primary-400)",
      //   borderRadius: "5px",
      //   marginBottom: "20px",
      //   backgroundColor: "--var(primary-200)",
      // }}
    >
      <div className={show? "header" : "header is-hidded"} onClick={
        () => setShow(!show)
      }>
        <AIWizardIcon />
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      {show && 
      <div className="body">
        {children}
        <div className="actions">
          <Button type="link" 
          onClick={
            () => setShow(!show)
          }
          >Hide</Button>
        </div>
      </div>
      }
    </div>
  );
};

export default CVWizardBox;

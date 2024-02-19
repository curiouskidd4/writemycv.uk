import React from "react";
import { AIWizardIcon } from "./faIcons";
import { Button } from "antd";

const CVWizardBox = ({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
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
      <div
        className={show ? "header" : "header is-hidded"}
        onClick={() => setShow(!show)}
      >
        <AIWizardIcon />
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      {show && (
        <div className="wizard-body">
          {children}
          <div className="actions" style={{
            display: "flex",
            alignItems: "center",
          }}>
            <Button type="link" onClick={() => setShow(!show)}>
              Hide
            </Button>
            {actions}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVWizardBox;

import React from "react";

const FormLabel = ({ action, label, required }) => {
  return (
    // <div className="form-label">
    //   <label htmlFor={props.for}>{props.label}</label>
    //   {props.children}
    // </div>

    <div className="ant-col ant-form-item-label css-dev-only-do-not-override-br2ai6" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    }}>
      {label? <label
        // for="experienceList_3_description"
        className={required?  "ant-form-item-required": "ant-form-item"}
        title={label}
      >
        {label}
      </label> : <div></div>}
      <div style={{
        display: "flex",
        // marginLeft: "auto",
      }}>
      {action}
      </div>
    </div>
  );
};


export default FormLabel;
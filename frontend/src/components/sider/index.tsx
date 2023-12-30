import React from "react";
import "./index.css";
import { Button, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

const Sider = () => {
  // Check if resumes page or  repository page
  const match = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  let isResumePage = match.pathname.search(/\/resumes/) == 0;
  let isResumeEdit =
    match.pathname.search(/\/resumes\/[a-zA-Z0-9]+\/edit/) == 0;
  let isRepositoryPage = match.pathname.search(/\/repository/) == 0;
  let isSettingsPage = match.pathname.search(/\/account/) == 0;

  const [isCollapsed, setIsCollapsed] = React.useState(
    isResumeEdit ? true : false
  );
  const goTo = (path: string) => {
    if (path == "/resumes") {
      navigate("/resumes");
    } else if (path == "/repository") {
      navigate("/repository");
    } else if (path == "/settings") {
      navigate("/account");
    }
  };

  const logOut = () => {
    auth.logout();
    navigate("");
  };
  return (
    <div>
      <div className={`slider ${isCollapsed ? "collapsed" : ""}`} style={{}}>
        <div className="logo">
          {isCollapsed ? (
            <Typography.Title level={3}>R</Typography.Title>
          ) : (
            <Typography.Title level={3}>Resu.me</Typography.Title>
          )}
        </div>

        <div className="tab-container">
          <div className="tabs">
            <div className={`tab-option ${isResumePage ? "active" : ""}`}>
              <Button
                onClick={() => goTo("/resumes")}
                className={`tab-option-button ${isResumePage ? "active" : ""}`}
                type="text"
              >
                <i className="fa-solid fa-file"></i>
                <div className="tab-text">Resume</div>
              </Button>
            </div>
            <div className={`tab-option ${isRepositoryPage ? "active" : ""}`}>
              <Button
                onClick={() => goTo("/repository")}
                className={`tab-option-button ${
                  isRepositoryPage ? "active" : ""
                }`}
                type="text"
              >
                <i className="fa-solid fa-database"></i>
                <div className="tab-text">Repository</div>
              </Button>
            </div>
          </div>

          <div className="bottom-tabs">
            <div className={`tab-option ${isSettingsPage ? "active" : ""}`}>
              <Button
                className="tab-option-button"
                type="text"
                onClick={() => goTo("/settings")}
              >
                <i className="fa-solid fa-user"></i>
                <div className="tab-text">Profile</div>
              </Button>
            </div>
            {/* <div className={`tab-option ${isSettingsPage ? "active" : ""}`}>
              <Button
                className="tab-option-button"
                type="text"
                onClick={() => goTo("/settings")}
              >
                <i className="fa-solid fa-gear"></i>
                <div className="tab-text">Settings</div>
              </Button>
            </div> */}
            <div className="tab-option">
              <Button
                className="tab-option-button"
                type="text"
                onClick={logOut}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <div className="tab-text">Logout</div>
              </Button>
            </div>
            <div className="tab-option">
              <Button
                className="tab-option-button"
                type="text"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <i
                  className="fa-solid fa-angles-up"
                  style={{
                    transform: isCollapsed ? "rotate(90deg)" : "rotate(-90deg)",
                  }}
                ></i>
                <div className="tab-text">Collapse</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sider;

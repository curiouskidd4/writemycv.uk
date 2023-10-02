import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Admin.css";
import { Tabs } from "antd";
import Users from "./users.js";

export default function SuperAdmin() {
  const [state, setState] = useState({
    activeTab: "users",
  });

  return (
    <div className="wrapper admin">
      <div className="header">
        <h1>Admin</h1>
      </div>

      <Tabs
        value={state.activeTab}
        onChange={(activeTab) => setState({ ...state, activeTab })}
      >
        <Tabs.TabPane tab="Users" key="users">
          <Users />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Content Management"
          key="contentMangement"
        ></Tabs.TabPane>
        <Tabs.TabPane
          tab="Invitations"
          key="invitations"
        ></Tabs.TabPane>
        
      </Tabs>
    </div>
  );
}

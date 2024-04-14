import React from "react";

import {
  Row,
  Col,
  Button,
  Card,
  Tag,
  Typography,
  Layout,
  Menu,
  Grid,
  Anchor,
  Popover,
  Space,
  Divider,
} from "antd";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {  UserOutlined } from "@ant-design/icons";

const UserOptionsButton = () => {
    const navigate = useNavigate();
    const auth = useAuth();
  return (
    <Popover
      content={
        <div className="popover-content" style={{ width: "100px" }}>
          <Space
            direction="vertical"
            split={<Divider style={{ margin: "0px" }} />}
          >
            <Button onClick={() => navigate("/account")} type="link">
              Account Settings
            </Button>
            <Button onClick={() => navigate("/subscription")} type="link">
              FAQ
            </Button>
            {auth.user.is_superuser && (
              <Button onClick={() => navigate("/superadmin")} type="link">
                Super-Admin Portal
              </Button>
            )}

            <Button onClick={auth.logout} type="link">
              Logout
            </Button>
          </Space>
        </div>
      }
    >
      <Button>
        <UserOutlined />
      </Button>
    </Popover>
  );
};


export default UserOptionsButton;
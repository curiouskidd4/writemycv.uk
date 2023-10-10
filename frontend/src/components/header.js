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
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import axios from "axios";
import remarkGfm from "remark-gfm";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../authContext";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = () => {
  const screens = useBreakpoint();

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  //   console.log("location", location);
  const logout = () => {
    auth.logout();
    navigate("");
  };
  return (
    <Header className="header" style={{ background: "#ffffff00" }}>
      <Row
        style={{
          maxWidth: "1200px",
          margin: "0px auto",
          borderBottom: "1px solid #B9B4C7",
        }}
      >
        <Col span={8} style={{ margin: "auto" }} className="logo">
          <Typography.Title level={3}>Resu.me</Typography.Title>
        </Col>
        <Col span={16}>
          <div style={{ float: "right" }} className="nav-menu">
            <Button
              onClick={() => navigate("/resumes")}
              type={location.pathname == "/resumes" ? "link" : "text"}
            >
              Resumes
            </Button>
            <Button
              onClick={() => navigate("/profile")}
              type={location.pathname.match(/\/profile/) ? "link" : "text"}
            >
              Your Profile
            </Button>

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
                    <Button onClick={() => navigate("/faq")} type="link">
                      FAQ
                    </Button>
                    {auth.user?.is_superuser && (
                      <Button
                        onClick={() => navigate("/superadmin")}
                        type="link"
                      >
                        Super-Admin Portal
                      </Button>
                    )}

                    <Button onClick={logout} type="link">
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
          </div>

          <div className="hamburg-menu">
            <Popover
              arrow={false}
              placement="bottomLeft"
              content={
                <div className="popover-content">
                  <Space
                    direction="vertical"
                    split={<Divider style={{ margin: "0px" }} />}
                  >
                    <Button
                      onClick={() => navigate("/resumes")}
                      type={location.pathname == "/resumes" ? "link" : "text"}
                    >
                      Standards
                    </Button>
                    <Button
                      onClick={() => navigate("/profile")}
                      
                      type={
                        location.pathname.match(/\/profile/) ? "link" : "text"
                      }
                    >
                      Profile
                    </Button>

                    <Button onClick={() => navigate("/account")} type="link">
                      Account Settings
                    </Button>
                    <Button onClick={() => navigate("/faq")} type="link">
                      FAQs
                    </Button>

                    <Button onClick={logout} type="link">
                      Logout
                    </Button>
                  </Space>
                </div>
              }
            >
              <MenuOutlined />
            </Popover>
          </div>
        </Col>
      </Row>
      <div className="logo" />
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
    </Header>
  );
};

export default CustomHeader;

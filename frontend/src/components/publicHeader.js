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
import { MenuOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const PublicHeader = ({ showSignInButtons = true }) => {
  const screens = useBreakpoint();

  const navigate = useNavigate();
  const location = useLocation();
  //   console.log("location", location);
  const logout = () => {
    // auth.logout();
    navigate("/");
    window.location.reload();
  };
  return (
    <Header className="public-header">
      <Row style={{ maxWidth: "1200px", margin: "0px auto", height: "100%" }} align="middle">
        <Col span={8} className="logo" style={{
          display: "flex",
          alignItems: "center",
        }}>
          {/* <img
            // src="/logo.png"
            alt="Resu.me | Logo"
            style={{ height: "50px", margin: "auto 0px" }}
          /> */}
          {/* <Typography.Title level={3} >Resu.me</Typography.Title> */}
          <img
            src="/WriteMyCV-light-background.png"
            alt="WriteMyCV"
            style={{ height: "50px" }}
          />
        </Col>
        <Col span={16}>
          <div style={{ float: "right" }} className="nav-menu">
            <Space>
              {showSignInButtons && (
                <>
                  <Button
                    // size="large"
                    type="link"
                    onClick={() => navigate("/signin")}
                  >
                    Sign In
                  </Button>
                  <Button
                    type="link"
                    // size="large"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Space>
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
                      onClick={() => navigate("/signin")}
                      type={location.pathname == "/signin" ? "link" : "text"}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate("/signup")}
                      type={
                        location.pathname.match(/\/signup/) ? "link" : "text"
                      }
                    >
                      Sign Up
                    </Button>

                    {/* <Button
                      onClick={() => navigate("/help")}
                      type={location.pathname.match(/\/help/) ? "link" : "text"}
                    >
                      Help
                    </Button> */}
                  </Space>
                </div>
              }
            >
              <MenuOutlined
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginRight: "0.5rem",
                }}
              />
            </Popover>
          </div>
        </Col>
      </Row>
      {/* <div className="logo" /> */}
      {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
    </Header>
  );
};

export default PublicHeader;

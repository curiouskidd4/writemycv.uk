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
import { Link } from "react-router-dom";

const LandingPage = () => {
  let colSpan = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12,
    xxl: 12,
  };
  return (
    <div>
      <Row justify="center" align="middle">
        <Col {...colSpan}>
          <div
            style={{
              padding: "1rem",
            }}
          >
            <h1
              level={1}
              style={{
                fontSize: "3.25rem",
                fontWeight: 600,
                color: "#214683",
                lineHeight: "1.2",
              }}
            >
              Craft the Perfect Resume in Minutes!
            </h1>
            <h2
              level={3}
              style={{
                fontWeight: 600,
                color: "rgb(227 159 145)",
              }}
            >
              Introducing RESU.ME - the smart way to build resumes that make an
              impact.
            </h2>
            <Link to="/signup">
            <Button type="primary" size="large" style={{ marginTop: "1.5rem" }}>
              Get Started
            </Button>
            </Link>
          </div>
        </Col>
        <Col {...colSpan}>
          <img
            src="/undraw_online_resume_re_ru7s.svg"
            style={{
              width: "100%",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;

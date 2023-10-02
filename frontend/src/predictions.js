import logo from "./logo.svg";
import React from "react";

import "./App.css";
import {
  Row,
  Col,
  Button,
  Card,
  Tag,
  Typography,
  Input,
  message,
  Divider,
  Tabs,
  Space,
} from "antd";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import axios from "axios";
import remarkGfm from "remark-gfm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ResponseForm from "./pages/responseForm";
import createPersistedState from "use-persisted-state";
import CustomHeader from "./components/header";

const labelAppState = createPersistedState("labelAppState");

function Predictions(props) {
  const [state, setState] = labelAppState({ loading: true });
  const ref = useRef(null);

    // useEffect(() => {
    //   axios
    //     .get(`${process.env.REACT_APP_API_URL}/get_extraction`, {
    //       name: "RebootRx",
    //       version: "1.0.0",
    //     })
    //     .then((response) => {
    //       console.log(response);
    //       setState((prev) => ({ ...prev, loading: false, data: response.data }));
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       setState((prev) => ({ ...prev, loading: false }));
    //     });
    // }, []);

  const onFinish = (pmid) => {
    setState((prev) => ({ ...prev, loading: true }));
    axios
      .post(`${process.env.REACT_APP_API_URL}/get_extraction`, {
        pmid: pmid,
      }, {headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
      })
      .then((response) => {
        message.success("Labels saved!");
        setState((prev) => ({
          ...prev,
          loading: false,
          extractedData: response.data,
        }));
      })
      .catch((error) => {
        console.log(error);
        setState((prev) => ({ ...prev, loading: false }));
        message.error("Save Failed");
      });
  };

  const endpointCompoent = (key, endpoint) => {
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 600 }}>
            {key.replace('"', "").replace('"', "")}
          </span>{" "}
          <Tag>{endpoint?.mapped_endpoint}</Tag>
        </div>
        <div style={{ color: "#2f2f2fe3" }}>
          <em style={{ color: "grey" }}>Reference Sentence:</em>{" "}
          {endpoint?.reference_sent}
        </div>
      </div>
    );
  };

  const getExtractions = (cleanedExtractions) => {
    return (
      <div>
        <Row>
          <Col span={4}>Drugs Studied:</Col>
          <Col span={18}>{cleanedExtractions["cancer_drugs"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
        <Row>
          <Col span={4}>Drugs Effect</Col>
          <Col span={18}>{cleanedExtractions["drug_effects"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
        <Row>
          <Col span={4}>Patient Number</Col>
          <Col span={18}>{cleanedExtractions["patient_num"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
        <Row>
          <Col span={4}>Study Type</Col>
          <Col span={18}>{cleanedExtractions["study_type"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
        <Row>
          <Col span={4}>RCT Type</Col>
          <Col span={18}>{cleanedExtractions["study_rct"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
        <Row>
          <Col span={4}>Therapy Type</Col>
          <Col span={18}>{cleanedExtractions["therapy_type"]}</Col>
          <Divider style={{ margin: "8px 0px" }} type="horizontal" />
        </Row>
      </div>
    );
  };

  const gptQuestions = (gpt3Questions) => {
    return (
      <div>
        {gpt3Questions.map((item) => {
          return (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row style={{ fontWeight: "600" }}>Question: {item.question}</Row>
              <Row>Answer: {item.subjective_answer}</Row>
              <Divider style={{ margin: "8px 0px" }} type="horizontal" />
            </Space>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <CustomHeader />
      <div style={{ maxWidth: "1200px", margin: "0px auto" }}>
        {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <div>
          <Row style={{ width: "100%" }}>
            <h1>RebootRx Experiments</h1>
          </Row>
          <Row>
            <Col span={8}>
              <Input.Search
                style={{ width: "100%" }}
                placeholder="Search PMID"
                onSearch={(value) => onFinish(value)}
                loading={state.loading}
              ></Input.Search>
            </Col>
            <Col>
              <Button onClick={(value) => onFinish("")}>Random PMID</Button>
            </Col>
          </Row>
          <Row style={{ width: "100%", marginTop: "2rem" }}>
            <Col
              span={22}
              style={{
                width: "100%",
                height: "90vh",
                overflowY: "scroll",
                padding: "0px 20px",
              }}
            >
              {state.loading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {state.extractedData && (
                    <div>
                      <Tag color="blue">PMID:{state.extractedData?.pmid}</Tag>
                      <Typography.Title level={5}>
                        {state.extractedData?.title}
                      </Typography.Title>
                      <Typography.Paragraph style={{ color: "#646363" }}>
                        {state.extractedData?.abstract}
                      </Typography.Paragraph>
                      <Tabs
                        defaultActiveKey="1"
                        items={[
                          {
                            key: "1",
                            label: `Extractions`,
                            children: (
                              <>
                                <div>
                                  {/* <Typography.Title level={5}>
                                    Extractions:{" "}
                                  </Typography.Title> */}
                                  {/* <Divider type="horizontal"></Divider> */}
                                  {getExtractions(
                                    state.extractedData?.cleaned_answers
                                  )}
                                </div>
                                <div>
                                  <Typography.Title level={5}>
                                    Endpoints:{" "}
                                  </Typography.Title>
                                  {/* <Divider type="horizontal"></Divider> */}
                                  {Object.keys(
                                    state.extractedData?.endpoints
                                  ).map((key) =>
                                    endpointCompoent(
                                      key,
                                      state.extractedData?.endpoints[key]
                                    )
                                  )}
                                </div>
                              </>
                            ),
                          },
                          {
                            key: "2",
                            label: `GPT3 Questions`,
                            children: gptQuestions(
                              state.extractedData?.answers
                            ),
                          },
                          {
                            key: "3",
                            label: `Other Models`,
                            children: `Content of Tab Pane 3`,
                          },
                        ]}
                        onChange={(activeTab) =>
                          setState((prev) => ({
                            ...prev,
                            activeTab: activeTab,
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
      {/* </header> */}
    </div>
  );
}

export default Predictions;

import React from "react";
import { ResumeProvider, useResume } from "../contexts/resume";
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  EmailIcon,
  HomeIcon,
  PhoneIcon,
  ShareIcon,
  StarIcon,
} from "../components/faIcons";
import { Education, Experience } from "../types/resume";
import moment from "moment";
import "./index.css";
import { useNavigate } from "react-router-dom";

const EducationCard = ({ education }: { education: Education }) => {
  let startDate = moment(education.startDate.toDate()).format("MMM YYYY");
  let endDate = education.endDate
    ? moment(education.endDate.toDate()).format("MMM YYYY")
    : "Present";
  return (
    <div>
      <Row>
        <Typography.Title
          level={5}
          style={{
            margin: "0px 0px",
          }}
        >
          {education.school}
        </Typography.Title>
      </Row>
      <Row>
        <Typography.Text
          style={{
            margin: "0px 0px",
          }}
        >
          {education.degree}
        </Typography.Text>
      </Row>
      <Row gutter={16}>
        <Col>
          <Typography.Text>
            <CalendarIcon />
            {startDate} - {endDate}
          </Typography.Text>
        </Col>
        {education.grade && (
          <Col>
            <Typography.Text>
              <StarIcon />
              {education.grade}
            </Typography.Text>
          </Col>
        )}
      </Row>
      {education.description && (
        <Row>
          <Typography.Text
            style={{
              margin: "0px 0px",
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: education.description!,
              }}
            ></span>
          </Typography.Text>
        </Row>
      )}
    </div>
  );
};

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  let startDate = moment(experience.startDate.toDate()).format("MMM YYYY");
  let endDate = experience.endDate
    ? moment(experience.endDate.toDate()).format("MMM YYYY")
    : "Present";
  return (
    <div>
      <Row>
        <Typography.Title
          level={5}
          style={{
            margin: "0px 0px",
          }}
        >
          {experience.employerName}
        </Typography.Title>
      </Row>
      <Row>
        <Typography.Text
          style={{
            margin: "0px 0px",
          }}
        >
          {experience.position}
        </Typography.Text>
      </Row>
      <Row gutter={16}>
        <Col>
          <Typography.Text>
            <CalendarIcon />
            {startDate} - {endDate}
          </Typography.Text>
        </Col>
        {/* {education.grade && (
            <Col>
              <Typography.Text>
                <StarIcon />
                {education.grade}
              </Typography.Text>
            </Col>
          )} */}
      </Row>
      {experience.description && (
        <Row>
          <Typography.Text
            style={{
              margin: "0px 0px",
            }}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: experience.description!,
              }}
            ></span>
          </Typography.Text>
        </Row>
      )}

      {experience.achievements && (
        <Row>
          <ul>
            {experience.achievements.map((achievement) => {
              return (
                <li>
                  <Typography.Text
                    style={{
                      margin: "0px 0px",
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: achievement.description,
                      }}
                    ></span>
                  </Typography.Text>
                </li>
              );
            })}
          </ul>
        </Row>
      )}
    </div>
  );
};
const ResumePreviewV2_ = () => {
  const resumeData = useResume();
  const navigate = useNavigate();
  //   console.log("resumeData", resumeData);
  let personalInfo = resumeData.resume?.personalInfo!;

  if (resumeData.loading) {
    return <div>Loading...</div>;
  }

  const toResumes = () => {
    navigate("/resumes");
  };
  return (
    <div className="resume-preview">
      <Row
        style={{
          height: "36px",
        }}
        align="middle"
      >
        <Col>
          <Typography.Text type="secondary">
            <Button className="cv-link-button" type="link" onClick={toResumes}>
              Resumes
            </Button>{" "}
            /
            <Button className="cv-link-button" type="link">
              {resumeData.resume?.name}{" "}
            </Button>
          </Typography.Text>
        </Col>
        <Col
          style={{
            marginLeft: "auto",
          }}
        >
          <Dropdown.Button
            // type="primary"
            menu={{
              items: [
                {
                  key: "1",
                  label: "Download",
                  // 'icon': 'fas fa-download',
                  icon: <DownloadIcon />,
                },

                {
                  key: "2",
                  label: "Copy Public Link",
                  icon: <ShareIcon />,
                  // 'icon': 'fas fa-download',
                },
                {
                  key: "3",
                  label: "Delete",
                  danger: true,
                  icon: <DeleteIcon />,
                  // 'icon': 'fas fa-download',
                },
              ],
              onClick: (item) => {
                console.log(item);
              },
            }}
            onClick={() =>
              // Pass editMode = true
              navigate("/resumes-v2/" + resumeData.resume?.id + "/edit", {
                state: { editMode: true },
              })
            }
            // icon={<i className="fas fa-download"></i>}
          >
            <EditIcon />
            Edit Details
          </Dropdown.Button>
        </Col>
      </Row>

      <Row>
        <Typography.Title level={2} style={{ margin: "0px 0px" }}>
          {personalInfo.firstName} {personalInfo.lastName}{" "}
        </Typography.Title>
      </Row>

      <Row>
        <Typography.Title
          level={4}
          style={{
            fontWeight: "normal",
          }}
        >
          {personalInfo.currentRole}{" "}
        </Typography.Title>
      </Row>
      <Row gutter={16}>
        {personalInfo.city && personalInfo.country ? (
          <Col>
            <HomeIcon />
            {personalInfo.city}, {personalInfo.country}
          </Col>
        ) : null}
        {!personalInfo.city && personalInfo.country ? (
          <Col>
            <HomeIcon />
            {personalInfo.country}
          </Col>
        ) : null}
        {personalInfo.city && !personalInfo.country ? (
          <Col>
            <HomeIcon />
            {personalInfo.city}
          </Col>
        ) : null}
        {personalInfo.location ? (
          <Col>
            <HomeIcon />
            {personalInfo.location}
          </Col>
        ) : null}
        <Col>
          <Typography.Text>
            <EmailIcon />
            {personalInfo.email}
          </Typography.Text>
        </Col>

        {personalInfo.phone?.countryCode && personalInfo.phone?.number ? (
          <Col>
            <div>
              <PhoneIcon /> {personalInfo.phone?.countryCode}-
              {personalInfo.phone?.number}
            </div>
          </Col>
        ) : null}
      </Row>

      <Space direction="vertical" style={{ marginTop: "24px", width: "100%" }}>
        <Row>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Typography.Title level={4} style={{ margin: "4px 0px" }}>
                Summary
              </Typography.Title>
              <Divider
                style={{
                  width: "100%",
                  margin: "0px 0px",
                  borderColor: "#2c3a388c",
                  //   marginBottom: "12px",
                }}
              />
            </div>
            <Typography.Paragraph>
              <span
                dangerouslySetInnerHTML={{
                  __html: resumeData.resume?.professionalSummary!,
                }}
              ></span>
            </Typography.Paragraph>
          </Space>
        </Row>

        <Row>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Typography.Title level={4} style={{ margin: "4px 0px" }}>
                Education
              </Typography.Title>
              <Divider
                style={{
                  width: "100%",
                  margin: "0px 0px",
                  borderColor: "#2c3a388c",
                  //   marginBottom: "12px",
                }}
              />
            </div>

            {resumeData.resume?.educationList.map((edu) => {
              return <EducationCard education={edu} />;
            })}
          </Space>
        </Row>

        <Row>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Typography.Title level={4} style={{ margin: "4px 0px" }}>
                Experience
              </Typography.Title>
              <Divider
                style={{
                  width: "100%",
                  margin: "0px 0px",
                  borderColor: "#2c3a388c",
                  //   marginBottom: "12px",
                }}
              />
            </div>

            {resumeData.resume?.experienceList.map((experience) => {
              return <ExperienceCard experience={experience} />;
            })}
          </Space>
        </Row>

        <Row>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Typography.Title level={4} style={{ margin: "4px 0px" }}>
                Skills
              </Typography.Title>
              <Divider
                style={{
                  width: "100%",
                  margin: "0px 0px",
                  borderColor: "#2c3a388c",
                  //   marginBottom: "12px",
                }}
              />
            </div>
            <Row>
              {resumeData.resume?.skillList.map((skill) => {
                return (
                  <Col>
                    <Tag
                      color="var(--primary)"
                      style={{
                        fontSize: "14px",
                        padding: "4px 8px",
                      }}
                    >
                      {" "}
                      {skill.name}
                    </Tag>
                  </Col>
                );
              })}
            </Row>
          </Space>
        </Row>
      </Space>
    </div>
  );
};

const ResumePreviewV2 = () => {
  return (
    <ResumeProvider>
      <ResumePreviewV2_ />
    </ResumeProvider>
  );
};

export default ResumePreviewV2;

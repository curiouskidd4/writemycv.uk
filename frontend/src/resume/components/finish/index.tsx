import { Button, Col, Row, Typography } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResume } from "../../../contexts/resume";

const FinishView = () => {
  const { resumeId } = useParams();
  const { downloadResume } = useResume();

  const navigate = useNavigate();
  return (
    <div>
      <Row>
        <Typography.Title level={4}>Finished</Typography.Title>
      </Row>

      <Row>
        <Typography.Text>
          Your CV is ready! You can preview or download it now.
        </Typography.Text>
      </Row>

      <Row gutter={12} style={{
        marginTop: "24px"
      }}>
        <Col>
          <Button type="primary" onClick={() => navigate(`/resumes/${resumeId}`)}>
            Preview CV
          </Button>
        </Col>

        <Col>
          <Button onClick={() => {}}>
            Download CV
          </Button>
        </Col>
      </Row>
    </div>
  );
};


export default FinishView;
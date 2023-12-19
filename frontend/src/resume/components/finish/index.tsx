import { Button, Col, Row, Typography } from "antd";
import React from "react";

const FinishView = () => {
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
          <Button type="primary" onClick={() => {}}>
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
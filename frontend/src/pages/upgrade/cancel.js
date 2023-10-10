import {
  Card,
  Col,
  Divider,
  Row,
  Space,
  Typography,
  Button,
  message,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UpgradeCancel = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Row justify="center" align="middle" 
      style={
        {
          textAlign: "center",
        }
      }>
        <Col span={8}>
          <Card>
            <Space direction="vertical">

                <CloseCircleOutlined style={{ fontSize: "3rem" }} />
              <Typography.Title level={3}>Upgrade Cancelled</Typography.Title>
              <Typography.Text>
                Your upgrade to Resu.me Premium was cancelled.
              </Typography.Text>
              <Button type="primary" onClick={() => navigate("/resumes")}>
                Go to Dashboard
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpgradeCancel;

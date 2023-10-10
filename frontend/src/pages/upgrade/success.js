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
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UpgradeSuccess = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Row justify="center" align="middle" style={{
        textAlign: "center",
      }}>
        <Col span={8}>
          <Card>
            <Space direction="vertical">
              <CheckCircleOutlined style={{ fontSize: "3rem" }} />
              <Typography.Title level={3}>Upgrade Successful</Typography.Title>
              <Typography.Text>
                Thank you for upgrading to Resu.me Premium!
              </Typography.Text>
              <Button type="primary" onClick={() => navigate("/resumes")}>
                Go to Resumes
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpgradeSuccess;

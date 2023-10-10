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
import useStripe from "../../utils/stripe";
import { useState } from "react";

const Upgrade = () => {
  const [planId, setPlanId] = useState(null); // [1
  let stripe = useStripe();

  const onUpgrade = async (priceId) => {
    try {
      setPlanId(priceId);
      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId,
      });

      debugger;
      // Redirect to sessionUrl.

      setPlanId(null);
      window.open(sessionUrl, "_blank");
      
    } catch (error) {
      debugger;
      message.error("Error upgrading");
      setPlanId(null);
    }
  };

  // let pricingTable = [
  //   {
  //     period: "Monthly",
  //     price: "$12.99",
  //     priceId: "price_1NzO72SHT210NSXLxJwdsRDY",
  //     features: [
  //       "Unlimited Resumes",
  //       "AI Powered Suggestions",
  //       "Unlimited Templates",
  //       "Unlimited Exports",
  //       "Unlimited Storage",
  //     ],
  //   },
  //   {
  //     period: "12 Months",
  //     price: "$99.99",
  //     priceId: "price_1NzO72SHT210NSXLxJwdsRDY",
  //     features: [
  //       "Unlimited Resumes",
  //       "AI Powered Suggestions",
  //       "Unlimited Templates",
  //       "Unlimited Exports",
  //       "Unlimited Storage",
  //     ],
  //   },
  //   {
  //     period: "6 Months",
  //     price: "$59.99",
  //     priceId: "price_1NzO72SHT210NSXLxJwdsRDY",
  //     features: [
  //       "Unlimited Resumes",
  //       "AI Powered Suggestions",
  //       "Unlimited Templates",
  //       "Unlimited Exports",
  //       "Unlimited Storage",
  //     ],
  //   },
  // ];

  let pricingTable = [
    {
      period: "Monthly",
      price: "$12.99",
      priceId: "price_1NzOd5SHT210NSXLqL4uArjR",
      features: [
        "Unlimited Resumes",
        "AI Powered Suggestions",
        "Unlimited Templates",
        "Unlimited Exports",
        "Unlimited Storage",
      ],
    },
    {
      period: "12 Months",
      price: "$99.99",
      priceId: "price_1NzOdNSHT210NSXLb1dokjlE",
      features: [
        "Unlimited Resumes",
        "AI Powered Suggestions",
        "Unlimited Templates",
        "Unlimited Exports",
        "Unlimited Storage",
      ],
    },
    {
      period: "6 Months",
      price: "$59.99",
      priceId: "price_1NzOdNSHT210NSXLb1dokjlE",
      features: [
        "Unlimited Resumes",
        "AI Powered Suggestions",
        "Unlimited Templates",
        "Unlimited Exports",
        "Unlimited Storage",
      ],
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Upgrade</Typography.Title>

      <Row
        style={{
          marginTop: "1.5rem",
        }}
        gutter={[24, 24]}
      >
        {pricingTable.map((pricing) => (
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            xxl={8}
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <Card
              title={
                <Typography.Title level={4}>
                  {pricing.period} Plan
                </Typography.Title>
              }
            >
              <Typography.Title level={4}>{pricing.price}</Typography.Title>
              <Typography.Text type="secondary">
                {pricing.period}
              </Typography.Text>
              <Divider />
              {pricing.features.map((feature) => (
                <div
                  style={{
                    marginBottom: "0.5rem",
                  }}
                >
                  <Space>
                    <CheckCircleOutlined />
                    <Typography.Text>{feature}</Typography.Text>
                  </Space>
                </div>
              ))}
              <Button type="primary" onClick={() => onUpgrade(pricing.priceId)}
              loading={planId == pricing.priceId} 
              >
                Upgrade
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Upgrade;

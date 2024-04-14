import React from "react";
import { Button, Card, Col, message, Modal, Row, Typography } from "antd";
import {
  CREDITS_TABLE,
  FREE_TRIAL_FEATURES,
  PRICING_TABLE,
} from "../../constants";
import { CircleCheckIcon } from "../faIcons";
import useStripe from "../../utils/stripe";
import "./index.css";
const PremiumUpgradeComponent = ({ enabled }: { enabled: boolean }) => {
  const defaultPlan = PRICING_TABLE[0].priceId;
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(
    defaultPlan
  );
  const stripe = useStripe();

  const onUpgrade = async () => {
    try {
      let plan = PRICING_TABLE.find((plan) => plan.priceId === selectedPlan);

      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId: selectedPlan,
        planId: plan?.planId,
        isSubscription: true,
      });

      window.open(sessionUrl);
    } catch (error) {
      setSelectedPlan(null);
      message.error("Error upgrading");
    }
  };
  return (
    <Modal
      closable={true}
      closeIcon={true}
      width={1000}
      open={enabled}
      footer={null}
      className="default-modal"
    >
      <div className="header">
        <Typography.Title level={3}>Upgrade to premium</Typography.Title>
      </div>
      <div>
        <div
          style={{
            margin: "1rem 0rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem 0rem",
            }}
          >
            <Typography.Text type="secondary">
              With premium you will get:
            </Typography.Text>
          </div>
          {FREE_TRIAL_FEATURES.map((feature, index) => (
            <div
              key={index}
              style={{
                padding: "0.125rem 0rem",
              }}
            >
              <CircleCheckIcon color="var(--primary)" />{" "}
              <Typography.Text>{feature}</Typography.Text>
            </div>
          ))}
        </div>
        <Row justify="center">
          <Typography.Title level={4}>Choose a plan</Typography.Title>
        </Row>
        <Row
          gutter={24}
          style={{
            margin: "0.5rem 0rem",
          }}
        >
          {PRICING_TABLE.map((plan) => (
            <Col span={8} key={plan.planId}>
              <Card
                className={
                  selectedPlan === plan.priceId ? "pricing-card selected" : ""
                }
                hoverable
                onClick={() => setSelectedPlan(plan.priceId)}
              >
                <div className="pricing-info">
                  <Typography.Title level={4} className="plan-name">
                    {plan.planName}
                  </Typography.Title>
                  <Typography.Text className="plan-period">
                    {plan.period}
                  </Typography.Text>
                  <Typography.Title level={3} className="plan-price">
                    {plan.price}
                  </Typography.Title>
                  <Typography.Text
                    type="secondary"
                    className="plan-price-per-month"
                  >
                    ({plan.perMonth}/Month)
                  </Typography.Text>
                </div>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                {/* <Button
                  type="primary"
                  loading={selectedPlan === plan.priceId && stripe.loading}
                  onClick={() => onUpgrade(plan.priceId, plan.planId)}
                >
                  Upgrade
                </Button> */}
              </Card>
            </Col>
          ))}
        </Row>
        <Row
          justify="center"
          style={{
            margin: "1rem 0rem",
          }}
        >
          <Button
            type="primary"
            loading={selectedPlan && stripe.loading ? true : false}
            onClick={onUpgrade}
          >
            Start 3 Days Free trial
          </Button>
        </Row>
      </div>
    </Modal>
  );
};

const OutOfCreditsComponent = ({ enabled }: { enabled: boolean }) => {
  const defaultPlan = CREDITS_TABLE[0].priceId;
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(
    defaultPlan
  );
  const stripe = useStripe();

  const onUpgrade = async () => {
    try {
      let plan = CREDITS_TABLE.find((plan) => plan.priceId === selectedPlan);

      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId: selectedPlan,
        planId: plan?.planId,
        isSubscription: false,
      });

      window.open(sessionUrl);
    } catch (error) {
      setSelectedPlan(null);
      message.error("Error upgrading");
    }
  };

  return (
    <Modal
      closable={true}
      closeIcon={true}
      width={1000}
      open={enabled}
      footer={null}
      className="default-modal"
    >
      <div className="header">
        <Typography.Title level={3}>Out of credits</Typography.Title>
      </div>
      <div>
        <div
          style={{
            margin: "1rem 0rem",
          }}
        >
          <div
            style={{
              padding: "0.5rem 0rem",
            }}
          >
            <Typography.Text type="secondary">
              You have run out of credits. Please purchase more credits to
              continue using the service.
            </Typography.Text>
          </div>
        </div>
        <Row justify="center">
          <Typography.Title level={4}>Choose a credit pack</Typography.Title>
        </Row>
        <Row
          gutter={[24, 24]}
          style={{
            margin: "0.5rem 0rem",
          }}
        >
          {CREDITS_TABLE.map((creditPack) => (
            <Col span={8} key={creditPack.priceId}>
              <Card
                className={
                  selectedPlan === creditPack.priceId ? "pricing-card selected" : ""
                }
                hoverable
                onClick={() => setSelectedPlan(creditPack.priceId)}
              >
                <div className="pricing-info">
                  <Typography.Title level={4} className="plan-name">
                    {creditPack.credit} Credits
                  </Typography.Title>
                  <Typography.Title level={3} className="plan-price">
                    {creditPack.price}
                  </Typography.Title>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row
          justify="center"
          style={{
            margin: "1rem 0rem",
          }}
        >
          <Button
            type="primary"
            loading={selectedPlan && stripe.loading ? true : false}
            onClick={onUpgrade}
          >
            Purchase
          </Button>
        </Row>
      </div>
    </Modal>
  );
};
export { OutOfCreditsComponent };
export { PremiumUpgradeComponent };

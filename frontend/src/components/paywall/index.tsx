import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Typography,
} from "antd";
import {
  // CREDITS_TABLE,
  ENTERPRISE_FEATURES,
  FREE_TRIAL_FEATURES,
  PRICING_TABLE,
} from "../../constants";
import { CircleCheckIcon } from "../faIcons";
import useStripe from "../../utils/stripe";
import "./index.css";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
const PlanCard = ({
  plan,
  onUpgrade,
  isLoading,
}: {
  plan: any;
  onUpgrade: (planId: string) => void;
  isLoading: boolean;
}) => {
  return (
    <Card
      className={"pricing-card"}
      // hoverable
    >
      <div className="pricing-info">
        <Typography.Title level={4} className="plan-name">
          {plan.planName}
        </Typography.Title>
        <Typography.Text className="plan-period">
          {plan.period}
          {/* | {plan.credits} Credits */}
        </Typography.Text>
        <Typography.Title level={3} className="plan-price">
          {plan.perWeek}/Week
        </Typography.Title>
        <Typography.Text type="secondary" className="plan-price-per-month">
          {/* ({plan.perWeek}/Week) */}
          {plan.price} Total
        </Typography.Text>
      </div>
      <div>
        {plan.features.map((feature: any, idx: number) => (
          <div className="feature-container">
            <CircleCheckIcon color="var(--primary)" />
            <div key={idx} className="features">
              {" "}
              {feature}
            </div>
          </div>
        ))}
      </div>
      <Row justify="center">
        <Button
          className="upgrade-button"
          type="primary"
          loading={isLoading}
          // loading={selectedPlan === plan.priceId && stripe.loading}
          onClick={() => onUpgrade(plan.priceId)}
        >
          Get {plan.planName} Plan
        </Button>
      </Row>
    </Card>
  );
};

const EnterpriseContact = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const BASE_URL =
    process.env.REACT_APP_BASE_URL ||
    "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

  const sendMessage = async (values: any) => {
    setLoading(true);
    await axios.post(`${BASE_URL}/public/enterprise-contact-us`, values);
    message.success("Message sent");
    setLoading(false);
  };
  const [form] = Form.useForm();
  return (
    <Row className="enterprise-plan-form" gutter={24}>
      <Col span={12}>
        <div className="info">
          <Typography.Title level={4}>
            Enterprise <br />& Affiliates
          </Typography.Title>
          <div
            style={{
              marginTop: "2rem",
            }}
          >
            {ENTERPRISE_FEATURES.map((feature, index) => (
              <div className="feature-container">
                <CircleCheckIcon color="black" />
                <div key={index} className="features">
                  {" "}
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
      <Col span={12}>
        <Typography.Title level={4}>Contact Us</Typography.Title>

        <Form form={form} layout="vertical" onFinish={sendMessage}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Company"
            name="company"
            rules={[
              { required: true, message: "Please enter your company name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType="submit" type="primary">
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const PremiumUpgradeComponent = ({ enabled }: { enabled: boolean }) => {
  const auth = useAuth();

  console.log("auth.preSelectedPlanId", auth.preSelectedPlanId);
  useEffect(() => {
    if (auth.preSelectedPlanId) {
      onUpgrade(auth.preSelectedPlanId);
    }
  }, [auth.preSelectedPlanId]);

  const defaultPlan = PRICING_TABLE[0].priceId;
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(
    defaultPlan
  );

  const [enterpriseMode, setEnterpriseMode] = React.useState<boolean>(false);
  const stripe = useStripe();

  const onUpgrade = async (selectedPlan: string) => {
    try {
      setSelectedPlan(selectedPlan);
      let plan = PRICING_TABLE.find((plan) => plan.priceId === selectedPlan);

      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId: selectedPlan,
        planId: plan?.planId,
        isSubscription: true,
      });

      // window.open(sessionUrl);
      // Open in same tab
      window.location.href = sessionUrl;
    } catch (error) {
      setSelectedPlan(null);
      message.error("Error upgrading");
    }
  };

  if (auth.preSelectedPlanId) {
    // return <>Taking you to the payment page...</>;
    return <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <Spin size="large" />
    <Typography.Title level={3}>Taking you to the payment page...</Typography.Title>
  </div>
  }

  return (
    <Modal
      closable={true}
      closeIcon={true}
      width={1000}
      open={enabled}
      footer={null}
      className="default-modal subcription-options"
    >
      {enterpriseMode ? <EnterpriseContact /> : null}
      {!enterpriseMode ? (
        <>
          <div className="header">
            <Typography.Title level={3}>
              Choose the Plan That Matches Your Career Ambitions{" "}
            </Typography.Title>
          </div>
          <div>
            {/* <div
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
        </div> */}
            {/* <Row justify="center">
          <Typography.Title level={4}>Choose a plan</Typography.Title>
        </Row> */}
            <Row
              gutter={24}
              style={{
                margin: "0.5rem 0rem",
              }}
            >
              <Col span={8}>
                <PlanCard
                  plan={PRICING_TABLE[0]}
                  onUpgrade={onUpgrade}
                  isLoading={
                    selectedPlan === PRICING_TABLE[0].priceId && stripe.loading
                  }
                />
              </Col>

              <Col span={16}>
                <div className="second-pricing-card-container">
                  <Row gutter={24}>
                    <Col span={12}>
                      <PlanCard
                        plan={PRICING_TABLE[1]}
                        onUpgrade={onUpgrade}
                        isLoading={
                          selectedPlan === PRICING_TABLE[1].priceId &&
                          stripe.loading
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <PlanCard
                        plan={PRICING_TABLE[2]}
                        onUpgrade={onUpgrade}
                        isLoading={
                          selectedPlan === PRICING_TABLE[2].priceId &&
                          stripe.loading
                        }
                      />
                    </Col>
                  </Row>
                  {/* <div className="enterprise-plan-card">
                    <Row
                      justify="space-between"
                      align="middle"
                      style={{
                        padding: "0rem 2rem",
                      }}
                    >
                      <div className="enterprise-message">
                        Are you an Enterprise or interested in our Affiliates
                        program?
                      </div>
                      <Button
                        onClick={() => setEnterpriseMode(true)}
                        className="small-light-btn"
                      >
                        Contact Us
                      </Button>
                    </Row>
                  </div> */}
                </div>
              </Col>
            </Row>
            {/* <Row
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
        </Row> */}
          </div>
        </>
      ) : null}
    </Modal>
  );
};

// const OutOfCreditsComponent = ({ enabled, onCancel }: { enabled: boolean,
//   onCancel: () => void
//  }) => {
//   const defaultPlan = CREDITS_TABLE[0].priceId;
//   const [selectedPlan, setSelectedPlan] = React.useState<string | null>(
//     defaultPlan
//   );
//   const stripe = useStripe();

//   const onUpgrade = async () => {
//     try {
//       let plan = CREDITS_TABLE.find((plan) => plan.priceId === selectedPlan);

//       let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
//         priceId: selectedPlan,
//         planId: plan?.planId,
//         isSubscription: false,
//       });

//       // window.open(sessionUrl);
//       window.location.href = sessionUrl;

//     } catch (error) {
//       setSelectedPlan(null);
//       message.error("Error upgrading");
//     }
//   };

//   return (
//     <Modal
//       closable={true}
//       onCancel={onCancel}
//       closeIcon={true}
//       width={1000}
//       open={enabled}
//       footer={null}
//       className="default-modal"
//     >
//       <div className="header">
//         <Typography.Title level={3}>Out of credits</Typography.Title>
//       </div>
//       <div>
//         <div
//           style={{
//             margin: "1rem 0rem",
//           }}
//         >
//           <div
//             style={{
//               padding: "0.5rem 0rem",
//             }}
//           >
//             <Typography.Text type="secondary">
//               You have run out of credits. Please purchase more credits to
//               continue using the service.
//             </Typography.Text>
//           </div>
//         </div>
//         <Row justify="center">
//           <Typography.Title level={4}>Choose a credit pack</Typography.Title>
//         </Row>
//         <Row
//           gutter={[24, 24]}
//           style={{
//             margin: "0.5rem 0rem",
//           }}
//         >
//           {CREDITS_TABLE.map((creditPack) => (
//             <Col span={8} key={creditPack.priceId}>
//               <Card
//                 className={
//                   selectedPlan === creditPack.priceId
//                     ? "pricing-card selected"
//                     : ""
//                 }
//                 hoverable
//                 onClick={() => setSelectedPlan(creditPack.priceId)}
//               >
//                 <div className="pricing-info">
//                   <Typography.Title level={4} className="plan-name">
//                     {creditPack.credit} Credits
//                   </Typography.Title>
//                   <Typography.Title level={3} className="plan-price">
//                     {creditPack.price}
//                   </Typography.Title>
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//         <Row
//           justify="center"
//           style={{
//             margin: "1rem 0rem",
//           }}
//         >
//           <Button
//             type="primary"
//             loading={selectedPlan && stripe.loading ? true : false}
//             onClick={onUpgrade}
//           >
//             Purchase
//           </Button>
//         </Row>
//       </div>
//     </Modal>
//   );
// };
// export { OutOfCreditsComponent };
export { PremiumUpgradeComponent };

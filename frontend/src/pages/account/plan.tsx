import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Progress,
  Row,
  Typography,
} from "antd";
import "./index.css";
import { DownloadIcon } from "../../components/faIcons";
import { useAuth } from "../../authContext";
import { useDoc } from "../../firestoreHooks";
import { useNavigate } from "react-router-dom";
import useStripe from "../../utils/stripe";
import moment from "moment";
let stripeDashboardURL =
  "https://billing.stripe.com/p/login/test_28o3fYaln3oTenC7ss";

const BILLING_PRODUCTS = {
  // FREE_TRIAL : "free_trial",
  PRO_BI_WEEKLY: "pro_bi_weekly",
  PRO_QUATERLY: "pro_quaterly",
  PRO_YEARLY: "pro_yearly",
};

let pricingTable = [
  {
    planName: "Quick Work",
    period: "14 Days",
    price: "£6.99",
    priceId: "price_1P3k8zSHT210NSXLloFRLMHs",
    planId: "pro_bi_weekly",
    features: [
      "Unlimited Resumes",
      "AI Powered Suggestions",
      "Unlimited Templates",
      "Unlimited Exports",
      "Unlimited Storage",
    ],
  },
  {
    planName: "Job Hunter",
    period: "3 Months",
    price: "£35.99",
    priceId: "price_1P3kA0SHT210NSXL4qNPrVkf",
    planId: "pro_quaterly",

    features: [
      "Unlimited Resumes",
      "AI Powered Suggestions",
      "Unlimited Templates",
      "Unlimited Exports",
      "Unlimited Storage",
    ],
  },
  {
    planName: "Career Mate",
    period: "12 Months",
    price: "£74.99",
    planId: "pro_yearly",

    priceId: "price_1P3kAPSHT210NSXLXCnQuFVV",
    features: [
      "Unlimited Resumes",
      "AI Powered Suggestions",
      "Unlimited Templates",
      "Unlimited Exports",
      "Unlimited Storage",
    ],
  },
];

let creditTable = [
  {
    credit: "100",
    price: "£3.99",
    priceId: "price_1P3kEkSHT210NSXLSpijxXw0",
    planId: "credit_pack_100",
  },
  {
    credit: "300",
    price: "£6.99",
    priceId: "price_1P3kFLSHT210NSXLm00HoXoH",
    planId: "credit_pack_300",
  },
  {
    credit: "500",
    price: "£9.99",
    priceId: "price_1P3kFxSHT210NSXL3ER8qjRA",
    planId: "credit_pack_500",
  },
  {
    credit: "1000",
    price: "£17.99",
    priceId: "price_1P3kGSSHT210NSXL9yMwSdGH",
    planId: "credit_pack_1000",
  },
];

const SubscriptionModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedPlan, setSelectedPlan] = React.useState<null | string>(null);
  let stripe = useStripe();

  const onUpgrade = async (priceId: string, planId: string) => {
    try {
      setSelectedPlan(priceId);
      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId,
        planId,
        isSubscription: true,
      });

      window.open(sessionUrl, "_blank");
    } catch (error) {
      setSelectedPlan(null);
      message.error("Error upgrading");
    }
  };

  return (
    <Modal
      width={800}
      closeIcon={true}
      open={open}
      footer={null}
      onCancel={onClose}
      zIndex={1050}
      className="default-modal"
    >
      <div className="header">
        <Typography.Title level={4}>Buy Subscription</Typography.Title>

        <Row gutter={24}>
          {pricingTable.map((plan) => (
            <Col span={8} key={plan.planId}>
              <Card>
                <Typography.Title level={4}>{plan.planName}</Typography.Title>
                <Typography.Text>{plan.period}</Typography.Text>
                <Typography.Title level={3}>{plan.price}</Typography.Title>
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <Button
                  type="primary"
                  loading={selectedPlan === plan.priceId && stripe.loading}
                  onClick={() => onUpgrade(plan.priceId, plan.planId)}
                >
                  Upgrade
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};

const CreditModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [selectedPlan, setSelectedPlan] = React.useState<null | string>(null);

  let stripe = useStripe();

  const onUpgrade = async (priceId: string, planId: string) => {
    try {
      setSelectedPlan(priceId);
      let { sessionId, sessionUrl } = await stripe.getStripeSessionUrl({
        priceId,
        planId,
        isSubscription: false,
      });

      window.open(sessionUrl, "_blank");
    } catch (error) {
      setSelectedPlan(null);
      message.error("Error upgrading");
    }
  };

  return (
    <Modal
      width={800}
      closeIcon={true}
      open={open}
      footer={null}
      onCancel={onClose}
      zIndex={1050}
      className="default-modal"
    >
      <div className="header">
        <Typography.Title level={4}>Purchase Credits</Typography.Title>

        <Row gutter={[12, 12]} wrap>
          {creditTable.map((plan) => (
            <Col span={8} key={plan.planId}>
              <Card>
                <Typography.Title level={4}>
                  {plan.credit} Credits
                </Typography.Title>
                <Typography.Title level={3}>{plan.price}</Typography.Title>
                <Button
                  type="primary"
                  loading={selectedPlan === plan.priceId && stripe.loading}
                  onClick={() => onUpgrade(plan.priceId, plan.planId)}
                >
                  Buy Credits
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};

const Invoices = () => {
  const stripe = useStripe();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    let invoices = await stripe.getInvoices();
    console.log(invoices);
  };

  const getPlanName = (invoice: any) => {
    let planId = invoice.lines.data[0].plan.id;
    let planName = pricingTable.find((plan) => plan.priceId === planId);

    if (planName) return planName.planName;

    return "Unknown Plan";
  };

  return (
    <div>
      <Row gutter={24}>
        <Col  span={4} className="invoice-header-cell">Name</Col>
        <Col  span={4} className="invoice-header-cell">Date</Col>
        <Col  span={4} className="invoice-header-cell">Amount</Col>
        <Col  span={4} className="invoice-header-cell">Paid</Col>

        <Col  span={4} className="invoice-header-cell">Plan</Col>
        <Col  span={4} className="invoice-header-cell">Download</Col>
      </Row>
      <Divider />
      {stripe.data?.invoices &&
        stripe.data?.invoices?.map((invoice: any) => {
          return (
            <>
              <Row gutter={24}>
                <Col span={4}>{invoice.number}</Col>
                <Col span={4}>
                  {
                    // invoice.created - format in 01 Jan 2021
                    moment(invoice.created * 1000).format("DD MMM YYYY")
                  }
                </Col>
                <Col span={4}>£{invoice.amount_due / 100}</Col>
                <Col span={4}>{invoice.paid ? "PAID" : "UNPAID"}</Col>

                <Col span={4}>{getPlanName(invoice)}</Col>
                <Col span={4}>
                  <Button size="small" className="small-light-btn"
                  onClick={
                    () => window.open(invoice.invoice_pdf, "_blank")
                  }
                  >
                    <DownloadIcon color="black" /> Download
                  </Button>
                </Col>
              </Row>
              <Divider />
            </>
          );
        })}
    </div>
  );
};
const YourPlan = () => {
  const { user } = useAuth();
  const userDoc = useDoc(`users`, user.uid);
  const creditDoc = useDoc(`credits`, user.uid);
  const [subscriptionModal, setSubscriptionModal] = React.useState(false);
  const [creditModal, setCreditModal] = React.useState(false);

  const navigate = useNavigate();
  return (
    <>
      <SubscriptionModal
        open={subscriptionModal}
        onClose={() => setSubscriptionModal(false)}
      />
      <CreditModal open={creditModal} onClose={() => setCreditModal(false)} />

      <div
        style={{
          margin: "1.5rem 0rem",
        }}
      >
        <Typography.Text type="secondary" className="section-header">
          Current Plan
        </Typography.Text>
      </div>
      {userDoc?.data?.subscriptionId && (
        <div className="plan-card">
          <div className="plan-card__header">
            <span className="heading">Silver Plan</span>
            <Button  type="default" size="small" className="small-light-btn">
              <DownloadIcon color="#000000" />
              Download Contract
            </Button>
          </div>

          <Row gutter={24}>
            <Col>
              <div className="data-item">
                <div className="data-item-heading">Monthly Credits</div>
                <div className="data-item-value">50 Credits</div>
              </div>
            </Col>
            <Col>
              <div className="data-item">
                <div className="data-item-heading"> Cost</div>
                <div className="data-item-value">$50.00</div>
              </div>
            </Col>
          </Row>

          <Row align="middle" gutter={24}>
            <Col>
              <div className="data-item">
                <div className="data-item-heading">Credits Usage</div>
                <div className="data-item-value">
                  Renews on {userDoc.data?.expiry.toDate().toDateString()}
                </div>
              </div>
            </Col>
            <Col>
              <Button
                size="small"
                className="small-dark-btn"
                onClick={() => setCreditModal(true)}
              >
                Buy Credits
              </Button>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col flex="auto">
              <Progress
                percent={
                  (creditDoc?.data?.credits / creditDoc?.data?.totalCredits) *
                  100
                }
                showInfo={false}
                strokeColor="var(--primary)"
                strokeWidth={24}
              />
            </Col>
            <Col>
              <span>
                <strong>{creditDoc?.data?.credits}</strong>/
                {creditDoc?.data?.totalCredits}
              </span>
            </Col>
          </Row>

          <Row
            style={{
              marginTop: "16px",
            }}
            justify="end"
          >
            <Button
              size="small"
              className="small-dark-btn"
              onClick={() => window.open(stripeDashboardURL, "_blank")}
            >
              Manage Subscription
            </Button>
          </Row>
        </div>
      )}
      {!userDoc?.data?.subscriptionId && (
        <Card>
          <Typography.Text>
            You are not subscribed to any plan. Please subscribe to a plan to
            access all features.
          </Typography.Text>
          <Row>
            <Button
              size="small"
              className="small-dark-btn"
              onClick={() => setSubscriptionModal(true)}
            >
              Buy Subscription
            </Button>
          </Row>
        </Card>
      )}

      <div
        style={{
          margin: "1.5rem 0rem",
        }}
      >
        <Typography.Text type="secondary" className="section-header">
          Invoices
        </Typography.Text>
      </div>
      <div>
        <Invoices />
      </div>
    </>
  );
};

export default YourPlan;

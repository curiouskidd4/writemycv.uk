import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  CardElement,
} from "@stripe/react-stripe-js";
import { membershipDetails, paymentErrorMessage } from "./helpers";
import Loader from "../../components/Loader.jsx";
import { AddIcon, WarningIcon } from "../../components/Icons.jsx";
import "./payments.css";
import { useMutation } from "react-query";
import { Button, Card, Col, Input, Tag, Typography } from "antd";
import { PaymentServices } from "../../services/dataService";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../../authContext";

export default function Payment() {
  const { user } = useAuth();

  // END Date - 2023-10-07T22:49:50
  const subEndDate = user.subscription?.end_date;
  const isExpired = subEndDate ? new Date(subEndDate) < new Date() : false;
  console.log("isExpired", isExpired);
  return (
    <div className="wrapper payment">
      <div className="header">
        <h1>Account</h1>
      </div>

      <Typography.Title level={4}>Account Details</Typography.Title>
      <Typography.Text>
        Name
        <br />
      </Typography.Text>
      <Typography.Paragraph>
        <b>{user.name}</b>
        <br />
      </Typography.Paragraph>

      <Typography.Text>
        Email
        <br />
      </Typography.Text>
      <Typography.Paragraph>
        <b>{user.email}</b>
        <br />
      </Typography.Paragraph>

      <Typography.Text>
        Role: {user.is_admin ? <Tag color="blue">Admin</Tag> : null}
        {user.is_superuser ? <Tag color="green">Superuser</Tag> : null}
        {!user.is_admin && !user.is_superuser ? (
          <Tag color="purple">Member</Tag>
        ) : null}
      </Typography.Text>

      {/* <Elements stripe={stripePromise}>
        <PaymentPlans values={values} setValues={setValues} />
        <PaymentSummary values={values} />
        <PaymentForm values={values} setValues={setValues} />
      </Elements> */}
      <Typography.Title level={4}>Subscription</Typography.Title>

      {!user.subscription && !isExpired ? (
        <div style={{ marginTop: "1rem" }}>
          <Typography.Title level={4}>
            {isExpired
              ? "Your subscription has expired, please select a plan"
              : "Please select a plan"}
          </Typography.Title>

          <stripe-pricing-table
            pricing-table-id="prctbl_1Nnl8pEwTXWCP5KGKLSkkEE1"
            client-reference-id={user.id}
            customer-email={user.email}
            publishable-key="pk_test_51MwpovEwTXWCP5KGNxT8FdbAcKOccTlgNR8aH8gHa0ZZHuc9uTTal3f1e3b0PQlI9MRkStwzHp9PwY5k5bYdSCEi00ebOzaw5a"
          ></stripe-pricing-table>
        </div>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <Typography.Title level={5}>
            You are already subscribed to a plan
          </Typography.Title>
          <Typography.Paragraph>
            Subscription ID: {user.subscription.id}
          </Typography.Paragraph>
          <Typography.Paragraph>
            {" "}
            Please go to the stripe{" "}
            <a href={`${process.env.REACT_APP_STRIPE_PORTAL}`} target="_blank">
              portal
            </a>{" "}
            to manage your subscription
          </Typography.Paragraph>
        </div>
      )}
    </div>
  );
}

// function PaymentPlans({ values, setValues }) {
//   const handleMembershipPlan = (plan) => {
//     let amountLicenses = plan === "multipleYear" ? "5" : "1";
//     setValues({ ...values, membershipPlan: plan, amountLicenses });
//   };

//   return (
//     <div className="item plans">
//       <Row style={{ width: "100%" }} gutter={[12, 12]}>
//         <Col span={8} md={8} xs={24}>
//           <Card>
//             <div className="option">
//               <h2>Single User</h2>
//               <p>$166 / month</p>
//               <Button
//                 style={{ width: "150px" }}
//                 type={
//                   values.membershipPlan === "singleMonth"
//                     ? "primary"
//                     : undefined
//                 }
//                 onClick={() => handleMembershipPlan("singleMonth")}
//               >
//                 {values.membershipPlan !== "singleMonth" && <PlusOutlined />}
//                 {values.membershipPlan === "singleMonth"
//                   ? "Selected"
//                   : "Select Plan"}
//               </Button>
//             </div>
//           </Card>
//         </Col>
//         <Col span={8} md={8} xs={24}>
//           <Card>
//             <div className="option">
//               <h2>Single User</h2>
//               <p>$1999 / year</p>
//               <Button
//                 style={{ width: "150px" }}
//                 type={
//                   values.membershipPlan === "singleYear" ? "primary" : undefined
//                 }
//                 onClick={() => handleMembershipPlan("singleYear")}
//               >
//                 {values.membershipPlan !== "singleYear" && <PlusOutlined />}
//                 {values.membershipPlan === "singleYear"
//                   ? "Selected"
//                   : "Select Plan"}
//               </Button>
//             </div>
//           </Card>
//         </Col>
//         <Col span={8} md={8} xs={24}>
//           <Card>
//             <div className="option">
//               <h2>Multiple Users</h2>
//               <p>From $499 / user year</p>

//               <Button
//                 style={{ width: "150px" }}
//                 type={
//                   values.membershipPlan === "multipleYear"
//                     ? "primary"
//                     : undefined
//                 }
//                 onClick={() => handleMembershipPlan("multipleYear")}
//               >
//                 {values.membershipPlan !== "multipleYear" && <PlusOutlined />}
//                 {values.membershipPlan === "multipleYear"
//                   ? "Selected"
//                   : "Select Plan"}
//               </Button>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// function PaymentSummary({ values }) {
//   const details = membershipDetails(
//     values.membershipPlan,
//     values.amountLicenses
//   );

//   const isMultipleUsersMembership = values.membershipPlan === "multipleYear";
//   const membershipLabel =
//     values.membershipPlan === "singleMonth"
//       ? " / month"
//       : values.membershipPlan === "multipleYear"
//       ? " / user year"
//       : " / year";

//   return (
//     <div className="item summary">
//       <h4>Summary</h4>

//       <p>Selected Plan: {details.name}</p>
//       <p>Amount Licenses: {values.amountLicenses}</p>
//       <p>
//         Price License: ${details.price} {membershipLabel}
//       </p>
//       <p>
//         Total Payment Amount: $
//         {values.amountLicenses
//           ? details.price * parseInt(values.amountLicenses)
//           : 0}
//       </p>
//     </div>
//   );
// }

// function PaymentForm({ values, setValues, user }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const createSubscription = useMutation(
//     async (data) => PaymentServices.createSubscription(data),
//     {
//       onSuccess: (data) => {
//         let { subscriptionId, clientSecret } = data;
//         handleCompleteSubscription(clientSecret);
//       },
//     }
//   );
//   const [state, setState] = useState({});

//   // Disable form submission until stripe is loaded
//   if (!stripe || !elements) return;

//   const isMultipleUsers = values.membershipPlan === "multipleYear";

//   const handleSubmit = () => {
//     createSubscription.mutate({
//       membershipPlan: values.membershipPlan,
//       amountLicenses: state.amountLicenses,
//     });
//   };

//   const handleCompleteSubscription = async (clientSecret) => {
//     const { error } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//         billing_details: { name: values.name, email: values.email },
//       },
//     });

//     if (error)
//       return setValues({ ...values, error: error.message, loading: false });

//     // setValues({ ...values, loading: false });
//     // navigate("/account");
//   };

//   return (
//     <div className="item form">
//       <div className="head">
//         <h4>Payment</h4>
//       </div>

//       <form onSubmit={handleSubmit} className="body">
//         {isMultipleUsers && (
//           <label>
//             <span>
//               Amount Licenses <div>{values.amountLicenses}</div>
//             </span>
//             {/* <input
//               type="range"
//               name="amountLicenses"
//               value={values.amountLicenses}
//               onChange={handleChange}
//               min={5}
//               max={300}
//             /> */}
//             <Input
//               type="number"
//               name="amountLicenses"
//               value={values.amountLicenses}
//               onChange={(e) =>
//                 setValues({ ...values, amountLicenses: e.target.value })
//               }
//               min={5}
//               max={300}
//             />
//           </label>
//         )}

//         <CardElement
//           onChange={(event) => {
//             // console.log(event);
//             setState({ ...state, cardComplete: event.complete });
//           }}
//         />

//         <div className="actions">
//           <Button
//             // type="submit"
//             htmlType="submit"
//             type="primary"
//             disabled={state.cardComplete ? false : true}
//             // className="button primary"
//           >
//             {values.loading ? <Loader /> : "Subscribe"}
//           </Button>

//           {values.error && (
//             <p className="error-message">
//               <WarningIcon /> {paymentErrorMessage(values.error)}
//             </p>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

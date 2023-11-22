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

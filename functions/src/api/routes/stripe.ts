// userRoutes.ts

import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import stripe_ from "stripe";
import { STRIPE_BACKEND_KEY } from "../../utils/vars";
import bodyParser from "body-parser";
const { validate } = new Validator({});

const router = Router();
console.log("STRIPE_BACKEND_KEY", STRIPE_BACKEND_KEY.value());
const stripe = new stripe_(
  "sk_test_51NzKZcSHT210NSXLdn7ORLdshtiGdauxKjauxwEN7NrojYaxRdn5AmDl7EPTWv0UwzJCTgPhtvOLYPhtQnL0d9JN00oefj9riQ",
  {
    apiVersion: "2023-08-16",
  }
);

const DOMAIN = "http://localhost:3000";
// Create checkout session
router.post("/create-checkout-session", async (req: Request, res: Response) => {
  // Get Price ID from body
  const { priceId, quantity } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      mode: "subscription",
      success_url: `${DOMAIN}/upgrade/success`,
      cancel_url: `${DOMAIN}/upgrade/cancel`,
    });
    //   res.json({ id: session.id });
    res.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: err });
  }
  return;
});

const fulfillOrder = async (session: stripe_.Checkout.Session) => {
  // Update user document
  let email = session.customer_details?.email;

  if (!email) {
    console.log("No email found");
    return;
  }

  // Get user document
  const user = await db.collection("users").where("email", "==", email).get();

  let subscription;
  let subscriptionId;
  if (!session.subscription) {
    console.log("No subscription found");
    return;
    type i = typeof session.subscription;
  }
  // Check if it's a string or not
  if (typeof session.subscription === "string") {
    subscriptionId = session.subscription;
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } else {
    subscriptionId = session.subscription.id;
    subscription = session.subscription;
  }

  let expiry = subscription.current_period_end;
  console.log("Expiry: ", expiry);

  // Update user document
  let userId = user.docs[0].id;
  console.log("User ID: ", userId);

  await db.collection("users").doc(userId).update({
    expiry: expiry,
    subscriptionId: subscriptionId,
  });

  // get subscription
  // const subscription = stripe.subscriptions.retrieve(subscriptionId);
};


export default router;

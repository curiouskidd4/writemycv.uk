// userRoutes.ts

import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import stripe_ from "stripe";
import { HOST_URL, STRIPE_BACKEND_KEY } from "../../utils/vars";
import bodyParser from "body-parser";
import { CustomRequest } from "../../types/requests";
const { validate } = new Validator({});
const router = Router();

const DOMAIN = "http://localhost:3000";
// Create checkout session
router.post(
  "/create-checkout-session",
  async (req: CustomRequest, res: Response) => {
    let user = req.user!;
    let firebaseUserRef = await db.collection("users").doc(user.uid).get();
    let userData = firebaseUserRef.data();
    const stripe = new stripe_(STRIPE_BACKEND_KEY.value(), {
      apiVersion: "2023-08-16",
    });

    if (!userData) {
      res.status(400).send("User not found");
      return;
    }

    // Get Price ID from body
    const { priceId,  planId, isSubscription } = req.body;

    if (!priceId || !planId) {
      res.status(400).json({ error: "Price ID is required" });
      return;
    }

    
    // Create customer in stripe
    if (!userData?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: userData?.email,
          name: userData?.name,
        });
        await db.collection("users").doc(user.uid).update({
          stripeCustomerId: customer.id,
        });
        userData!.stripeCustomerId = customer.id;
      } catch (err) {
        console.log("Error", err);
        res.status(500).json({ error: err });
        return;
      }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity:  1,
          },
        ],
        metadata: {
          userId: user.uid,
          planId: planId,
        },
        customer: userData?.stripeCustomerId,
        customer_email: userData?.stripeCustomerId ? undefined :userData?.email,
        customer_creation: userData?.stripeCustomerId ? undefined : "always",
        mode: isSubscription ? "subscription" : "payment",
        success_url: `${HOST_URL.value()}/upgrade/success`,
        cancel_url: `${HOST_URL.value()}/upgrade/cancel`,
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
  }
);

router.get("/invoices", async (req: CustomRequest, res: Response) => {
  let user = req.user!;
  let firebaseRef = await db.collection("users").doc(user.uid).get();
  let firebaseUser = firebaseRef.data();
  if (!firebaseUser) {
    res.status(400).send("User not found");
    return;
  }

  if (!firebaseUser.stripeCustomerId) {
    res.status(200).send({
      invoices: [],
    });
    return;
  }
  const stripe = new stripe_(STRIPE_BACKEND_KEY.value(), {
    apiVersion: "2023-08-16",
  });

  try {
    const invoices = await stripe.invoices.list({
      customer: firebaseUser.stripeCustomerId,
    });

    res.json({ invoices: invoices.data });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ error: err });
  }
}
);


const fulfillOrder = async (session: stripe_.Checkout.Session) => {
  const stripe = new stripe_(STRIPE_BACKEND_KEY.value(), {
    apiVersion: "2023-08-16",
  });

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

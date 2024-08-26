import { Router, Request, Response } from "express";
// import { myMiddleware } from '../middlewares';
import { Validator } from "express-json-validator-middleware";
import { db } from "../../utils/firebase";
import stripe_ from "stripe";
import { STRIPE_BACKEND_KEY, STRIPE_WEBHOOK_KEY } from "../../utils/vars";
import bodyParser from "body-parser";
import express from "express";
import { firestore } from "firebase-admin";
import { addCredits } from "../controllers/billing/credits";
import { Timestamp } from "firebase-admin/firestore";

const { validate } = new Validator({});

const router = Router();

const fulfillOrder = async (session: stripe_.Checkout.Session) => {
  // Update user document
  const stripe = new stripe_(STRIPE_BACKEND_KEY.value(), {
    apiVersion: "2023-08-16",
  });

  let email = session.customer_details?.email;

  if (!email) {
    console.log("No email found");
    return;
  }

  // Get user document
  const user = await db.collection("users").where("email", "==", email).get();

  let subscription;
  let subscriptionId;
  let creditPack;
  let priceId;
  // if (!session.subscription) {
  //   console.log("No subscription found");
  //   return;
  //   type i = typeof session.subscription;
  // }
  // Check if it's a string or not
  if (typeof session.subscription === "string") {
    subscriptionId = session.subscription;
    subscription = await stripe.subscriptions.retrieve(subscriptionId);
  } else if (session.subscription) {
    subscriptionId = session.subscription.id;
    subscription = session.subscription;
  }

  let metadata = session.metadata;
  let planId = metadata!.planId;
  console.log("Metadata ", metadata);
  // No subscription found, must be a credit pack
  let lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  priceId = lineItems.data[0].price?.id;
  // Update user document
  let userId = user.docs[0].id;
  console.log("Plan ID: ", planId, userId);

  if (!userId) {
    console.log("No user found");
    return;
  }

  if (subscription) {
    let expiry = subscription.current_period_end;
    console.log("Expiry: ", expiry);

    console.log("User ID: ", userId);

    await db
      .collection("users")
      .doc(userId)
      .update({
        expiry: new Date(expiry * 1000),
        subscriptionId: subscriptionId,
        planId: planId,
        subscriptionDate: Timestamp.now(),
        stripeCustomerId: session.customer,
        
      });
    // await addCredits(planId! as any, userId! as any);
  } else {
    await db.collection("users").doc(userId).update({
      // subscriptionDate: Timestamp.now(),
      stripeCustomerId: session.customer,
    });

    // await addCredits( planId! as any, userId! as any);
  }
  // get subscription
  // const subscription = stripe.subscriptions.retrieve(subscriptionId);
};

// Webhook for stripe
router.post("/webhook", async (req: any, res: Response) => {
  const payload = req.rawBody;
  const sig = req.headers["stripe-signature"] as string;
  const stripe = new stripe_(STRIPE_BACKEND_KEY.value(), {
    apiVersion: "2023-08-16",
  });
  let event: stripe_.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      STRIPE_WEBHOOK_KEY.value() || "whsec_b0d7d3d0951e677f2d280b7361a34d32b68944aa2196d9fe2765a3e90778d14f"
    );
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌❌ Error message: ${err}`);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Successfully constructed event
  console.log("✅ Success:", event.id);

  // Cast event data to Stripe object
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as stripe_.Checkout.Session;
    console.log(`🔔  Payment received!`);
    // Fulfill the purchase...
    // handleCheckoutSession(session);
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      }
    );

    await fulfillOrder(sessionWithLineItems);
  }

  res.status(200).json({ received: true });
});

export default router;

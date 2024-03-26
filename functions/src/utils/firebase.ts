import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import * as googleFirestore from "@google-cloud/firestore"
import * as googleFirestore from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2/options";

const client = new googleFirestore.v1.FirestoreAdminClient();

setGlobalOptions({
//   region: process.env.ENV == "dev" ? "us-central1" : "europe-west1",
region: "europe-west1",
});
admin.initializeApp({
  storageBucket:
    process.env.ENV === "testing" ? "test-bucket" : "writemycv.appspot.com",
});
const db = admin.firestore();
if (process.env.ENV === "testing") {
  db.settings({
    ignoreUndefinedProperties: true,
    host: "127.0.0.1:8080",
    ssl: false,
  });
}

// const client = FirestoreAdminClient
const bucket = admin
  .storage()
  .bucket(
    process.env.ENV === "testing"
      ? "test-bucket"
      : process.env.STORAGE_BUCKET || "writemycv.appspot.com"
  );

export { functions, admin, db, client, bucket };

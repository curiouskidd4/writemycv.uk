import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
// import * as googleFirestore from "@google-cloud/firestore"
import * as googleFirestore from 'firebase-admin/firestore'

const client = new googleFirestore.v1.FirestoreAdminClient();

admin.initializeApp({
    storageBucket: process.env.ENV === "testing" ? "test-bucket" : "resu-me-a5cff.appspot.com",
});
const db = admin.firestore();
if (process.env.ENV === "testing") {
    db.settings({ ignoreUndefinedProperties: true, host: "localhost:5002", ssl: false });

}

// const client = FirestoreAdminClient
const bucket = admin.storage().bucket(process.env.ENV === "testing" ? "test-bucket" : process.env.STORAGE_BUCKET || "resu-me-a5cff.appspot.com");

export { functions, admin, db, client, bucket }
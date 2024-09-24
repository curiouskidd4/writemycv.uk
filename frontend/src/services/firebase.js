// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBDWzW5dBu9NLzbqGK64mj1-Y4JSG-sI3w",
//   authDomain: "resu-me-a5cff.firebaseapp.com",
//   projectId: "resu-me-a5cff",
//   storageBucket: "resu-me-a5cff.appspot.com",
//   messagingSenderId: "676718477548",
//   appId: "1:676718477548:web:3fb7e0dcda42d9624ae5c9",
//   measurementId: "G-KK5TPK7Y1T",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDdGho0VxS6OBC4KryUtAmAEd32-IJVsgE",
  authDomain: "writemycv.firebaseapp.com",
  projectId: "writemycv",
  storageBucket: "writemycv.appspot.com",
  messagingSenderId: "654692254424",
  appId: "1:654692254424:web:2ff230ba4e6ffff57f8dad",
  measurementId: "G-GE4JN4CWK3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LdtQIkoAAAAABDOTQoJre0p1DzjIKT_8pebSYPD"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });
const appCheck = null

// if (window.location.hostname === "localhost") {
//   // Point to the RTDB emulator running on localhost.
//   connectStorageEmulator(storage, "127.0.0.1", 9199);
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export { auth, db, analytics, storage, appCheck };

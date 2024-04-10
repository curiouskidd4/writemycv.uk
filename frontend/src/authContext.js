import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "./services/firebase";
import { EmailAuthProvider, User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import mixpanel from "mixpanel-browser";

import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
const gauthProvider = new GoogleAuthProvider();
const baseUrl =
  process.env.REACT_APP_BASE_URL ||
  "http://127.0.0.1:5001/resu-me-a5cff/us-central1/api";

const authContext = createContext();

mixpanel.init("f337c77cbbc6ce34f0e8de32d939b3c9", {
  debug: true,
  ignore_dnt: true,
  track_pageview: true,
  persistence: "localStorage",
});
console.log("Mixpanel initialized");

const ProviderAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
    user: null,
    isAuthenticated: false,
    isProfileComplete: false,
    isRepoCompleted: false,
    isEmailVerified: false,
    authToken: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      //
      if (user) {
        saveUserToFirebase(user);
      } else {
        setState({
          loading: false,
          error: null,
          data: null,
          user: null,
          isAuthenticated: false,
          isProfileComplete: false,
          isEmailVerified: false,
          authToken: null,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const checkIfProfileCreated = async (user) => {};

  const saveUserToFirebase = async (user) => {
    const userRef = doc(db, "users", user.uid);
    let firstName = user.displayName?.split(" ")[0];
    let lastName = user.displayName?.split(" ")[1];
    
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      let userData = userDoc.data();


      console.log("USER DATA", userData)
      if (userData.isRepoCompleted == undefined) {
        // Check if all the repos exist
        let educationRef = doc(db, "education", user.uid);
        let experienceRef = doc(db, "experience", user.uid);
        let skillsRef = doc(db, "skill", user.uid);
        let professionalSummaryRef = doc(db, "professionalSummary", user.uid);
        let personalInfoRef = doc(db, "personalInfo", user.uid);

        let items = await Promise.all([
          getDoc(educationRef),
          getDoc(experienceRef),
          getDoc(skillsRef),
          getDoc(professionalSummaryRef),
          getDoc(personalInfoRef),
        ]);

        let isRepoCompleted = true;
        for (let item of items) {
          if (!item.exists()) {
            isRepoCompleted = false;
            break;
          }
        }

        await setDoc(
          userRef,
          {
            isRepoCompleted: isRepoCompleted,
          },
          { merge: true }
        );

        userData.isRepoCompleted = isRepoCompleted;
      }

      let res = window.pendo.initialize({
        visitor: {
          id: userData.firebaseId,
          email: userData.email,
          full_name: userData.firstName + " " + userData.lastName,
        },

        account: {
          id: userData.firebaseId,
          name: userData.firstName + " " + userData.lastName,
          is_paying: false,
        },
      });

      // Set this to a unique identifier for the user performing the event.

      // Mixpanel initialized
      mixpanel.track("USER_LOGGED_IN", {
        distinct_id: userData.firebaseId,
        email: userData.email,
        full_name: userData.firstName + " " + userData.lastName,
      });

      setState({
        loading: false,
        error: null,
        data: userData,
        user: user,
        isAuthenticated: true,
        isProfileComplete: userData.profileComplete,
        isRepoCompleted: userData.isRepoCompleted,
        isEmailVerified: user.emailVerified,
        authToken: null,
      });
      return;
    }

    let userData = {
      firstName: firstName || null,
      lastName: lastName || null,
      username: user.email,
      email: user.email,
      firebaseId: user.uid,
      profileComplete: false,
      isRepoCompleted: false,
      photoURL: user.photoURL,
    }
    await setDoc(userRef, userData);

    setState({
      loading: false,
      error: null,
      data: userData,
      user: user,
      isAuthenticated: true,
      isProfileComplete: false,
      isEmailVerified: user.emailVerified,
      authToken: null,
    });
  };

  const createUserWithEmail = async (
    first_name,
    last_name,
    username,
    password,
    email
  ) => {
    // Sign up user in firebase auth
    try {
      let userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let user = userCred.user;
      await updateProfile(user, { displayName: `${first_name} ${last_name}` });
      // Create a user in the backend
      const userRef = doc(db, "users", user.uid);
      await sendVerificationEmailCustom(user, first_name);
      // Check if user exists in backend
      await setDoc(userRef, {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        firebase_id: user.uid,
        profileComplete: false,
      });
      return {
        error: false,
        message: "User created successfully",
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
        code: err.code,
      };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      let userCred = await signInWithEmailAndPassword(auth, email, password);
      let user = userCred.user;
      await saveUserToFirebase(user);
      return {
        error: false,
        message: "User logged in successfully",
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
        code: err.code,
      };
    }
  };

  const resetPassword = async (newPassword) => {
    await updatePassword(auth.currentUser, newPassword);
  };

  const sendVerificationEmail = async (email) => {
    await sendEmailVerification(auth.currentUser);
  };

  const sendVerificationEmailCustom = async (first_name) => {
    let user = auth.currentUser;
    let token = await user.getIdToken();
    let res = await axios.post(
      `${baseUrl}/send-verification-email`,
      {
        email: user.email,
        name: first_name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res 
  };

  const markProfileCompleted = async () => {
    setState((prev) => ({
      ...prev,
      isProfileComplete: true,
    }));
  };

  const sendResetPasswordEmail = async (email) => {
    // await sendPasswordResetEmail(auth, email);
    let user = auth.currentUser;
    let res = await axios.post(
      `${baseUrl}/unauth/send-reset-password-email`,
      {
        email: email,
      },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const updateUserProfie = (data) => {
    let user = auth.currentUser;
    updateProfile(user, {
      displayName: data.first_name + " " + data.last_name,
      photoURL: data.photoURL,
    });
  };

  const updateProfilePic = async (photoURL) => {
    let docRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      docRef,
      {
        photoURL: photoURL,
      },
      { merge: true }
    );


    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        photoURL: photoURL,
      },
    }));
  };

  const reautheticate = async (password) => {
    let user = auth.currentUser;
    let credential = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credential);
  };

  const signInWithGoogle = async () => {
    try {
      let res = await signInWithPopup(auth, gauthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      let user = res.user;
      await saveUserToFirebase(user);
    } catch (err) {
      return {
        message: err.message,
        code: err.code,
      };
    }
  };

  const overrideCVImport = async (data) => {
    let user = auth.currentUser;
    let userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        isRepoCompleted: true,
      },
      { merge: true }
    );

    // Update state
    // setState((prev) => ({
    //   ...prev,
    //   isRepoCompleted: true,
    // }));
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setState({
        loading: false,
        error: null,
        data: null,
        user: null,
        isAuthenticated: false,
        isProfileComplete: false,
        isEmailVerified: false,
        authToken: null,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // return
  return {
    ...state,
    logout,
    createUserWithEmail,
    loginWithEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendResetPasswordEmail,
    updateUserProfie,
    markProfileCompleted,
    resetPassword,
    reautheticate,
    signInWithGoogle,
    overrideCVImport,
    sendVerificationEmailCustom,
    updateProfilePic
  };
};

export { ProviderAuth, useAuth };

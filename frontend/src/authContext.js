import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "./services/firebase";
import { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
const baseUrl = process.env.REACT_APP_API_URL;

const authContext = createContext();

const ProviderAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((token) => {
          console.log("token", token);
          setAuthToken(token);
        });
        setUser(user);
        saveUserToFirebase(user);
        setIsAuthenticated(true);
        setIsEmailVerified(user.emailVerified);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveUserToFirebase = async (user) => {
    const userRef = doc(db, "users", user.uid);
    let firstName = user.displayName.split(" ")[0];
    let lastName = user.displayName.split(" ")[1];
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      console.log("user exists");
      return;
    }

    await setDoc(userRef, {
      firstName: firstName,
      lastName: lastName,
      username: user.email,
      email: user.email,
      firebaseId: user.uid,
      profileComplete: false,
      photoURL: user.photoURL,
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
      // Check if user exists in backend
      await setDoc(userRef, {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        firebase_id: user.uid,
        profileComplete: false,
      });
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
    } catch (err) {
      return {
        message: err.message,
        code: err.code,
      };
    }
  };

  const sendVerificationEmail = async (email) => {
    await sendEmailVerification(auth.currentUser);
  };

  const sendResetPasswordEmail = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfie = (data) => {
    let user = auth.currentUser;
    updateProfile(user, {
      displayName: data.first_name + " " + data.last_name,
      photoURL: data.photoURL,
    });
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setIsProfileComplete(false);
      setIsEmailVerified(false);
      setAuthToken(null);
    } catch (err) {
      console.log(err);
    }
  };

  // return
  return {
    user,
    loading,
    error,
    isAuthenticated,
    isProfileComplete,
    isEmailVerified,
    authToken,
    logout,
    createUserWithEmail,
    loginWithEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendResetPasswordEmail,
    updateUserProfie,
  };
};

export { ProviderAuth, useAuth };

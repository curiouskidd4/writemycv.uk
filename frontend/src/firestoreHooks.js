import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "./services/firebase";
import { User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  setDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

const useDoc = (collectionName, docId, subscribe) => {
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    error: "",
    loading: true,
  });
  useEffect(() => {
    // const unsubscribe = db
    //   .collection(collectionName)
    //   .doc(docId)
    //   .onSnapshot((doc) => {
    //     setDoc(doc.data());
    //     setLoading(false);
    //   });
    if (subscribe == false) {
      const docRef = doc(db, collectionName, docId);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setState((prevState) => ({
              ...prevState,
              data: { ...doc.data(), id: doc.id },
              loading: false,
            }));
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            error: error,
            loading: false,
          }));
        });
      return;
    }
    const unsubscribe = onSnapshot(doc(db, collectionName, docId), (doc) => {
      // setData({...doc.data(), id: doc.id});
      // setLoading(false);
      setState((prevState) => ({
        ...prevState,
        data: { ...doc.data(), id: doc.id },
        loading: false,
      }));
    });
    return () => unsubscribe();
  }, [docId]);

  return { loading: state.loading, error: state.error, data: state.data };
};

const useCollection = (collectionName, where) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let q = query(collection(db, collectionName), where);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        data.push({ ...doc.data(), id });
      });
      setData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return { data, loading };
};

const useMutateDoc = (collectionName, docId, merge) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (data) => {
    setLoading(true);
    let id = docId;
    // data = JSON.parse(JSON.stringify(data));
    
    try {
      if (docId === "new") {
        // const docRef = await collection(db, collectionName).add(data);
        const docRef = await addDoc(collection(db, collectionName), data);
        id = docRef.id;
      } else {
        await setDoc(doc(db, collectionName, docId), data, { merge });
      }
      setSuccess(true);
    } catch (error) {
      debugger;
      setError(error);
    }
    setLoading(false);
    return id;
  };
  return { mutate, loading, error, success };
};

export { useDoc, useCollection, useMutateDoc };

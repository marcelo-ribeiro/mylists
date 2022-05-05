// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhctVuoxOkFYtxqCFY3bqo1TkKZOHFNLM",
  authDomain: "budget-ba778.firebaseapp.com",
  databaseURL: "https://budget-ba778.firebaseio.com",
  projectId: "budget-ba778",
  storageBucket: "",
  messagingSenderId: "1073164028328",
  appId: "1:1073164028328:web:4d31dd856c4beb2c",
};

export let firestore;
export let storage;
export let analytics;

if (!getApps().length) {
  const firebaseApp = initializeApp(firebaseConfig);

  if (typeof window !== "undefined") {
    analytics = getAnalytics();
    storage = getStorage();
    firestore = getFirestore();
  }
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "realestate-dd4f3.firebaseapp.com",
  projectId: "realestate-dd4f3",
  storageBucket: "realestate-dd4f3.firebasestorage.app",
  messagingSenderId: "765089997161",
  appId: "1:765089997161:web:0be97ea67dd0dc3bb09df8",
  measurementId: "G-P9QSZHK8DK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

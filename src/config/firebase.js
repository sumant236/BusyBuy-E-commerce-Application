// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "busybuy-45dda.firebaseapp.com",
  projectId: "busybuy-45dda",
  storageBucket: "busybuy-45dda.firebasestorage.app",
  messagingSenderId: "512585049947",
  appId: "1:512585049947:web:cbf69b4d738cb0a628dc7e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

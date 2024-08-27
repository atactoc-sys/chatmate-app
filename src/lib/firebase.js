// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfCP-tH7-pZWbGS0l3HSMjHx3sm5Btsh0",
  authDomain: "reactchatmate.firebaseapp.com",
  projectId: "reactchatmate",
  storageBucket: "reactchatmate.appspot.com",
  messagingSenderId: "1059764027201",
  appId: "1:1059764027201:web:7855322cba053a896febc0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

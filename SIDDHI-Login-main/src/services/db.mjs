// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh_QEG9WFAIS08iKX7yPDWvNq6wFMG-vA",
  authDomain: "siddhi-389af.firebaseapp.com",
  projectId: "siddhi-389af",
  storageBucket: "siddhi-389af.appspot.com",
  messagingSenderId: "790027676494",
  appId: "1:790027676494:web:3f55c07cfbab8dd7084c1f",
  measurementId: "G-D5031LKL2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export const getDb = () => db;
export const getAuthInstance = () => auth;

const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
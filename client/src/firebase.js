import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// REPLACE THESE VALUES WITH YOUR OWN FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBszwsN1XcOFB8tXuiqhg5PaDvU-cUHaCI",
  authDomain: "mooddiaryapp-33e19.firebaseapp.com",
  projectId: "mooddiaryapp-33e19",
  storageBucket: "mooddiaryapp-33e19.firebasestorage.app",
  messagingSenderId: "69004927239",
  appId: "1:69004927239:web:af0945f16650cdc894e5a2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
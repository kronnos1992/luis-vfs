import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkdW6P9PFSGKK8pa6P3oRdxWs4K0lTvm8",
  authDomain: "julya-17bb4.firebaseapp.com",
  projectId: "julya-17bb4",
  storageBucket: "julya-17bb4.firebasestorage.app",
  messagingSenderId: "49282323278",
  appId: "1:49282323278:web:c882b24e13e6bfd00ec41f",
  measurementId: "G-JRGBBR6F92"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, collection, getDocs,query, where  };

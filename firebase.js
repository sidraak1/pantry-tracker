// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9WIs430ktXNNeVVHNrjRSUe9GfSzrpq4",
  authDomain: "inventory-management-83451.firebaseapp.com",
  projectId: "inventory-management-83451",
  storageBucket: "inventory-management-83451.appspot.com",
  messagingSenderId: "964560314771",
  appId: "1:964560314771:web:ca72ffffb4bd17678a8866",
  measurementId: "G-7L4QZ1V2G8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
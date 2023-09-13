import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCEFdZhnFDo7a2lwyYgpC09ekCSr5jfb_4",
  authDomain: "sanchos-fit.firebaseapp.com",
  projectId: "sanchos-fit",
  storageBucket: "sanchos-fit.appspot.com",
  messagingSenderId: "904254414585",
  appId: "1:904254414585:web:5545a8afb99716642ecc28",
  databaseURL: "https://sanchos-fit-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
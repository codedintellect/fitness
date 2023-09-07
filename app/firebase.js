import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export var user = auth.currentUser;

onAuthStateChanged(auth, (u) => {
  user = u;
  if (u) {

  }
  else {

  }
  console.log(user);
});

export function login(phone, password) {
  // Since user creation is handled by the website admin, we wish to avoid
  // phone number verification, hence the roundabout way of authentication.
  signInWithEmailAndPassword(auth, `${phone}@example.com`, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

export function logout() {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}


export const database = getDatabase(app);

export const phoneRef = ref(database, 'contact');

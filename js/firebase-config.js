// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIazwoh9hesNYpT5ywc-aX3qnj4UcGhKY",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  databaseURL: "https://jeet365-fabf2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jeet365-fabf2",
  storageBucket: "jeet365-fabf2.firebasestorage.app",
  messagingSenderId: "862480702968",
  appId: "1:862480702968:web:fe41c67573c82cb7ec4a0d",
  measurementId: "G-LZRXW175NR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

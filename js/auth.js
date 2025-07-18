// js/auth.js
import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Login Logic
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        msg.innerText = "Login successful!";
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        msg.innerText = error.message;
      });
  });
}

// Signup Logic
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const msg = document.getElementById("signupMsg");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        msg.innerText = "Signup successful!";
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        msg.innerText = error.message;
      });
  });
}

// Logout Logic (for dashboard later)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "login.html";
    });
  });
  }

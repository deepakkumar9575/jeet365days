// js/dashboard.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM elements
const userEmail = document.getElementById("userEmail");
const userCoins = document.getElementById("userCoins");
const dashMsg = document.getElementById("dashMsg");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmail.innerText = user.email;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time user: set default coins = 100
      await setDoc(userRef, {
        coins: 100
      });
      userCoins.innerText = "100";
    } else {
      userCoins.innerText = userSnap.data().coins;
    }

    // Add Coins button
    document.getElementById("addCoinsBtn").onclick = async () => {
      await addCoinRequest(user.uid, user.email, "add");
    };

    // Withdraw button
    document.getElementById("withdrawCoinsBtn").onclick = async () => {
      await addCoinRequest(user.uid, user.email, "withdraw");
    };

  } else {
    window.location.href = "login.html";
  }
});

// Request System Logic
async function addCoinRequest(uid, email, type) {
  const amount = prompt(`Enter amount to ${type} (₹):`);
  if (!amount || isNaN(amount)) {
    dashMsg.innerText = "Invalid amount!";
    return;
  }

  const requestRef = doc(db, "requests", uid + "_" + Date.now());
  await setDoc(requestRef, {
    uid,
    email,
    type,
    amount: parseInt(amount),
    status: "pending",
    createdAt: new Date()
  });

  dashMsg.innerText = `Request to ${type} ₹${amount} submitted!`;
}

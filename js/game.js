// js/game.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const coinDisplay = document.getElementById("coinDisplay");
const resultMsg = document.getElementById("resultMsg");
let currentUser;
let userRef;
let userCoins = 0;

// Load user and coins
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      userCoins = docSnap.data().coins || 0;
      coinDisplay.innerText = userCoins;
    }
  } else {
    window.location.href = "login.html";
  }
});

// Game Logic
document.querySelectorAll(".colorBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const bet = parseInt(document.getElementById("betAmount").value);
    const choice = btn.getAttribute("data-color");

    if (isNaN(bet) || bet < 10) {
      resultMsg.innerText = "Minimum bet is 10 coins.";
      return;
    }

    if (bet > userCoins) {
      resultMsg.innerText = "You don't have enough coins.";
      return;
    }

    // 80% win logic
    const winChance = Math.random() < 0.8;
    const winningColor = winChance ? choice : getRandomColorExcept(choice);

    if (choice === winningColor) {
      userCoins += bet;
      resultMsg.innerText = `🎉 You won! Winning color: ${winningColor}`;
    } else {
      userCoins -= bet;
      resultMsg.innerText = `😢 You lost! Winning color was: ${winningColor}`;
    }

    await updateDoc(userRef, { coins: userCoins });
    coinDisplay.innerText = userCoins;
  });
});

function getRandomColorExcept(except) {
  const colors = ["Red", "Green", "Blue"].filter(c => c !== except);
  return colors[Math.floor(Math.random() * colors.length)];
}

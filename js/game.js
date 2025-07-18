// game.js
import { auth, db } from "./js/firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser;
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    startNewRound(); // Start when user is authenticated
  }
});

let roundTime = 50; // 50 seconds round
let timerInterval;
let roundActive = false;

function startNewRound() {
  roundActive = true;
  let timeLeft = roundTime;
  document.getElementById("timer").innerText = `Next result in: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `Next result in: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

let selectedColor = "";
document.getElementById("red").addEventListener("click", () => placeBet("Red"));
document.getElementById("green").addEventListener("click", () => placeBet("Green"));
document.getElementById("violet").addEventListener("click", () => placeBet("Violet"));

function placeBet(color) {
  if (!roundActive) {
    alert("Wait for the next round to start!");
    return;
  }

  selectedColor = color;
  document.getElementById("status").innerText = `You bet on: ${color}`;
  roundActive = false; // Prevent multiple bets
}

function showResult() {
  const colors = ["Red", "Green", "Violet"];
  const resultColor = colors[Math.floor(Math.random() * 3)];

  const resultEl = document.getElementById("result");
  resultEl.innerText = `Result: ${resultColor}`;

  if (selectedColor === resultColor) {
    updateCoins(10); // Win: Add 10 coins
    document.getElementById("status").innerText = `✅ You Won! +10 Coins`;
  } else {
    updateCoins(-10); // Lose: Deduct 10 coins
    document.getElementById("status").innerText = `❌ You Lost! -10 Coins`;
  }

  selectedColor = "";
  setTimeout(() => {
    startNewRound();
  }, 3000); // Wait 3 seconds before next round
}

async function updateCoins(amount) {
  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);
  const currentCoins = userSnap.data().coins || 0;
  const newCoins = currentCoins + amount;

  await updateDoc(userRef, { coins: newCoins });

  document.getElementById("coins").innerText = `Coins: ${newCoins}`;
}

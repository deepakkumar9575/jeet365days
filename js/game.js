import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAIazwoh9hesNYpT5ywc-aX3qnj4UcGhKY",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  projectId: "jeet365-fabf2",
  storageBucket: "jeet365-fabf2.appspot.com",
  messagingSenderId: "862480702968",
  appId: "1:862480702968:web:fe41c67573c82cb7ec4a0d",
  measurementId: "G-LZRXW175NR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userCoins = 0;
let currentUser = null;
let timer;
let countdown = 50;
let isBetPlaced = false;

const coinsEl = document.getElementById("coins");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const betInput = document.getElementById("betAmount");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    userCoins = userSnap.data().coins || 0;
    coinsEl.innerText = `Coins: ${userCoins}`;
    startTimer();
  } else {
    alert("Please log in first");
    window.location.href = "login.html";
  }
});

function updateCoins(newAmount) {
  userCoins = newAmount;
  coinsEl.innerText = `Coins: ${userCoins}`;
  const userRef = doc(db, "users", currentUser.uid);
  updateDoc(userRef, { coins: newAmount });
}

function startTimer() {
  countdown = 50;
  isBetPlaced = false;
  resultEl.innerText = "";
  statusEl.innerText = "⏳ Place your bet!";
  timerEl.innerText = `Time Left: ${countdown}s`;

  clearInterval(timer);
  timer = setInterval(() => {
    countdown--;
    timerEl.innerText = `Time Left: ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(timer);
      if (!isBetPlaced) {
        statusEl.innerText = "❌ Round ended. You missed the chance!";
        resultEl.innerText = "";
      } else {
        statusEl.innerText = "✅ Round complete. Start next bet.";
      }
      setTimeout(startTimer, 3000);
    }
  }, 1000);
}

window.placeBet = function (selectedColor) {
  const betAmount = parseInt(betInput.value);

  if (countdown <= 0) {
    alert("⏱️ Round over! Wait for next round.");
    return;
  }

  if (isBetPlaced) {
    alert("Bet already placed this round.");
    return;
  }

  if (isNaN(betAmount) || betAmount < 10) {
    alert("Minimum bet is 10 coins.");
    return;
  }

  if (betAmount > userCoins) {
    alert("Not enough coins.");
    return;
  }

  isBetPlaced = true;

  // Immediately deduct coins
  updateCoins(userCoins - betAmount);
  statusEl.innerText = `✅ Bet placed on ${selectedColor.toUpperCase()}`;

  // Determine result after countdown ends
  setTimeout(() => {
    const isWin = Math.random() < 0.2;
    const colors = ["green", "red", "violet"];
    const winningColor = isWin
      ? selectedColor
      : colors.filter((c) => c !== selectedColor)[Math.floor(Math.random() * 2)];

    const won = winningColor === selectedColor;
    const winnings = won ? betAmount * 2 : 0;
    resultEl.innerText = won
      ? `🎉 You won ${winnings} coins!`
      : `😢 You lost ${betAmount} coins`;
    updateCoins(userCoins + winnings);
    statusEl.innerText = `🏁 Result: ${winningColor.toUpperCase()}`;

    // Round auto-restarts in 3 sec
    setTimeout(startTimer, 3000);
  }, countdown * 1000);
};

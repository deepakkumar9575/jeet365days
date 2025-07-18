import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIazwoh9hesNYpT5ywc-aX3qnj4UcGhKY",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  databaseURL: "https://jeet365-fabf2-default-rtdb.asia-southeast1.firebasedatabase.app",
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

const coinsEl = document.getElementById("coins");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");

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
  timerEl.innerText = `Time Left: ${countdown}s`;
  clearInterval(timer);
  timer = setInterval(() => {
    countdown--;
    timerEl.innerText = `Time Left: ${countdown}s`;
    if (countdown <= 0) {
      clearInterval(timer);
      statusEl.innerText = "⏳ Round ended. Start new bet.";
    }
  }, 1000);
}

window.placeBet = function (selectedColor) {
  const betAmount = parseInt(document.getElementById("betAmount").value);

  if (isNaN(betAmount) || betAmount < 10) {
    alert("Minimum bet is 10 coins.");
    return;
  }

  if (betAmount > userCoins) {
    alert("Not enough coins.");
    return;
  }

  // 80% chance to lose
  const isWin = Math.random() < 0.2;
  const colors = ["green", "red", "violet"];
  const winningColor = isWin ? selectedColor : colors.filter(c => c !== selectedColor)[Math.floor(Math.random() * 2)];

  statusEl.innerText = `Result is ${winningColor.toUpperCase()}`;
  resultEl.innerText = isWin ? `🎉 You won ${betAmount} coins!` : `😢 You lost ${betAmount} coins`;

  updateCoins(userCoins + (isWin ? betAmount : -betAmount));
  startTimer();
};

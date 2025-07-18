import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIazwoh9hesNYpT5ywc-aX3qnj4UcGhKY",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  projectId: "jeet365-fabf2",
  storageBucket: "jeet365-fabf2.appspot.com",
  messagingSenderId: "862480702968",
  appId: "1:862480702968:web:fe41c67573c82cb7ec4a0d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userCoins = 0;
let coinsEl = document.getElementById("coins");
let resultEl = document.getElementById("result");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    userCoins = docSnap.data().coins || 0;
    coinsEl.innerText = `Coins: ${userCoins}`;
  }
});

window.playNumberGame = async function () {
  const guess = parseInt(document.getElementById("guessInput").value);
  const minBet = 10;

  if (guess < 1 || guess > 10) {
    resultEl.innerText = "❌ Enter number between 1 and 10.";
    return;
  }

  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);
  userCoins = docSnap.data().coins || 0;

  if (userCoins < minBet) {
    resultEl.innerText = "❌ Not enough coins!";
    return;
  }

  // Deduct coins
  await updateDoc(docRef, { coins: userCoins - minBet });
  userCoins -= minBet;
  coinsEl.innerText = `Coins: ${userCoins}`;

  const correctNumber = Math.floor(Math.random() * 10) + 1;
  const isWin = guess === correctNumber;

  if (isWin) {
    const reward = 50;
    await updateDoc(docRef, { coins: userCoins + reward });
    userCoins += reward;
    coinsEl.innerText = `Coins: ${userCoins}`;
    resultEl.innerText = `🎉 Correct! You won ${reward} coins. Number was ${correctNumber}.`;
  } else {
    resultEl.innerText = `😢 Wrong! Number was ${correctNumber}.`;
  }
}

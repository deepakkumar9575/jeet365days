import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIazwoh9hesNYpT5ywc-aX3qnj4UcGhKY",
  authDomain: "jeet365-fabf2.firebaseapp.com",
  projectId: "jeet365-fabf2",
  storageBucket: "jeet365-fabf2.appspot.com",
  messagingSenderId: "862480702968",
  appId: "1:862480702968:web:fe41c67573c82cb7ec4a0d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leaderboardList = document.getElementById("leaderboardList");

async function showLeaderboard() {
  const querySnapshot = await getDocs(collection(db, "users"));
  let players = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    players.push({ name: data.name || data.email, coins: data.coins || 0 });
  });

  players.sort((a, b) => b.coins - a.coins);

  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}. ${player.name} — ${player.coins} Coins`;
    leaderboardList.appendChild(li);
  });
}

showLeaderboard();

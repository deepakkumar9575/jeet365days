// js/admin.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const requestList = document.getElementById("requestList");

onAuthStateChanged(auth, async (user) => {
  if (user && user.email === "admin@jeet365.com") {
    loadRequests();
  } else {
    alert("Admin access only.");
    window.location.href = "login.html";
  }
});

async function loadRequests() {
  const querySnapshot = await getDocs(collection(db, "requests"));
  requestList.innerHTML = "";

  querySnapshot.forEach(async (docSnap) => {
    const request = docSnap.data();

    // Ignore already handled
    if (request.status === "approved" || request.status === "rejected") return;

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Type:</strong> ${request.type}</p>
      <p><strong>Amount:</strong> ${request.amount}</p>
      <p><strong>UPI:</strong> ${request.upi || "N/A"}</p>
      <p><strong>Status:</strong> ${request.status || "Pending"}</p>
      ${
        request.screenshotUrl
          ? `<p><img src="${request.screenshotUrl}" alt="Screenshot" width="100"/></p>`
          : ""
      }
      <button class="btn" onclick="handleRequest('${docSnap.id}', '${request.email}', ${request.amount}, '${request.type}', true)">✅ Approve</button>
      <button class="btn" onclick="handleRequest('${docSnap.id}', '${request.email}', ${request.amount}, '${request.type}', false)">❌ Reject</button>
    `;
    requestList.appendChild(div);
  });
}

// Approve or Reject Request
window.handleRequest = async (docId, email, amount, type, approve) => {
  const reqRef = doc(db, "requests", docId);
  const userDoc = doc(db, "users", email);
  const userSnap = await getDoc(userDoc);

  if (!userSnap.exists()) {
    alert("User not found");
    return;
  }

  const currentCoins = userSnap.data().coins || 0;

  if (approve) {
    const newCoins =
      type === "add" ? currentCoins + amount : currentCoins - amount;
    await updateDoc(userDoc, { coins: newCoins });
    await updateDoc(reqRef, { status: "approved" });
  } else {
    await updateDoc(reqRef, { status: "rejected" });
  }

  alert(`Request ${approve ? "approved" : "rejected"}`);
  location.reload();
};

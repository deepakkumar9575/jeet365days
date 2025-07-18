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
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const requestList = document.getElementById("requestList");

// 🔐 Allow only specific admin email
const allowedAdmin = "dp7814616@gmail.com"; // ← Change to your email

onAuthStateChanged(auth, async (user) => {
  if (user && user.email === allowedAdmin) {
    loadRequests();
  } else {
    alert("Access Denied! Not an admin.");
    window.location.href = "login.html";
  }
});

async function loadRequests() {
  requestList.innerHTML = "<h3>Pending Requests</h3>";
  const querySnapshot = await getDocs(collection(db, "requests"));

  if (querySnapshot.empty) {
    requestList.innerHTML += "<p>No pending requests.</p>";
    return;
  }

  querySnapshot.forEach(async (docSnap) => {
    const request = docSnap.data();
    const id = docSnap.id;
    const reqEl = document.createElement("div");
    reqEl.classList.add("request-card");

    reqEl.innerHTML = `
      <p><strong>User:</strong> ${request.email}</p>
      <p><strong>Type:</strong> ${request.type}</p>
      <p><strong>Amount:</strong> ${request.amount}</p>
      <button class="btn green" onclick="handleRequest('${id}', 'approve')">✅ Approve</button>
      <button class="btn red" onclick="handleRequest('${id}', 'reject')">❌ Reject</button>
      <hr/>
    `;
    requestList.appendChild(reqEl);
  });
}

// ✅ Approve/Reject logic
window.handleRequest = async (id, action) => {
  const requestRef = doc(db, "requests", id);
  const reqSnap = await getDoc(requestRef);

  if (!reqSnap.exists()) return;

  const request = reqSnap.data();
  const userQuery = await getDocs(collection(db, "users"));
  let userDoc;

  userQuery.forEach((docSnap) => {
    if (docSnap.data().email === request.email) {
      userDoc = docSnap;
    }
  });

  if (!userDoc) return;

  const userRef = doc(db, "users", userDoc.id);
  let coins = userDoc.data().coins || 0;

  if (action === "approve") {
    coins = request.type === "add" ? coins + request.amount : coins - request.amount;
    if (coins < 0) coins = 0;

    await updateDoc(userRef, { coins });
    await deleteDoc(requestRef);
    alert("✅ Request approved.");
  } else {
    await deleteDoc(requestRef);
    alert("❌ Request rejected.");
  }

  location.reload();
};

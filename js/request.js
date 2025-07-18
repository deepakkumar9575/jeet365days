// js/request.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  addDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const requestForm = document.getElementById("requestForm");
let currentUserEmail = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
});

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = parseInt(document.getElementById("amount").value);

  if (amount < 10) {
    alert("Minimum amount is 10 coins.");
    return;
  }

  try {
    await addDoc(collection(db, "requests"), {
      email: currentUserEmail,
      type: type,
      amount: amount
    });

    alert("✅ Request submitted successfully!");
    requestForm.reset();
  } catch (error) {
    alert("❌ Failed to submit request.");
    console.error(error);
  }
});

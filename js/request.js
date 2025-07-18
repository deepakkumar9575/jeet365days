// js/request.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUserEmail = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    alert("Please log in.");
    window.location.href = "login.html";
  }
});

document.getElementById("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const amount = parseInt(document.getElementById("amount").value);
  const upi = document.getElementById("upi").value;
  const screenshotInput = document.getElementById("screenshot");
  const screenshotFile = screenshotInput.files[0];

  if (amount < 10 || !upi) {
    alert("Please enter valid details.");
    return;
  }

  let screenshotURL = "";

  // Optional: Upload image to Firebase Storage
  if (screenshotFile) {
    const storageRef = firebase.storage().ref(`screenshots/${Date.now()}_${screenshotFile.name}`);
    await storageRef.put(screenshotFile);
    screenshotURL = await storageRef.getDownloadURL();
  }

  try {
    await addDoc(collection(db, "requests"), {
      email: currentUserEmail,
      type,
      amount,
      upi,
      screenshotURL,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("✅ Request submitted!");
    document.getElementById("requestForm").reset();
  } catch (error) {
    alert("❌ Error submitting request.");
    console.error(error);
  }
});

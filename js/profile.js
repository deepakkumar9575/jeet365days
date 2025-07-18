// js/profile.js
import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const requestList = document.getElementById("requestList");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "requests"), where("email", "==", user.email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      requestList.innerHTML = "<li>No requests found.</li>";
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        requestList.innerHTML += `
          <li>
            <strong>${data.type.toUpperCase()}</strong> - ₹${data.amount} <br/>
            UPI: ${data.upi} <br/>
            Status: <b>${data.status}</b> <br/>
            ${data.screenshotURL ? `<a href="${data.screenshotURL}" target="_blank">📷 View Screenshot</a>` : ""}
            <hr/>
          </li>
        `;
      });
    }
  } else {
    alert("Please log in.");
    window.location.href = "login.html";
  }
});

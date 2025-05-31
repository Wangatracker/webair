
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}
window.toggleSidebar = toggleSidebar;

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
  toggleSidebar();
}
window.showSection = showSection;

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      document.getElementById("username").textContent = data.username || data.email;
      document.getElementById("user-username").textContent = data.username || "N/A";
    }
  } else {
    window.location.href = "../login.html";
  }
});

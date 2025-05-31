// Import Firebase SDK
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Sidebar toggle
const hamburger = document.querySelector(".hamburger");
const sidebar = document.querySelector(".sidebar");

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

// Auth state listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const username = data.username || data.email;

      document.getElementById("username").textContent = username;
      document.getElementById("notif").textContent = `Welcome back, ${username}! 🎉`;

      startWelcomeMessages(username);
      showDidYouKnow();
    }
  } else {
    window.location.href = "../login.html";
  }
});

// Welcome message rotation
function startWelcomeMessages(username) {
  const messages = [
    `Welcome ${username}! 🎓`,
    "Manage your career and talent 💼",
    "Stay on top of your schedule 📅",
    "Grow with Edu Sync Hub Africa 🌍",
    "Let's make your dreams real! 🚀"
  ];

  let index = 0;
  const notif = document.getElementById("notif");

  setInterval(() => {
    notif.textContent = messages[index];
    index = (index + 1) % messages.length;
  }, 7000); // Rotate every 7 seconds
}

// "Did You Know" simulation
function showDidYouKnow() {
  const facts = [
    "Did you know? The brain uses 20% of your body’s energy!",
    "Fact: Kenya’s exams are coordinated from the KNEC headquarters.",
    "Tip: Studying 25 minutes followed by a 5-minute break boosts memory.",
    "Did you know? Coding is one of the top 5 most demanded skills.",
    "Fact: A great career starts with consistent daily effort."
  ];

  const factBox = document.getElementById("fact");
  let index = 0;

  setInterval(() => {
    factBox.textContent = facts[index];
    index = (index + 1) % facts.length;
  }, 10000); // Rotate every 10 seconds
}

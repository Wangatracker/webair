
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.firebasestorage.app",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

document.getElementById('agent-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('agent-email').value;
  const password = document.getElementById('agent-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .catch(() => createUserWithEmailAndPassword(auth, email, password))
    .then(() => alert('Logged in as Agent!'));
});

document.getElementById('promoter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('promoter-email').value;
  const password = document.getElementById('promoter-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .catch(() => createUserWithEmailAndPassword(auth, email, password))
    .then(() => alert('Logged in as Promoter!'));
});

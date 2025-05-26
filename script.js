// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

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

// Toggle between Sign-Up and Login
function showSignup() {
  document.getElementById('signup').style.display = 'block';
  document.getElementById('login').style.display = 'none';
}

function showLogin() {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('login').style.display = 'block';
}

// Sign Up Function
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      window.location.href = 'dashboard.html';  // Redirect to dashboard after sign up
    })
    .catch((error) => {
      alert(error.message);  // Display error if any
    });
});

// Login Function
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      window.location.href = 'dashboard.html';  // Redirect to dashboard after login
    })
    .catch((error) => {
      alert(error.message);  // Display error if any
    });
});

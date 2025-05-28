
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.appspot.com",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signUp = () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Signup successful!"))
    .catch(error => alert(error.message));
};

window.login = () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('dashboard').classList.remove('hidden');
      document.getElementById('welcome-msg').innerText = `Welcome User ${Math.floor(Math.random() * 1000)}`;
    })
    .catch(error => alert(error.message));
};

window.showSection = (id) => {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
};

window.accessAdmin = () => {
  const key = document.getElementById('admin-key').value;
  if (key === '661862') {
    document.getElementById('admin-panel').classList.remove('hidden');
  } else {
    alert('Incorrect passkey');
  }
};

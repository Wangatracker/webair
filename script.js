const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.appspot.com",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function showStatus(message, isError = false) {
  const msg = document.getElementById('status-message');
  msg.textContent = message;
  msg.style.color = isError ? 'red' : 'green';
}

function showForm(form) {
  document.getElementById('signup-form').style.display = form === 'signup' ? 'block' : 'none';
  document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
  showStatus('');
}

async function signUp() {
  const name = document.getElementById('signup-name').value;
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const phone = document.getElementById('signup-phone').value;
  const country = document.getElementById('signup-country').value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection('agents').doc(user.uid).set({
      uid: user.uid,
      name,
      username,
      email,
      phone,
      country,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showStatus("Signed up successfully! Redirecting...");
    setTimeout(() => window.location.href = "dashboard.html", 1500);
  } catch (error) {
    showStatus("Sign up failed: " + error.message, true);
  }
}

async function logIn() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showStatus("Logged in! Redirecting...");
    setTimeout(() => window.location.href = "dashboard.html", 1500);
  } catch (error) {
    showStatus("Login failed: " + error.message, true);
  }
}

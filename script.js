// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.appspot.com",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// UI Elements
const statusMsg = document.getElementById("status-message");

// Show status
function showStatus(msg, isError = false) {
  statusMsg.textContent = msg;
  statusMsg.style.color = isError ? "red" : "green";
}

// Save user to Firestore
async function saveUserData(user, extra) {
  try {
    await db.collection("agents").doc(user.uid).set({
      uid: user.uid,
      email: user.email || null,
      phone: user.phoneNumber || null,
      method: user.providerData[0].providerId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      ...extra
    }, { merge: true });
    showStatus("Signup complete.");
  } catch (err) {
    showStatus("Error saving user data", true);
    console.error(err);
  }
}

// Email Sign Up
document.getElementById("signup-email-button").addEventListener("click", async () => {
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  const country = document.getElementById("agent-country").value;
  const detail = document.getElementById("agent-detail").value;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await saveUserData(cred.user, { country, detail });
  } catch (err) {
    showStatus(err.message, true);
  }
});

// Google Sign In
document.getElementById("signin-google-button").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    await saveUserData(result.user, {}); // Add more data later if needed
  } catch (err) {
    showStatus(err.message, true);
  }
});

// reCAPTCHA setup
let recaptchaVerifier;
let confirmationResult;

window.onload = function () {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
    size: "normal",
    callback: () => showStatus("reCAPTCHA verified"),
    "expired-callback": () => showStatus("reCAPTCHA expired", true)
  });
  recaptchaVerifier.render();
};

// Send Code
document.getElementById("send-code-button").addEventListener("click", async () => {
  const phoneNumber = document.getElementById("phone-input").value;
  try {
    confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
    showStatus("Code sent!");
    document.getElementById("verification-code").style.display = "block";
    document.getElementById("verify-code-button").style.display = "block";
  } catch (err) {
    showStatus(err.message, true);
  }
});

// Verify Code
document.getElementById("verify-code-button").addEventListener("click", async () => {
  const code = document.getElementById("verification-code").value;
  try {
    const result = await confirmationResult.confirm(code);
    showStatus("Phone verified! Fill in extra details.");
    document.getElementById("phone-extra-fields").style.display = "block";
  } catch (err) {
    showStatus("Verification failed", true);
  }
});

// Complete Phone Signup
document.getElementById("complete-phone-signup-button").addEventListener("click", async () => {
  const user = auth.currentUser;
  const country = document.getElementById("agent-country-phone").value;
  const detail = document.getElementById("agent-detail-phone").value;
  await saveUserData(user, { country, detail });
});

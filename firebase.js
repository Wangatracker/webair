// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.firebasestorage.app",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J" // Optional Analytics ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Auth and Firestore instances
const auth = firebase.auth();
const db = firebase.firestore(); // Get Firestore instance

// --- Get UI Elements from index.html ---
const authUiDiv = document.getElementById('auth-ui');
const statusMessageEl = document.getElementById('status-message');

// Email/Password elements
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signupEmailButton = document.getElementById('signup-email-button');
const signinEmailButton = document.getElementById('signin-email-button');
const emailErrorMessage = document.getElementById('email-error-message');
const signupExtraFieldsDiv = document.getElementById('signup-extra-fields'); // Div for extra fields on email signup
const agentPhoneSignupInput = document.getElementById('agent-phone-signup');
const agentCountrySignupInput = document.getElementById('agent-country-signup');
const agentExtraField1SignupInput = document.getElementById('agent-extra-field1');


// Google elements (just the button)
const signinGoogleButton = document.getElementById('signin-google-button');

// Phone Number elements
const phoneNumberInput = document.getElementById('phone-input');
const sendCodeButton = document.getElementById('send-code-button');
const verificationCodeInput = document.getElementById('verification-code-input');
const verifyCodeButton = document.getElementById('verify-code-button');
const phoneErrorMessage = document.getElementById('phone-error-message');
const recaptchaContainer = document.getElementById('recaptcha-container');
const signupExtraFieldsPhoneDiv = document.getElementById('signup-extra-fields-phone'); // Div for extra fields on phone signup
const agentCountrySignupPhoneInput = document.getElementById('agent-country-signup-phone');
const agentExtraField1SignupPhoneInput = document.getElementById('agent-extra-field1-phone');


let confirmationResult; // To store the result after sending the phone code
let recaptchaVerifier; // To store the reCAPTCHA verifier instance


// --- Functions ---

// Function to show a status message
function showStatus(message, isError = false) {
    statusMessageEl.textContent = message;
    statusMessageEl.style.color = isError ? 'red' : 'green';
}

// Function to save extra user data to Firestore
async function saveUserData(user, extraData) {
    try {
        const userRef = db.collection('agents').doc(user.uid); // Use user UID as document ID
        await userRef.set({
            uid: user.uid,
            email: user.email || null, // Save email if available
            phoneNumber: user.phoneNumber || null, // Save phone if available
            signupMethod: user.providerData[0].providerId, // e.g., "password", "google.com", "phone"
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...extraData // Add the extra fields collected
        }, { merge: true }); // Use merge: true to update if the document already exists
        console.log("User data saved/updated for UID:", user.uid);
    } catch (error) {
        console.error("Error saving user data:", error);
        showStatus("Error saving user data.", true);
    }
}


// --- Authentication State Listener ---
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in. Redirect to dashboard.
    console.log("User is signed in:", user.uid);
    // Redirect only if we are on the index page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        showStatus("Signed in. Redirecting to dashboard...");
        window.location.assign('/dashboard.html'); // Redirect to your dashboard page
    }

  } else {
    // User is signed out. Ensure we are on the index page and show auth UI.
    console.log("User is signed out.");
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        authUiDiv.style.display = 'block';
        showStatus(''); // Clear status message

        // Reset and re-render reCAPTCHA if it exists (needed for phone

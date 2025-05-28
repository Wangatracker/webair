// --- Firebase Initialization ---
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

// Initialize Firebase using the compat/v9 syntax from your HTML
firebase.initializeApp(firebaseConfig);

// Get Auth and Firestore instances using compat/v9 syntax
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
const signupExtraFieldsDiv = document.getElementById('signup-extra-fields'); // Div for extra fields on email/google signup
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
const recaptchaContainer = document.getElementById('recaptcha-container'); // The div for reCAPTCHA
const signupExtraFieldsPhoneDiv = document.getElementById('signup-extra-fields-phone'); // Div for extra fields on phone signup AFTER verification
const agentCountrySignupPhoneInput = document.getElementById('agent-country-signup-phone');
const agentExtraField1SignupPhoneInput = document.getElementById('agent-extra-field1-phone');
const completePhoneSignupButton = document.getElementById('complete-phone-signup-button'); // Button to finalize phone signup


// --- Global Variables ---
let confirmationResult; // To store the result after sending the phone code
let recaptchaVerifier; // To store the reCAPTCHA verifier instance

// --- Helper Functions ---

// Function to show a status message
function showStatus(message, isError = false) {
    statusMessageEl.textContent = message;
    statusMessageEl.style.color = isError ? 'red' : 'green';
    console.log("STATUS:", message); // Log for debugging
}

// Function to clear all error messages
function clearErrors() {
    emailErrorMessage.textContent = '';
    phoneErrorMessage.textContent = '';
    statusMessageEl.textContent = '';
}

// Function to save extra user data to Firestore (Uses the function you already had!)
async function saveUserData(user, extraData) {
    try {
        const userRef = db.collection('agents').doc(user.uid); // Use user UID as document ID
        await userRef.set({
            uid: user.uid,
            email: user.email || null, // Save email if available
            phoneNumber: user.phoneNumber || null, // Save phone if available
            signupMethod: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'unknown', // Get method
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...extraData // Add the extra fields collected
        }, { merge: true }); // Use merge: true to update if the document already exists
        console.log("User data saved/updated for UID:", user.uid);
    } catch (error) {
        console.error("Error saving user data:", error);
        showStatus("Error saving user data.", true);
    }
}

// Function to reset the Phone Auth UI
function resetPhoneAuthUI() {
    phoneNumberInput.value = '';
    verificationCodeInput.value = '';
    verificationCodeInput.style.display = 'none';
    verifyCodeButton.style.display = 'none';
    signupExtraFieldsPhoneDiv.style.display = 'none';
    completePhoneSignupButton.style.display = 'none';
    sendCodeButton.style.display = 'inline-block'; // Show send code button again
    // Reset extra fields for phone signup
    agentCountrySignupPhoneInput.value = '';
    agentExtraField1SignupPhoneInput.value = '';

    // Explicitly destroy the reCAPTCHA widget if it exists
    if (recaptchaVerifier && recaptchaVerifier.clear) {
         recaptchaVerifier.clear();
         console.log("reCAPTCHA widget cleared.");
    }
     // Re-initialize reCAPTCHA on the next needed interaction (Send Code click)
     // We'll handle re-initialization within the sendCodeButton event listener.
}


// --- Authentication State Listener ---
// This listener redirects the user if they are already signed in
auth.onAuthStateChanged((user) => {
  clearErrors(); // Clear errors on auth state change
  if (user) {
    // User is signed in. Redirect to dashboard.
    console.log("User is signed in:", user.uid);
    // Only redirect if we are currently on the index page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        showStatus("Signed in. Redirecting to dashboard...");
        // Use a small delay to show the message before redirecting
        setTimeout(() => {
            window.location.assign('/dashboard.html'); // Redirect to your dashboard page
        }, 1000); // 1 second delay
    }

  } else {
    // User is signed out. Ensure we are on the index page and show auth UI.
    console.log("User is signed out.");
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        authUiDiv.style.display = 'block'; // Show the main auth UI div
        showStatus(''); // Clear status message
        // Reset phone auth UI and potentially re-initialize reCAPTCHA if needed
        resetPhoneAuthUI(); // Reset phone flow state
        // Re-initialization of reCAPTCHA now happens on click for reliability
    }
  }
});


// --- Email/Password Sign Up ---
signupEmailButton.addEventListener('click', async () => {
    clearErrors();
    const email = emailInput.value;
    const password = passwordInput.value;
    const agentPhone = agentPhoneSignupInput.value;
    const agentCountry = agentCountrySignupInput.value;
    const agentExtraField1 = agentExtraField1SignupInput.value;

    if (!email || !password) {
        emailErrorMessage.textContent = "Please enter both email and password.";
        return;
    }

    showStatus("Signing up...");
    try {
        // Create the user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

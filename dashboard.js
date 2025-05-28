// dashboard.js

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

// --- Get UI Elements from dashboard.html ---
const dashboardContentDiv = document.getElementById('dashboard-content');
const userInfoDiv = document.getElementById('user-info');
const signOutButton = document.getElementById('sign-out-button');

// --- Authentication State Listener for Dashboard ---
// This listener runs whenever the auth state changes, including when the page loads
auth.onAuthStateChanged(async (user) => { // Added 'async' here to use await for Firestore fetch
  if (user) {
    // User is signed in. Display dashboard content.
    console.log("User is signed in on dashboard:", user.uid);

    // Display basic user info
    let userInfoHtml = `
        <p><strong>Welcome, Agent!</strong></p>
        <p><strong>UID:</strong> ${user.uid}</p>
    `;

    // Display provider-specific info
    if (user.email) {
        userInfoHtml += `<p><strong>Email:</strong> ${user.email} (${user.emailVerified ? 'Verified' : 'Not Verified'})</p>`;
    }
    if (user.phoneNumber) {
         userInfoHtml += `<p><strong>Phone Number:</strong> ${user.phoneNumber}</p>`;
    }

    // --- Fetch and display extra agent data from Firestore ---
    try {
        const agentDoc = await db.collection('agents').doc(user.uid).get();
        if (agentDoc.exists) {
            const agentData = agentDoc.data();
            console.log("Fetched agent data from Firestore:", agentData);
            userInfoHtml += `<p><strong>Signup Method:</strong> ${agentData.signupMethod || 'N/A'}</p>`;
            if (agentData.agentPhone) { // Check if the field exists
                 // Phone number is already displayed if available from user.phoneNumber,
                 // but this ensures we show the one saved during email/google signup too.
                 // You might want to handle potential duplicates or display preference.
                 if (!user.phoneNumber || user.phoneNumber !== agentData.agentPhone) {
                     userInfoHtml += `<p><strong>Agent Phone (Saved):</strong> ${agentData.agentPhone}</p>`;
                 }
            }
            if (agentData.agentCountry) { // Check if the field exists
                 userInfoHtml += `<p><strong>Country/County:</strong> ${agentData.agentCountry}</p>`;
            }
             if (agentData.agentExtraField1) { // Check if the field exists
                 userInfoHtml += `<p><strong>Another Detail:</strong> ${agentData.agentExtraField1}</p>`;
            }
            // Add checks for any other fields you added
        } else {
            console.log("No extra agent data found in Firestore for UID:", user.uid);
            userInfoHtml += "<p>No additional agent profile data found.</p>";
             // You might want to redirect them to a profile completion page here
        }
    } catch (error) {
        console.error("Error fetching agent data from Firestore:", error);
        userInfoHtml += "<p style='color: red;'>Error loading additional profile data.</p>";
    }


    userInfoDiv.innerHTML = userInfoHtml;
    dashboardContentDiv.style.display = 'block'; // Show the dashboard content
    console.log("Dashboard loaded for user:", user.uid);


  } else {
    // User is signed out. Redirect to the login page.
    console.log("User is signed out on dashboard. Redirecting to index.html");
    window.location.assign('/index.html'); // Redirect back to your login page
  }
});

// --- Sign Out Functionality ---
signOutButton.addEventListener('click', () => {
  auth.signOut().then(() => {
    // Sign-out successful. The onAuthStateChanged listener above will handle the redirect.
    console.log("User initiated sign out.");
  }).catch((error) => {
    // An error happened.
    console.error("Sign out error:", error);
    // Optionally display an error message on the dashboard
    const errorEl = document.createElement('p');
    errorEl.style.color = 'red';
    errorEl.textContent = `Sign out failed: ${error.message}`;
    dashboardContentDiv.appendChild(errorEl);
  });
});

// Initial check (onAuthStateChanged handles this, but adding here clarifies intent)
// If the user object is immediately available (e.g., from session persistence), the listener fires right away.
// If not, the listener will redirect.

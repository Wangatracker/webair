import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// =========================
// 🚀 Signup Function
// =========================
export async function signUp(email, password, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
      isPaid: false,
      createdAt: new Date(),
    });

    redirectToDashboard(role);
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
}

// =========================
// 🔑 Login Function
// =========================
export async function logIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      redirectToDashboard(role);
    } else {
      alert("User data not found in Firestore.");
    }
  } catch (error) {
    alert("Login Error: " + error.message);
  }
}

// =========================
// 🔁 Redirect by Role
// =========================
export function redirectToDashboard(role) {
  if (role === "student") {
    window.location.href = "pages/student-dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "pages/teacher-dashboard.html";
  } else if (role === "admin") {
    window.location.href = "pages/admin-dashboard.html";
  } else {
    alert("Unknown user role. Please contact admin.");
  }
      }

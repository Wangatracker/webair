// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcqZKghgyzk1ghfP-l8dwlHOVRNeG1TAk",
  authDomain: "edu-sync-hub-africa.firebaseapp.com",
  databaseURL: "https://edu-sync-hub-africa-default-rtdb.firebaseio.com",
  projectId: "edu-sync-hub-africa",
  storageBucket: "edu-sync-hub-africa.firebasestorage.app",
  messagingSenderId: "625120725619",
  appId: "1:625120725619:web:0a373d5201cd9a87333806",
  measurementId: "G-Y7G0P2KVTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

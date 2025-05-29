// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjsxzqXwW2PcwowbFSb4jiGTHGv9rdL0w",
  authDomain: "agent-hive-project.firebaseapp.com",
  databaseURL: "https://agent-hive-project-default-rtdb.firebaseio.com",
  projectId: "agent-hive-project",
  storageBucket: "agent-hive-project.appspot.com",
  messagingSenderId: "464476218600",
  appId: "1:464476218600:web:59aa5ba90c73468d78155d",
  measurementId: "G-YGQ85D592J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Export for other files to use
export { app, auth, database };

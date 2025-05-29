import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const auth = getAuth();
const db = getDatabase();

// Handle Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const county = document.getElementById("county").value;
    const isTeacher = document.getElementById("role-teacher").checked;
    const level = document.querySelector('input[name="level"]:checked')?.value || "none";
    const school = document.getElementById("school")?.value || "";

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const role = isTeacher ? "teacher" : "student";
      await set(ref(db, "users/" + uid), {
        name,
        username,
        email,
        phone,
        county,
        role,
        level,
        school
      });

      alert("Signup successful!");
      if (role === "teacher") {
        window.location.href = "teacher.html";
      } else {
        switch (level) {
          case "college": window.location.href = "college.html"; break;
          case "highschool": window.location.href = "highschool.html"; break;
          case "academy": window.location.href = "academy.html"; break;
          default: window.location.href = "dashboard.html";
        }
      }

    } catch (error) {
      alert("Signup error: " + error.message);
    }
  });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `users/${uid}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const role = userData.role || "student";
        const level = userData.level || "";

        if (role === "teacher") {
          window.location.href = "teacher.html";
        } else {
          switch (level) {
            case "college": window.location.href = "college.html"; break;
            case "highschool": window.location.href = "highschool.html"; break;
            case "academy": window.location.href = "academy.html"; break;
            default: window.location.href = "dashboard.html";
          }
        }

      } else {
        alert("User data not found!");
      }

    } catch (error) {
      alert("Login error: " + error.message);
    }
  });
}

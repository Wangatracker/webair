
// script.js
import { auth, db, ref, set, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase.js';

document.getElementById("signupForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const county = document.getElementById("county").value;
    const role = document.querySelector('input[name="role"]:checked')?.value || "student";
    const level = document.getElementById("level")?.value || "none";
    const institution = document.getElementById("institution")?.value || "none";

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return set(ref(db, 'users/' + user.uid), {
                fullName, username, email, phone, county, role, level, institution
            });
        })
        .then(() => {
            if (role === "teacher") {
                window.location.href = "teacher.html";
            } else {
                window.location.href = level + ".html";
            }
        })
        .catch(error => alert(error.message));
});

document.getElementById("loginForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // In production, you should check role and redirect properly
            window.location.href = "dashboard.html";
        })
        .catch(error => alert(error.message));
});

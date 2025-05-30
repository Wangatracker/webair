// js/dashboard.js
import { auth, db, storage } from "./firebase.js";
import { doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import { getCareerSuggestion } from "./ai.js";

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      document.getElementById("user-email").textContent = data.email;
      if (data.role === "student") loadStudentDashboard(user);
      else if (data.role === "teacher") loadTeacherDashboard(user);
      else if (data.role === "admin") loadAdminDashboard();
    }
  } else {
    window.location.href = "login.html";
  }
});

async function loadStudentDashboard(user) {
  const diaryForm = document.getElementById("diary-form");
  const scheduleForm = document.getElementById("schedule-form");
  const careerForm = document.getElementById("career-form");
  const profilePicInput = document.getElementById("profile-pic");

  if (diaryForm) {
    diaryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = document.getElementById("diary-content").value;
      await setDoc(doc(db, "diaries", user.uid), { content, updatedAt: new Date() });
      alert("Diary saved!");
    });
  }

  if (scheduleForm) {
    scheduleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const event = document.getElementById("schedule-event").value;
      await setDoc(doc(db, "schedules", user.uid), { event, updatedAt: new Date() });
      alert("Schedule saved!");
    });
  }

  if (careerForm) {
    careerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const career = document.getElementById("career-goal").value;
      await setDoc(doc(db, "careers", user.uid), { career, updatedAt: new Date() });
      const suggestion = getCareerSuggestion(career);
      document.getElementById("career-suggestion").textContent = suggestion;
    });
  }

  if (profilePicInput) {
    profilePicInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await setDoc(doc(db, "users", user.uid), { profilePic: url }, { merge: true });
      document.getElementById("profile-pic-display").src = url;
    });
  }
}

async function loadTeacherDashboard(user) {
  // Similar to student, add assignment upload logic
}

async function loadAdminDashboard() {
  const paymentTable = document.getElementById("payment-table");
  const paymentsRef = collection(db, "payments");
  const snapshot = await getDocs(paymentsRef);
  let html = "<tr><th>User</th><th>M-Pesa Ref</th><th>Status</th><th>Action</th></tr>";
  snapshot.forEach(doc => {
    const payment = doc.data();
    html += `<tr>
      <td>${payment.userEmail}</td>
      <td>${payment.mpesaRef}</td>
      <td>${payment.status}</td>
      <td><button onclick="approvePayment('${doc.id}', '${payment.userId}')">Approve</button></td>
    </tr>`;
  });
  paymentTable.innerHTML = html;
}

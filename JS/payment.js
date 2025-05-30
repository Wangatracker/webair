// js/payment.js
import { db } from "./firebase.js";
import { doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

export async function requestPayment(userId, userEmail, mpesaRef, tier) {
  await setDoc(doc(db, "payments", mpesaRef), {
    userId,
    userEmail,
    mpesaRef,
    tier,
    status: "pending",
    createdAt: new Date()
  });
  alert("Payment request submitted!");
}

export async function approvePayment(paymentId, userId) {
  await updateDoc(doc(db, "users", userId), {
    isPaid: true,
    paidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tier: "both" // Adjust based on tier
  });
  await updateDoc(doc(db, "payments", paymentId), { status: "approved" });
  alert("Payment approved!");
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDoc, addDoc, doc, updateDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
  authDomain: "kkuremindyou.firebaseapp.com",
  projectId: "kkuremindyou",
  storageBucket: "kkuremindyou.appspot.com",
  messagingSenderId: "715076785074",
  appId: "1:715076785074:web:7de6215548ff7f7e71caab",
  measurementId: "G-97M74MVYG9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



// ตรวจสอบสถานะการล็อกอิน
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ผู้ใช้ล็อกอินแล้ว
    const userEmail = user.email; // รับอีเมลของผู้ใช้
    // // ตั้งค่าข้อความต้อนรับในหน้า HTML
    document.getElementById("welcome-message").innerText = `สวัสดี ${userEmail}`;

    // ดึงรูปภาพของผู้ใช้และแสดงในหน้า HTML
    const uid = user.uid; // รับ uid ของผู้ใช้
    try {
      const adminDoc = await getDoc(doc(db, "admin", uid));
      if (adminDoc.exists()) {
        const profileImageURL = adminDoc.data().ProfileImageURL;
        if (profileImageURL) {
          document.getElementById("myimg").src = profileImageURL;
        } else {
          console.log("No profile image found for the user.");
        }
      } else {
        console.log("Admin document does not exist for the user.");
      }
    } catch (error) {
      console.error("Error fetching admin document:", error);
    }
  } else {
    // ผู้ใช้ไม่ได้ล็อกอิน หรือออกจากระบบแล้ว
    //document.getElementById("welcome-message").textContent = "ยินดีต้อนรับ, ผู้เยี่ยมชม";
    console.log("no users");
  }
});

// เหตุการณ์อื่นๆ ที่มีอยู่ในโค้ดของคุณ...

document.addEventListener("DOMContentLoaded", function navbar() {
  // เมื่อคลิกที่ id home-page
  document.getElementById("home-page").addEventListener("click", function () {
    // ไปที่หน้า home.html
    window.location.href = "../page/home.html";
  });

  // เมื่อคลิกที่ id history-page
  document.getElementById("history-page").addEventListener("click", function () {
    // ไปที่หน้า history.html
    window.location.href = "../page/history.html";
  });

  // เมื่อคลิกที่ปุ่ม "ออกจากระบบ"
  document.getElementById("logout").addEventListener("click", function () {
    signOut(auth)
      .then(() => {
        alert("ออกจากระบบเรียบร้อย");
        // หลังจากออกจากระบบเสร็จเรียบร้อย ให้ redirect ไปยังหน้า index.html
        window.location.href = "../index.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
});

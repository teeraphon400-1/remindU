import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword , signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
    authDomain: "kkuremindyou.firebaseapp.com",
    projectId: "kkuremindyou",
    storageBucket: "kkuremindyou.appspot.com",
    messagingSenderId: "715076785074",
    appId: "1:715076785074:web:7de6215548ff7f7e71caab",
    measurementId: "G-97M74MVYG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
//const table = document.getElementById("table")
const form = document.getElementById("addForm")
const formarea = document.getElementById("form-area")
const profile = document.getElementById("profile")
const welcome = document.getElementById("welcome")
const loginForm = document.getElementById("loginForm")
const logout=document.getElementById("logout")


//login
onAuthStateChanged(auth, (user) => {
    if (user) {
        profile.style.display = "block"
        formarea.style.display = "none"
        welcome.innerText = `ยินดีต้อนรับ ${user.email}`
    } else {
        profile.style.display = "none"
        formarea.style.display = "block"
    }
})


loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
            window.location.href = "page/home.html";
            alert("ลงชื่อเข้าใช้เรียบร้อย")
            //console.log(result)
        }).catch((error) => {
            alert("ไม่พบบัญชีผู้ใช้ กรุณาใส่ email และ password ให้ถูกต้อง")
        })
})



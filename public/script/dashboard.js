import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, setDoc, deleteDoc,query,where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
    authDomain: "kkuremindyou.firebaseapp.com",
    databaseURL: "https://kkuremindyou-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kkuremindyou",
    storageBucket: "kkuremindyou.appspot.com",
    messagingSenderId: "715076785074",
    appId: "1:715076785074:web:7de6215548ff7f7e71caab",
    measurementId: "G-97M74MVYG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function สำหรับดึงข้อมูลของกิจกรรมจากชื่อ
async function getEventData(eventName) {
    // ค้นหาเอกสารที่มีชื่อเหมือนกับ eventName
    const eventQuery = query(collection(db, 'event'), where('eventName', '==', eventName));
    const eventSnapshot = await getDocs(eventQuery);

    // ตรวจสอบว่ามีเอกสารที่พบหรือไม่
    if (!eventSnapshot.empty) {
        // หากมีเอกสาร ค้นหาเอกสารแรกที่มีชื่อเหมือนกัน
        const eventDoc = eventSnapshot.docs[0];
        const eventData = eventDoc.data();
        return eventData; // ส่งข้อมูลกิจกรรมกลับ
    } else {
        return null; // ไม่พบข้อมูล
    }
}

// Function สำหรับแสดงข้อมูลของกิจกรรมบนหน้าเว็บ
function displayEventDetails(eventData) {
    const eventDetailsDiv = document.getElementById('eventDetails');
    eventDetailsDiv.innerHTML = `
        <p><strong>Event Name:</strong> ${eventData.eventName}</p>
        <p><strong>Event Detail:</strong> ${eventData.eventDetail}</p>
        <p><strong>Event Location:</strong> ${eventData.eventLocation}</p>
        <p><strong>Start Date:</strong> ${eventData.startDate}</p>
        <p><strong>End Date:</strong> ${eventData.endDate}</p>
        <!-- เพิ่มข้อมูลอื่น ๆ ตามที่ต้องการ -->
    `;
}

// รับชื่อกิจกรรมจาก URL
const urlParams = new URLSearchParams(window.location.search);
const eventName = urlParams.get('eventName'); // สมมติว่า eventName คือชื่อกิจกรรมที่ถูกคลิก

// ดึงข้อมูลของกิจกรรมจากชื่อ
getEventData(eventName)
    .then(eventData => {
        if (eventData) {
            // แสดงข้อมูลของกิจกรรม
            displayEventDetails(eventData);
        } else {
            console.log('Event not found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

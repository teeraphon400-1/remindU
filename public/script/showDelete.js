// Import the functions you need from the SDKs you need
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
  authDomain: "kkuremindyou.firebaseapp.com",
  databaseURL: "https://kkuremindyou-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kkuremindyou",
  storageBucket: "kkuremindyou.appspot.com",
  messagingSenderId: "715076785074",
  appId: "1:715076785074:web:7de6215548ff7f7e71caab",
  measurementId: "G-97M74MVYG9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const table = document.getElementById("table");
const db = getFirestore(app);

async function getEvents(db, auth) {
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (userId) {
    const eventCol = collection(db, "event");
    const q = query(eventCol, where("uid", "==", userId));
    const eventSnapshot = await getDocs(q);
    return eventSnapshot;
  } else {
    return []; // Return an empty array if no user is logged in
  }
}

// Function to handle authentication state change
onAuthStateChanged(getAuth(app), async (user) => {
  if (user) {
    const auth = getAuth(app); // Get the auth object
    const userEmail = user.email;
    const data = await getEvents(db, auth); // Pass the auth object to getEvents function
    data.forEach((event) => {
      showData(event);
    });
    console.log(user);
  } else {
    console.log("No users");
  }
});

async function getEventData(eventName) {
  // ค้นหาเอกสารที่มีชื่อเหมือนกับ eventName
  const eventQuery = query(collection(db, "event"), where("eventName", "==", eventName));
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

function showData(event) {
  const row = table.insertRow(-1);
  const nameCol = row.insertCell(0);
  const eventLocationCol = row.insertCell(1);
  const startDateCol = row.insertCell(2);
  const endDateCol = row.insertCell(3);
  const deleteCol = row.insertCell(4);

  nameCol.innerHTML = event.data().eventName;
  eventLocationCol.innerHTML = event.data().eventLocation;
  startDateCol.innerHTML = event.data().startDate;
  endDateCol.innerHTML = event.data().endDate;

  //สร้างปุ่มลบ
  let btn = document.createElement("button");
  btn.textContent = "ลบข้อมูล";
  btn.setAttribute("class", "btn btn-danger");
  btn.setAttribute("data-id", event.id);
  btn.setAttribute("data-name", event.data().eventName); // เพิ่มบรรทัดนี้เพื่อระบุชื่อกิจกรรม

  // สร้างลิงก์สำหรับชื่อกิจกรรม
  const eventNameLink = document.createElement("a");
  eventNameLink.textContent = event.data().eventName;
  eventNameLink.href = "#"; // เปลี่ยน URL ตามที่ต้องการ
  nameCol.appendChild(eventNameLink);

  // หากต้องการให้สร้างรายละเอียดของกิจกรรมเมื่อคลิกที่ชื่อกิจกรรม
  eventNameLink.addEventListener("click", async () => {
    // ดึงข้อมูลชื่อกิจกรรม
    const eventName = event.data().eventName;
    // ดึงข้อมูลกิจกรรมจากชื่อ
    getEventData(eventName)
      .then((eventData) => {
        if (eventData) {
          // แสดงข้อมูลกิจกรรม
          document.getElementById("eventName").innerHTML = `<b>ชื่อกิจกรรม:</b> ${eventData.eventName}`;
          document.getElementById("eventLocation").innerHTML = `สถานที่จัดกิจกรรม: ${eventData.eventLocation}`;
          document.getElementById("eventDetail").innerHTML = `รายละเอียดกิจกรรม: ${eventData.eventDetail}`;
          document.getElementById("startDate").innerHTML = `วันเวลาเริ่มจัดกิจกรรม: ${eventData.startDate}`;
          document.getElementById("endDate").innerHTML = `วันเวลาสิ้นสุดกิจกรรม: ${eventData.endDate}`;

          // เพิ่มข้อมูล category
          document.getElementById("eventCategory").innerHTML = `หมวดหมู่: ${eventData.category.join(", ")}`;
          document.getElementById("eventFaculty").innerHTML = `คณะ: ${eventData.faculty.join(", ")}`; // เพิ่มข้อมูล faculty
          document.getElementById("eventIsLimited").innerHTML = `จำกัดจำนวนผู้เข้าร่วม: ${eventData.isLimited ? "ใช่" : "ไม่ใช่"}`; // เพิ่มข้อมูล isLimited
          document.getElementById("eventquantity").innerHTML = `จำนวนคนที่จำกัด: ${eventData.quantity} คน`;

          // ตรวจสอบว่าฟิลด์ reserveId มีอยู่หรือไม่
          if (eventData.reserveId) {
            document.getElementById("eventReserveCount").innerHTML = `จำนวนคนที่สนใจเข้าร่วมกิจกรรม: ${eventData.reserveId.length}`;
          } else {
            // ถ้าไม่มีฟิลด์ reserveId ให้แสดงข้อความที่ไม่มีการจอง
            document.getElementById("eventReserveCount").innerHTML = `ยังไม่มีการกดสนใจเข้าร่วมกิจกรรมนี้`;
          }

          // แสดงรูปภาพ
          const imgElement = document.getElementById("myimg");
          imgElement.src = eventData.ImageURL;
          imgElement.alt = eventData.ImageName;

          // แสดงส่วนของรายละเอียดกิจกรรม (div id="detail")
          document.getElementById("detail").style.display = "block";

          // ซ่อนส่วนของรายการกิจกรรมทั้งหมด (div class="main")
          document.querySelector(".main").style.display = "none";
        } else {
          console.log("Event not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  deleteCol.appendChild(btn);
  btn.addEventListener("click", (e) => {
    let id = e.target.getAttribute("data-id");
    deleteDoc(doc(db, "event", id)).then(() => {
      location.reload(); // Reload the page after deletion is complete
    });
  });

  const showComment = async () => {
    const commentElement = document.getElementById("comment");
    const commentData = event.data().commentId;
    console.log(commentData);
    commentData.forEach(async (comment) => {
      const commentData = await queryCommentById(comment);
      const commentChild = document.createElement("div");
      commentChild.id = "comment-child";
      commentChild.style.display = "flex";
      commentChild.style.justifyContent = "space-between";
      commentChild.style.alignItems = "center";
      commentChild.style.paddingLeft = "250px";
      commentChild.style.paddingRight = "50px";
      commentChild.style.fontSize = "16px";
      commentChild.style.fontWeight = "bold";

      const userDiv = document.createElement("div");
      userDiv.innerText = `${commentData.commentDetail}`;

      const detailsDiv = document.createElement("div");
      detailsDiv.innerText = `${commentData.ratting} ดาว`;

      commentChild.appendChild(userDiv);
      commentChild.appendChild(detailsDiv);

      commentElement.appendChild(commentChild);
    });
  };

  showComment();
}

const data = await getEvents(db);
data.forEach((event) => {
  showData(event);
});

async function queryCommentById(commentId) {
  const commentRef = doc(collection(db, "comment"), commentId);
  const commentSnapshot = await getDoc(commentRef);
  return commentSnapshot.data();
}

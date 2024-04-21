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
  const statusCol = row.insertCell(0); // เพิ่มคอลัมน์สำหรับสถานะกิจกรรม
  const nameCol = row.insertCell(1);
  const eventLocationCol = row.insertCell(2);
  const startDateCol = row.insertCell(3);
  const endDateCol = row.insertCell(4);
  const deleteCol = row.insertCell(5);
  const editCol = row.insertCell(6); // เพิ่มคอลัมน์สำหรับปุ่ม Edit


  eventLocationCol.innerHTML = event.data().eventLocation;
  startDateCol.innerHTML = event.data().startDate;
  endDateCol.innerHTML = event.data().endDate;

  const startDate = new Date(event.data().startDate);
  const endDate = new Date(event.data().endDate);
  startDateCol.innerHTML = startDate.toLocaleDateString('en-US');
  endDateCol.innerHTML = endDate.toLocaleDateString('en-US');

  const currentDate = new Date(); // วันที่ปัจจุบัน
  if (currentDate <= endDate) {
    // ถ้าวันปัจจุบันยังไม่ถึงหรือเท่ากับวันสิ้นสุดของกิจกรรม
    statusCol.innerHTML = "<span style='color:green;font-weight: bold;'>กำลังดำเนินการ</span>"; // แสดงข้อความว่า "ดำเนินกิจกรรม"
  } else {
    // ถ้าวันปัจจุบันหลังจากวันสิ้นสุดของกิจกรรม
    statusCol.innerHTML = "<span style='color:red;font-weight: bold;'>สิ้นสุดกิจกรรม</span>"; // แสดงข้อความว่า "สิ้นสุดกิจกรรม"
  }
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


  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit"; // ข้อความบนปุ่ม Edit
  editBtn.setAttribute("class", "btn btn-primary"); // กำหนดคลาส CSS สำหรับปุ่ม Edit
  editBtn.setAttribute("data-id", event.id); // กำหนด attribute ชื่อ "data-id" โดยให้มีค่าเป็น ID ของกิจกรรม
  editCol.appendChild(editBtn); // เพิ่มปุ่ม Edit ลงในคอลัมน์

  // เพิ่ม Event Listener สำหรับปุ่ม Edit เพื่อเปิดหน้า createEvent.html พร้อมกำหนดชื่อกิจกรรมให้กับ input field ที่ชื่อ eventName
  editBtn.addEventListener("click", (e) => {
    let id = e.target.getAttribute("data-id"); // ดึงค่า ID ของกิจกรรมที่ต้องการแก้ไข
    // Redirect ไปยังหน้า createEvent.html พร้อมกับส่งค่า ID ของกิจกรรมเพื่อใช้ในการแก้ไข
    window.location.href = `editEvent.html?id=${id}`;
  });


  // หากต้องการให้สร้างรายละเอียดของกิจกรรมเมื่อคลิกที่ชื่อกิจกรรม
  eventNameLink.addEventListener("click", async () => {
    // ดึงข้อมูลชื่อกิจกรรม
    const eventName = event.data().eventName;
    getEventData(eventName)
      .then((eventData) => {
        if (eventData) {
          // แสดงข้อมูลกิจกรรม
          document.getElementById("eventName").innerHTML = `<b>ชื่อกิจกรรม:</b> ${eventData.eventName}`;
          document.getElementById("eventLocation").innerHTML = `สถานที่จัดกิจกรรม: ${eventData.eventLocation}`;
          document.getElementById("eventDetail").innerHTML = `รายละเอียดกิจกรรม: ${eventData.eventDetail}`;
          // แปลงวันที่เริ่มต้นกิจกรรม
          const startDate = new Date(eventData.startDate);
          const startDateString = startDate.toLocaleString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          // แปลงวันที่สิ้นสุดกิจกรรม
          const endDate = new Date(eventData.endDate);
          const endDateString = endDate.toLocaleString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          // แสดงวันที่เริ่มต้นกิจกรรมและสิ้นสุดกิจกรรมในรูปแบบที่กำหนด
          document.getElementById("startDate").innerHTML = `วันเวลาเริ่มจัดกิจกรรม: ${startDateString}`;
          document.getElementById("endDate").innerHTML = `วันเวลาสิ้นสุดกิจกรรม: ${endDateString}`;


          // เพิ่มข้อมูล category
          document.getElementById("eventCategory").innerHTML = `หมวดหมู่: ${eventData.category.join(", ")}`;
          document.getElementById("eventFaculty").innerHTML = `คณะ: ${eventData.faculty.join(", ")}`; // เพิ่มข้อมูล faculty
          document.getElementById("eventIsLimited").innerHTML = `จำกัดจำนวนผู้เข้าร่วม: ${eventData.isLimited ? "ใช่" : "ไม่ใช่"}`; // เพิ่มข้อมูล isLimited
          document.getElementById("eventquantity").innerHTML = `จำนวนคนที่จำกัด: ${eventData.quantity} คน`;

          // ตรวจสอบว่าฟิลด์ reserveId มีอยู่หรือไม่
          if (eventData.reserveId && eventData.reserveId.length > 0) {
            document.getElementById("eventReserveCount").innerHTML = `จำนวนคนที่สนใจเข้าร่วมกิจกรรม: ${eventData.reserveId.length}`;
          } else {
            // ถ้าไม่มีฟิลด์ reserveId หรือ reserveId ไม่มีค่า หรือมีค่าเป็น []
            document.getElementById("eventReserveCount").innerHTML = `ยังไม่มีการกดสนใจเข้าร่วมกิจกรรมนี้`;
          }

          if (eventData.checkInId && eventData.checkInId.length > 0) {
            document.getElementById("eventCheckInCount").innerHTML = `จำนวนคนที่เข้าร่วมกิจกรรม: ${eventData.checkInId.length}`;
          } else {
            // ถ้าไม่มีฟิลด์ reserveId หรือ reserveId ไม่มีค่า หรือมีค่าเป็น []
            document.getElementById("eventCheckInCount").innerHTML = `ยังไม่มีการกดสนใจเข้าร่วมกิจกรรมนี้`;
          }
          showReserve();
          showComment();
          showCheckin();
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
    let totalRating = 0; // Initialize totalRating variable
    let totalComments = 0; // Initialize totalComments variable

    commentElement.style.display = "flex";
    commentElement.style.flexDirection = "column";
    commentElement.style.alignItems = "center";

    commentData.forEach(async (comment) => {
      const commentData = await queryCommentById(comment);
      const commentChild = document.createElement("div");
      commentChild.id = "comment-child";
      commentChild.style.display = "flex";
      commentChild.style.justifyContent = "space-between";
      commentChild.style.alignItems = "center";
      commentChild.style.paddingLeft = "10px";
      commentChild.style.paddingRight = "10px";
      commentChild.style.fontSize = "16px";
      commentChild.style.color = "gray";
      commentChild.style.borderBottom = "1px solid gray";
      commentChild.style.width = "50%";

      const userDiv = document.createElement("div");
      userDiv.innerText = `${commentData.commentDetail}`;

      const detailsDiv = document.createElement("div");
      detailsDiv.innerText = `${commentData.ratting} ดาว`;

      commentChild.appendChild(userDiv);
      commentChild.appendChild(detailsDiv);

      commentElement.appendChild(commentChild);

      // Sum up the ratings and count the comments
      totalRating += commentData.ratting;
      totalComments++;

      // Calculate the average rating
      const averageRating = totalComments > 0 ? totalRating / totalComments : 0;
      // Display the average rating
      const averageElement = document.getElementById("average");
      averageElement.style.color = "#070F2B";
      averageElement.innerHTML = `Average Rating: ${averageRating.toFixed(2)} ดาว`;
    });
  };

  //============================================reserve=======================================

  const showReserve = async () => {
    const reserveElement = document.getElementById("reserve");
    const reserveData = event.data().reserveId;
    console.log(reserveData);
    reserveElement.style.display = "flex";
    reserveElement.style.flexDirection = "column"; // ให้เรียงข้อมูลแนวดิ่ง
    reserveElement.style.alignItems = "center"; // จัดให้ตรงกลางของหน้าจอ

    reserveData.forEach(async (reserve) => {
        const reserveData = await getReserveData(reserve);
        const reserveChild = document.createElement("div");
        reserveChild.id = "reserve-child";
        reserveChild.style.display = "flex";
        reserveChild.style.justifyContent = "space-between";
        reserveChild.style.alignItems = "center";
        reserveChild.style.paddingLeft = "500px";
        reserveChild.style.paddingRight = "10px";
        reserveChild.style.fontSize = "16px";
        reserveChild.style.color = "gray";
        // commentChild.style.backgroundColor = "#9290C3";
        reserveChild.style.borderBottom = "1px solid gray";
        reserveChild.style.width = "100%"; // เปลี่ยนเป็น 100% ให้คอลัมน์ของตารางเต็มขนาด

        const userData = await getUserData(reserveData.userId); // ดึงข้อมูลผู้ใช้จาก userId
        const userName = `${userData.firstName} ${userData.lastName}`; // แสดงชื่อและนามสกุลของผู้ใช้
        const userDiv = document.createElement("div");
        userDiv.innerText = userName; // แสดงชื่อผู้ใช้แทน userId
        userDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ userDiv เป็น 30%

        const phoneDiv = document.createElement("div");
        const userPhonenumber = `${userData.phoneNumber}`;
        phoneDiv.innerText = userPhonenumber; // แสดงชื่อผู้ใช้แทน userId
        phoneDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ phoneDiv เป็น 30%

        const detailsDiv = document.createElement("div");
        detailsDiv.innerText = `${reserveData.reserveAt} `;
        detailsDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ detailsDiv เป็น 30%

        reserveChild.appendChild(userDiv);
        reserveChild.appendChild(detailsDiv);
        reserveChild.appendChild(phoneDiv);

        reserveElement.appendChild(reserveChild);
    });
};


  //============================================checkin======================================

  const showCheckin = async () => {
    const checkinElement = document.getElementById("checkin");
    const checkinData = event.data().checkInId;
    console.log(checkinData);
    checkinElement.style.display = "flex";
    checkinElement.style.flexDirection = "column"; // ให้เรียงข้อมูลแนวดิ่ง
    checkinElement.style.alignItems = "center"; // จัดให้ตรงกลางของหน้าจอ

    checkinData.forEach(async (checkin) => {
        const checkinData = await getCheckinData(checkin);
        const checkinChild = document.createElement("div");
        checkinChild.id = "checkin-child";
        checkinChild.style.display = "flex";
        checkinChild.style.justifyContent = "space-between";
        checkinChild.style.alignItems = "center";
        checkinChild.style.paddingLeft = "500px";
        checkinChild.style.paddingRight = "10px";
        checkinChild.style.fontSize = "16px";
        checkinChild.style.color = "gray";
        // commentChild.style.backgroundColor = "#9290C3";
        checkinChild.style.borderBottom = "1px solid gray";
        checkinChild.style.width = "100%"; // เปลี่ยนเป็น 100% ให้คอลัมน์ของตารางเต็มขนาด

        let userData;
        if (checkinData.userId) {
            // ถ้ามี userId ให้ดึงข้อมูลผู้ใช้จาก collection user
            userData = await getUserData(checkinData.userId);
        } else if (checkinData.anonymousId) {
            // ถ้าไม่มี userId แต่มี anonymousId ให้ดึงข้อมูลผู้ใช้จาก collection anonymous
            userData = await getAnonymousData(checkinData.anonymousId);
        }
        const userName = `${userData.firstName} ${userData.lastName}`; // แสดงชื่อและนามสกุลของผู้ใช้
        const userDiv = document.createElement("div");
        userDiv.innerText = userName; // แสดงชื่อผู้ใช้แทน userId
        userDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ userDiv เป็น 30%

        const phoneDiv = document.createElement("div");
        const userPhonenumber = `${userData.phoneNumber}`;
        phoneDiv.innerText = userPhonenumber; // แสดงชื่อผู้ใช้แทน userId
        phoneDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ phoneDiv เป็น 30%

        const detailsDiv = document.createElement("div");
        detailsDiv.innerText = `${checkinData.checkInAt} `;
        detailsDiv.style.flexBasis = "30%"; // กำหนดความกว้างสูงสุดของ detailsDiv เป็น 30%

        checkinChild.appendChild(userDiv);
        checkinChild.appendChild(detailsDiv);
        checkinChild.appendChild(phoneDiv);

        checkinElement.appendChild(checkinChild);
    });
};

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

async function getReserveData(reserveId) {
  const reserveRef = doc(collection(db, "reserve"), reserveId);
  const reserveSnapshot = await getDoc(reserveRef);
  return reserveSnapshot.data();

}

async function getUserData(userId) {
  const userRef = doc(collection(db, "user"), userId);
  const userSnapshot = await getDoc(userRef);
  return userSnapshot.data();
}

async function getCheckinData(checkinId) {
  const checkinRef = doc(collection(db, "checkIn"), checkinId);
  const checkinSnapshot = await getDoc(checkinRef);
  return checkinSnapshot.data();
}
async function getAnonymousData(anonymousId) {
  const anonymousRef = doc(collection(db, "anonymous"), anonymousId);
  const anonymousSnapshot = await getDoc(anonymousRef);
  return anonymousSnapshot.data();
}



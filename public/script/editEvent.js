import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
    getFirestore,
    collection,
    getDoc,
    addDoc,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
    authDomain: "kkuremindyou.firebaseapp.com",
    projectId: "kkuremindyou",
    storageBucket: "kkuremindyou.appspot.com",
    messagingSenderId: "715076785074",
    appId: "1:715076785074:web:7de6215548ff7f7e71caab",
    measurementId: "G-97M74MVYG9",
};

// ------------------- Initialize Firebase --------------------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const db = getFirestore(app);

const form = document.getElementById("addEvent");
const navbar = document.getElementById("navbar");
const logout = document.getElementById("logout");

const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');
console.log(eventId)


//------------------------collection ref---------------------------
const colRef = collection(db, "event");

var files = [];
var reader = new FileReader();

var namebox = document.getElementById("namebox");
var extlab = document.getElementById("extlab");
var myimg = document.getElementById("myimg");
var proglab = document.getElementById("upprogress");
var SelBtn = document.getElementById("selbtn");

//----------------------Select image----------------------------
var input = document.createElement("input");
input.type = "file";

input.onchange = (e) => {
    files = e.target.files;

    var extention = GetFileExt(files[0]);
    var name = GetFileName(files[0]);

    namebox.value = name;
    extlab.innerHTML = extention;

    reader.readAsDataURL(files[0]);
};

reader.onload = function () {
    myimg.src = reader.result;
};

SelBtn.onclick = function () {
    input.click();
};

function GetFileExt(file) {
    var temp = file.name.split(".");
    var ext = temp.slice(temp.length - 1, temp.length);
    return "." + ext[0];
}
function GetFileName(file) {
    var temp = file.name.split(".");
    var fname = temp.slice(0, -1).join(".");
    return fname;
}

async function UploadProcess() {
    var ImgToUpload = files[0];
    var ImgName = namebox.value + extlab.innerHTML;

    const metaData = {
        contentType: ImgToUpload.type,
    };

    const storage = getStorage();
    const storageRef = sRef(storage, "images/" + ImgName);
    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);


    UploadTask.on(
        "state-changed",
        (snapshot) => {
            var progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            proglab.innerHTML = "Upload " + progess + "%";
        },
        (error) => {
            alert("error : Image not Uploaded! ");
        },
        () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                const selectedCategories = Array.from(form.category.selectedOptions).map((option) => option.value);
                const selectedFaculties = Array.from(form.faculty.selectedOptions).map((option) => option.value);

                var isLimited = document.getElementById("toggleCheckbox").checked;

                const startDate = form.startDate.value + "T" + form.startTime.value;
                const endDate = form.endDate.value + "T" + form.endTime.value;
                // Replace addDoc with updateDoc
                updateDoc(doc(colRef, eventId), {
                    eventName: form.eventName.value,
                    eventDetail: form.eventDetail.value,
                    eventLocation: form.eventLocation.value,
                    startDate: startDate,
                    endDate: endDate,
                    category: selectedCategories,
                    faculty: selectedFaculties,
                    isLimited: isLimited,
                    quantity: form.numberInput.value,
                    ImageName: ImgName,
                    ImageURL: downloadURL,
                    uid: auth.currentUser.uid,
                })
                    .then(() => {
                        form.reset();
                        alert("อัปเดตกิจกรรมเรียบร้อย/successfully updated!");
                        window.location.href = "home.html";
                    })
                    .catch((error) => {
                        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล/Error updating data");
                    });

            });
        }
    );
}

// adding document
form.addEventListener("submit", (e) => {
    e.preventDefault();
    UploadProcess();
});

new MultiSelectTag("category", {
    rounded: true,
    placeholder: "Search", // default Search...
    tagColor: {
        textColor: "#327b2c",
        borderColor: "#92e681",
        bgColor: "#eaffe6",
    },
    onChange: function (values) {
        console.log(values);
    },
});

new MultiSelectTag("faculty", {
    rounded: true,
    placeholder: "Search", // default Search...
    tagColor: {
        textColor: "#327b2c",
        borderColor: "#92e681",
        bgColor: "#eaffe6",
    },
    onChange: function (values) {
        console.log(values);
    },
});

document.getElementById("toggleCheckbox").addEventListener("change", function () {
    var numberInput = document.getElementById("numberInput");
    if (this.checked) {
        numberInput.style.display = "block"; // แสดง input
    } else {
        numberInput.style.display = "none"; // ซ่อน input
        numberInput.value = ""; // ตัวเลือกเพิ่มเติม: ล้างค่าใน input เมื่อซ่อน
    }
});

document.addEventListener("DOMContentLoaded", function () {
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

const docSnap = await getDoc(doc(colRef, eventId));
if (docSnap.exists()) {
    const eventData = docSnap.data(); // ข้อมูลจากเอกสาร
    // กำหนดค่าข้อมูลในฟอร์ม
    form.eventName.value = eventData.eventName;
    form.eventDetail.value = eventData.eventDetail;
    form.eventLocation.value = eventData.eventLocation;
    
    const startDateParts = eventData.startDate.split('T'); // แยกวันที่และเวลาออกจากกัน
    const endDateParts = eventData.endDate.split('T');
    document.getElementById('startDate').value = startDateParts[0]; // กำหนดค่าวันที่
    document.getElementById('startTime').value = startDateParts[1]; // กำหนดค่าเวลา
    document.getElementById('endDate').value = endDateParts[0]; // กำหนดค่าวันที่
    document.getElementById('endTime').value = endDateParts[1]; // กำหนดค่าเวลา
} else {
    console.log("No such document!");
}

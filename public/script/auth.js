import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

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

//const table = document.getElementById("table")
const form = document.getElementById("addForm");
const formarea = document.getElementById("form-area");
const profile = document.getElementById("profile");
const welcome = document.getElementById("welcome");
const loginForm = document.getElementById("loginForm");
const logout = document.getElementById("logout");

//login
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user)
  } else {
    profile.style.display = "none";
    formarea.style.display = "block";
  }
});

//================= image upload ===============================

var files = [];
var reader = new FileReader();

var namebox = document.getElementById("namebox");
var extlab = document.getElementById("extlab");
var myimg = document.getElementById("myimg");
var proglab = document.getElementById("upprogress");
var SelBtn = document.getElementById("selbtn");
var UpBtn = document.getElementById("upbtn");

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

//--------------------------------Upload Process-------------------------------

async function UploadProcess() {
  try {
    var ImgToUpload = files[0];
    var ImgName = namebox.value + extlab.innerHTML;

    const metaData = {
      contentType: ImgToUpload.type,
    };

    const storage = getStorage();
    const storageRef = sRef(storage, "images/" + ImgName);
    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    // Wait for the upload to finish
    const snapshot = await UploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Create user with email and password
    const cred = await createUserWithEmailAndPassword(auth, form.email.value, form.password.value);
    const uid = cred.user.uid;

    // Prepare the document reference
    const userDocRef = doc(db, "admin", uid);

    // Check if document exists and update or set accordingly
    // Check if document exists and update or set accordingly
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        ProfileImageName: ImgName,
        ProfileImageURL: downloadURL,
        AdminEmail: form.email.value,
        AdminPassword: form.password.value,
        PageName: form.account_name.value,
      });
    } else {
      // Create new document
      await setDoc(userDocRef, {
        ProfileImageName: ImgName,
        ProfileImageURL: downloadURL,
        AdminEmail: form.email.value,
        AdminPassword: form.password.value,
        PageName: form.account_name.value,
      });
    }

    alert("สร้างบัญชีผู้ใช้เรียบร้อย");
    window.location.href = "../page/home.html";
  } catch (error) {
    console.error("Error adding document: ", error);
    alert(error.message);
  }
}



//======================= "submiy form========================="

form.addEventListener("submit", (e) => {
  e.preventDefault();
  UploadProcess();
});

logout.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      alert("ออกจากระบบเรียบร้อย");
    })
    .catch((error) => {
      alert(error.message);
    });
});

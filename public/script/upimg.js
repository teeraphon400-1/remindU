import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, query } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
//cloud firestore database
const clouddb = getFirestore(app);

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
        SaveURLtoFirestore(downloadURL);
        alert("อัปโหลดรูปภาพสำเร็จ/success!");
      });
    }
  );
}
//-------------------------------Functions For Firestore database---------
// const reference = doc(clouddb,"admin","admin01","imageProfile","loadimg");
// const referenceOtherCollection = doc(clouddb,"admin","admin01","imageProfile","loadimg");

async function SaveURLtoFirestore(url) {
  var name = namebox.value;
  var ext = extlab.innerHTML;
  const ref = doc(clouddb, "img", "eventImg");
  await setDoc(ref, {
    ImageName: name + ext,
    ImageURL: url,
  });
}

UpBtn.onclick = UploadProcess;

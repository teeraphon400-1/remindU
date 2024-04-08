// Import the functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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

//collection ref
const colRef = collection(db, "admin");

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
        const email = form.email.value;
        const password = form.password.value;

        //write to firestore
        addDoc(colRef, {
          ProfileImageName: ImgName,
          ProfileImageURL: downloadURL,
          AdminEmail: email,
          AdminPassword: password,
        });

        createUserWithEmailAndPassword(auth, email, password)
          .then((result) => {
            // form.reset()
            // alert("สร้างบัญชีเรียบร้อย/success!")
            console.log(result);
          })
          .catch((error) => {
            alert("กรุณาใส่ email และ passwordจะต้องไม่ต่ำกว่า 6 ตัวอักษร");
          });
      });
    }
  );
}

//get collection data
getDocs(colRef)
  .then((snapshot) => {
    let admins = [];
    snapshot.docs.forEach((doc) => {
      admins.push({ ...doc.data(), id: doc.id });
    });
    console.log(admins);
  })
  .catch((err) => {
    console.log(err.message);
  });

// adding document
form.addEventListener("submit", (e) => {
  e.preventDefault();
  UploadProcess();
});

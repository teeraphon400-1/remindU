import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"

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
const logout = document.getElementById("logout")


//login
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "../page/home.html";
    } else {
        profile.style.display = "none"
        formarea.style.display = "block"
    }
})

//================= image upload ===============================

var files = [];
var reader = new FileReader();

var namebox = document.getElementById('namebox');
var extlab = document.getElementById('extlab');
var myimg = document.getElementById('myimg');
var proglab = document.getElementById('upprogress');
var SelBtn = document.getElementById('selbtn');
var UpBtn = document.getElementById('upbtn');

//----------------------Select image----------------------------
var input = document.createElement('input');
input.type = 'file';

input.onchange = e => {
    files = e.target.files;

    var extention = GetFileExt(files[0]);
    var name = GetFileName(files[0]);

    namebox.value = name;
    extlab.innerHTML = extention;

    reader.readAsDataURL(files[0]);
}

reader.onload = function () {
    myimg.src = reader.result;
}

SelBtn.onclick = function () {
    input.click();
}

function GetFileExt(file) {
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length - 1), (temp.length));
    return '.' + ext[0];
}
function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0, -1).join('.');
    return fname;
}

//--------------------------------Upload Process-------------------------------

async function UploadProcess() {
    var ImgToUpload = files[0];
    var ImgName = namebox.value + extlab.innerHTML;

    const metaData = {
        contentType: ImgToUpload.type
    }

    const storage = getStorage();
    const storageRef = sRef(storage, "images/" + ImgName)
    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    UploadTask.on('state-changed', (snapshot) => {
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
                const accountName = form.account_name.value;

                createUserWithEmailAndPassword(auth, email, password)
                    .then(cred => {
                        const uid = cred.user.uid;

                        // ตรวจสอบว่ามีเอกสารของผู้ใช้นี้ใน Firestore หรือไม่
                        const userDocRef = doc(db, "admin", uid);
                        return getDoc(userDocRef)
                            .then(docSnap => {
                                if (docSnap.exists()) {
                                    // ถ้ามีเอกสารของผู้ใช้นี้อยู่แล้ว ให้อัปเดตข้อมูล
                                    return updateDoc(userDocRef, {
                                        ProfileImageName: ImgName,
                                        ProfileImageURL: downloadURL,
                                        AdminEmail: email,
                                        AdminPassword : password,
                                        PageName: accountName
                                    });
                                } else {
                                    // ถ้ายังไม่มีเอกสารของผู้ใช้นี้ ให้สร้างใหม่
                                    return setDoc(userDocRef, {
                                        ProfileImageName: ImgName,
                                        ProfileImageURL: downloadURL,
                                        AdminEmail: email,
                                        AdminPassword : password,
                                        PageName: accountName
                                    });
                                }
                            });
                    })
                    .then(() => {
                        alert("สร้างบัญชีผู้ใช้เรียบร้อย");
                    }).catch((error) => {
                        alert(error.message);
                    });
            },)

        }
    )
}

//======================= "submiy form========================="

form.addEventListener("submit", (e) => {
    e.preventDefault();
    UploadProcess()
});



logout.addEventListener("click", (e) => {
    signOut(auth).then(() => {
        alert("ออกจากระบบเรียบร้อย")
    }).catch((error) => {
        alert(error.message)
    })
})


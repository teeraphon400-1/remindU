import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore , collection, getDocs,addDoc,doc,updateDoc, setDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"

  const firebaseConfig = {
    apiKey: "AIzaSyBLXZ53TI5-g2Cy7JWi_WowSdqQ7ZAvin4",
    authDomain: "kkuremindyou.firebaseapp.com",
    projectId: "kkuremindyou",
    storageBucket: "kkuremindyou.appspot.com",
    messagingSenderId: "715076785074",
    appId: "1:715076785074:web:7de6215548ff7f7e71caab",
    measurementId: "G-97M74MVYG9"
  };

  // ------------------- Initialize Firebase --------------------
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const db = getFirestore(app)

  const form = document.getElementById("addEvent")
  const table = document.getElementById("table") 
//------------------------collection ref---------------------------
const colRef = collection(db,"event")

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
input.type = 'file' ;

input.onchange = e =>{
      files = e.target.files ;

      var extention = GetFileExt(files[0]);
      var name = GetFileName(files[0]);

      namebox.value=name;
      extlab.innerHTML = extention;

      reader.readAsDataURL(files[0]);
}

reader.onload = function(){
  myimg.src = reader.result;
}

SelBtn.onclick = function(){
  input.click();
}

function GetFileExt(file){
  var temp = file.name.split('.');
  var ext = temp.slice((temp.length-1),(temp.length));
  return '.' + ext[0];
}
function GetFileName(file){
  var temp = file.name.split('.');
  var fname = temp.slice(0,-1).join('.');
  return fname;
}

async function UploadProcess (){
    var ImgToUpload = files[0];
    var ImgName = namebox.value + extlab.innerHTML;

    const metaData = {
      contentType : ImgToUpload.type
    }

    const storage = getStorage();
    const storageRef = sRef(storage, "images/" + ImgName)
    const UploadTask = uploadBytesResumable(storageRef,ImgToUpload,metaData);

    UploadTask.on('state-changed', (snapshot) =>{
        var progess = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
        proglab.innerHTML = "Upload " + progess + "%";
        
    },
    (error) => {
      alert("error : Image not Uploaded! ");
    },
    ()=> {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) =>{
        const selectedCategories = Array.from(form.category.selectedOptions).map(option => option.value);
        const selectedFaculties = Array.from(form.faculty.selectedOptions).map(option => option.value);
        const selectedUserform = Array.from(form.userform.selectedOptions).map(option => option.value);
        addDoc(colRef,{
            eventName: form.eventName.value ,
            eventDetail:form.eventDetail.value,
            eventLocation : form.eventLocation.value,
            startDate : form.startDate.value,
            endDate : form.endDate.value,
            category: selectedCategories,
            faculty: selectedFaculties,
            quantity : form.quantity.value,
            userform : selectedUserform,
            ImageName : ImgName,
            ImageURL : downloadURL
        })
        .then(() =>{
            form.reset()
            alert("สร้างกิจกรรมเรียบร้อย/success!")
            window.location.href = "home.html";
        }).catch((error)=>{
            alert("กรุณาใส่ข้อมูลให้ครบ")
        });

          },)
  
    }
    )
}


// async function SaveURLtoFirestore(url){
//     const ref = doc(db,"img","eventImg");
//     var name = namebox.value;
//     var ext = extlab.innerHTML;
//     await setDoc(ref,{
//       ImageName : (name+ext),
//       ImageURL : url
//     })
//   }


// adding document
form.addEventListener('submit', (e) => {
    e.preventDefault()
    UploadProcess(); 
})

new MultiSelectTag('category', {
    rounded: true,   
    placeholder: 'Search',  // default Search...
    tagColor: {
        textColor: '#327b2c',
        borderColor: '#92e681',
        bgColor: '#eaffe6',
    },
    onChange: function(values) {
        console.log(values)
    }
})

new MultiSelectTag('faculty', {
    rounded: true,   
    placeholder: 'Search',  // default Search...
    tagColor: {
        textColor: '#327b2c',
        borderColor: '#92e681',
        bgColor: '#eaffe6',
    },
    onChange: function(values) {
        console.log(values)
    }
})

new MultiSelectTag('userform', {
    rounded: true,   
    tagColor: {
        textColor: '#327b2c',
        borderColor: '#92e681',
        bgColor: '#eaffe6',
    },
    onChange: function(values) {
        console.log(values)
    }
})

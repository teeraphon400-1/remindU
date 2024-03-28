// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore , collection , getDocs,addDoc,deleteDoc,doc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
  measurementId: "G-97M74MVYG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const table = document.getElementById("table") 
const db = getFirestore(app)

async function getEvents(db){
    const eventCol = collection(db,'event')
    const eventSnapshot = await getDocs(eventCol)
    return eventSnapshot
}

function showData(event){
    const row = table.insertRow(-1)
    const nameCol = row.insertCell(0)
    const eventLocationCol = row.insertCell(1)
    const startDateCol = row.insertCell(2)
    const endDateCol = row.insertCell(3)
    const eventDetailCol = row.insertCell(4)
    const deleteCol = row.insertCell(5)


    nameCol.innerHTML = event.data().eventName
    eventLocationCol.innerHTML = event.data().eventLocation
    startDateCol.innerHTML = event.data().startDate
    endDateCol.innerHTML = event.data().endDate
    eventDetailCol.innerHTML = event.data().eventDetail
    

    //สร้างปุ่มลบ
    let btn =document.createElement('button')
    btn.textContent="ลบข้อมูล"
    btn.setAttribute('class','btn btn-danger')
    btn.setAttribute('data-id',event.id)

    deleteCol.appendChild(btn)
    btn.addEventListener('click',(e)=>{
        let id = e.target.getAttribute('data-id');
        deleteDoc(doc(db,'event',id)).then(() => {
            location.reload(); // Reload the page after deletion is complete
        });
    })
    
}

//ดึงกลุ่ม document
const data = await getEvents(db)
data.forEach(event=>{
    showData(event)
})


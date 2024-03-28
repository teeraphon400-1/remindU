import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {getFirestore, collection, getDocs, query,deleteDoc,doc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
    measurementId: "G-97M74MVYG9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore()
  const colRef = collection(db,'event')
  const eventList = document.querySelector('#event-list');
  

    
  function renderEvent(doc){
        let li = document.createElement('li');
        let eventName = document.createElement('span');
        let eventShortDetail = document.createElement('span');
        let eventLocation = document.createElement('span');
        let cross = document.createElement('div');


        li.setAttribute('data-id',doc.id)

        eventName.textContent = doc.data().eventName
        eventLocation.textContent = doc.data().eventLocation
        eventShortDetail.textContent = doc.data().eventShortDetail
        eventDetail.textContent = doc.data().eventDetail
        peoplemax.textContent = doc.data().peoplemax
        startDate.textContent = doc.data().startDate
        endDate.textContent = doc.data().endDate
        eventCategory.textContent = doc.data().eventCategory
        everyone.textContent = doc.data().everyone
        cross.textContent = 'x';

        li.appendChild(eventName)
        li.appendChild(eventShortDetail);
        li.appendChild(eventLocation);
        li.appendChild(eventDetail);
        li.appendChild(peoplemax);
        li.appendChild(startDate);
        li.appendChild(endDate);
        li.appendChild(eventCategory);
        li.appendChild(everyone);
        

        eventList.appendChild(li)

        
//       // Deleting data
//           cross.addEventListener('click', (e) => {
//               e.stopPropagation();
//               let id = e.target.parentElement.getAttribute('data-id');
//               deleteDoc(doc(db,'Event', id)).then(() => {
//                   console.log('Document successfully deleted!');
//               }).catch((error) => {
//                   console.error('Error removing document: ', error);
//               });
//           });

  }

  getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderEvent(doc);
        })
  })


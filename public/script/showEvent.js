import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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

const table = document.getElementById("table") 



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

async function tryReserve() {
    const docRef = doc(db, 'event', 'd1dQDJMcBrAOf4l7xvH7');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data().reserveId.data)
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
}

tryReserve();




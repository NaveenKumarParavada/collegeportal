// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcexTyC9lshgtDrKmnXiaibTB7ntQFa7U",
  authDomain: "community-server-attendance.firebaseapp.com",
  databaseURL: "https://community-server-attendance-default-rtdb.firebaseio.com",
  projectId: "community-server-attendance",
  storageBucket: "community-server-attendance.appspot.com",
  messagingSenderId: "91209010988",
  appId: "1:91209010988:web:60a85ba8508b6b3253a689",
  measurementId: "G-T70E8Q1FPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
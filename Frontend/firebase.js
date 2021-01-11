import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
try {
  firebase.initializeApp({
    apiKey: "AIzaSyBNcQbod3wpPntjJYnpo7kC08FCJbxUxho",
    authDomain: "insta-react-native-37855.firebaseapp.com",
    projectId: "insta-react-native-37855",
    storageBucket: "insta-react-native-37855.appspot.com",
    messagingSenderId: "484355163932",
    appId: "1:484355163932:web:7963257316d3cfbba91cd9",
    measurementId: "G-5KT2C7KSX8",
  });
} catch (err) {
  console.error("Firebase initialization error raised", err.stack);
}

const firebaseApp = firebase;
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
export { db, auth, storage };

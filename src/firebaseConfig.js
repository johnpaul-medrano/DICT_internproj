import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyB49eQ4TrCod9HyTAcNJqCFido3Sb9WPHI",
    authDomain: "dictapp-21983.firebaseapp.com",
    projectId: "dictapp-21983",
    storageBucket: "dictapp-21983.appspot.com",
    messagingSenderId: "672180765503",
    appId: "1:672180765503:web:de6516c6516a13707b498a",
    measurementId: "G-RQJ0PNMW5D"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

export { auth, db, messaging };
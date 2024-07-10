import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB49eQ4TrCod9HyTAcNJqCFido3Sb9WPHI",
  authDomain: "dictapp-21983.firebaseapp.com",
  projectId: "dictapp-21983",
  storageBucket: "dictapp-21983.appspot.com",
  messagingSenderId: "672180765503",
  appId: "1:672180765503:web:de6516c6516a13707b498a",
  measurementId: "G-RQJ0PNMW5D",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

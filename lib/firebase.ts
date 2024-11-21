// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWhbVTAT52TeSYdafzKJFuPkdL6asAq7k",
  authDomain: "gazi-db.firebaseapp.com",
  projectId: "gazi-db",
  storageBucket: "gazi-db.firebasestorage.app",
  messagingSenderId: "730502475336",
  appId: "1:730502475336:web:3f7cc23085b22e80e6327d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;

export const auth = getAuth(app);

export const singIn = async(user: {email: string, password: string}) => {
    return await signInWithEmailAndPassword(auth, user.email, user.password);
}
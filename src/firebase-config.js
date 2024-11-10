import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4w7EXmG7BJapsfKGzOyCIl7EhKZY5sE4",
  authDomain: "psifl-ba8fa.firebaseapp.com",
  projectId: "psifl-ba8fa",
  storageBucket: "psifl-ba8fa.appspot.com", // Fixed this line
  messagingSenderId: "727467505131",
  appId: "1:727467505131:web:a224db716a889f433455ae",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

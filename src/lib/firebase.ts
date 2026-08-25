import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "gen-lang-client-0078533526",
  appId: "1:956205630002:web:af2dab8c20ff8c8d0e322b",
  apiKey: "AIzaSyBO2QV3bjv7WrjMF5gUw2lhbxSWQBGYsHs",
  authDomain: "gen-lang-client-0078533526.firebaseapp.com",
  storageBucket: "gen-lang-client-0078533526.firebasestorage.app",
  messagingSenderId: "956205630002"
};

const app = initializeApp(firebaseConfig);

// Make sure to pass the custom databaseId if using one
export const db = getFirestore(app, "ai-studio-sportvideo-26861f7f-0e4a-45d0-9ef4-5c6d882d1d7e");
export const auth = getAuth(app);

// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCF0s-zNqmIE4Sc_JkQucrFfSlOhUHjgUI",
  authDomain: "rn-social-8cf53.firebaseapp.com",
  projectId: "rn-social-8cf53",
  storageBucket: "rn-social-8cf53.appspot.com",
  messagingSenderId: "295453277477",
  appId: "1:295453277477:web:093489e576e16c9e49eecc",
  measurementId: "G-625RK01L41",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

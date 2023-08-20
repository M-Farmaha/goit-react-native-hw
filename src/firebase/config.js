// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXdfhQYAQPb0Zs1wNYCJVECEmhbZ_Idhs",
  authDomain: "mobile-app-9a056.firebaseapp.com",
  projectId: "mobile-app-9a056",
  storageBucket: "mobile-app-9a056.appspot.com",
  messagingSenderId: "487769064529",
  appId: "1:487769064529:web:6bbf08affa0981d0766470",
  measurementId: "G-Q70VL9GJY4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

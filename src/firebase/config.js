// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-VedPufSun2_Nz2Gu2ea3bjhMPkvHy54",
  authDomain: "reactnativegoit-1c5b5.firebaseapp.com",
  projectId: "reactnativegoit-1c5b5",
  storageBucket: "reactnativegoit-1c5b5.appspot.com",
  messagingSenderId: "559147824653",
  appId: "1:559147824653:web:bc3c214282db31365f0744",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

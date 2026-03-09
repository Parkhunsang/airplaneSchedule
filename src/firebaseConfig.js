import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const getEnv = (key) => import.meta.env[key];

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID"),
};

const missingEnvKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingEnvKeys.length > 0) {
  throw new Error(
    `Firebase 환경변수 누락: ${missingEnvKeys.join(", ")}. .env 파일에 VITE_FIREBASE_* 값을 등록하세요.`,
  );
}

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;

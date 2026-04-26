import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getEnv = (key) => import.meta.env[key];

const firebaseEnvMap = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

export const firebaseConfig = Object.fromEntries(
  Object.entries(firebaseEnvMap).map(([configKey, envKey]) => [
    configKey,
    getEnv(envKey),
  ]),
);

export const missingFirebaseEnvKeys = Object.entries(firebaseEnvMap)
  .filter(([, envKey]) => !getEnv(envKey))
  .map(([, envKey]) => envKey);

export const firebaseConfigError =
  missingFirebaseEnvKeys.length > 0
    ? `Firebase 환경변수 누락: ${missingFirebaseEnvKeys.join(
        ", ",
      )}. Cloudflare Pages > Settings > Variables and Secrets에 VITE_FIREBASE_* 값을 등록한 뒤 다시 배포하세요.`
    : null;

if (firebaseConfigError) {
  console.error(firebaseConfigError);
}

const app = firebaseConfigError ? null : initializeApp(firebaseConfig);

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default app;

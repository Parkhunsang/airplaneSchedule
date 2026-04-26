import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, firebaseConfigError } from "../../../firebaseConfig";

const googleProvider = auth ? new GoogleAuthProvider() : null;

export const subscribeToAuthState = (onChange, onError) => {
  if (!auth) {
    onError?.(new Error(firebaseConfigError));
    onChange(null);
    return () => {};
  }

  return onAuthStateChanged(auth, onChange, onError);
};

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error(firebaseConfigError);
  }

  return signInWithPopup(auth, googleProvider);
};

export const signOutCurrentUser = async () => {
  if (!auth) {
    throw new Error(firebaseConfigError);
  }

  await signOut(auth);
};

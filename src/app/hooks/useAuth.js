import { useEffect, useState } from "react";
import {
  signInWithEmail,
  signInWithGoogle,
  signOutCurrentUser,
  subscribeToAuthState,
} from "../../features/auth/services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [isDemoSigningIn, setIsDemoSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signInError, setSignInError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setSignInError("");
      },
      (error) => {
        console.error("Firebase auth error:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setSignInError("");

    try {
      await signInWithGoogle();
    } catch (error) {
      setSignInError(error?.message ?? "Failed to sign in with Google.");
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleDemoSignIn = async ({ email, password }) => {
    setIsDemoSigningIn(true);
    setSignInError("");

    try {
      await signInWithEmail(email, password);
    } catch (error) {
      setSignInError(error?.message ?? "Failed to sign in with email.");
    } finally {
      setIsDemoSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutCurrentUser();
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    user,
    loading,
    isGoogleSigningIn,
    isDemoSigningIn,
    isSigningOut,
    signInError,
    handleSignIn,
    handleDemoSignIn,
    handleSignOut,
  };
};

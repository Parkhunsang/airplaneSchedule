import { useEffect, useState } from "react";
import {
  signInWithGoogle,
  signOutCurrentUser,
  subscribeToAuthState,
} from "../../features/auth/services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth error:", error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
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
    isSigningIn,
    isSigningOut,
    handleSignIn,
    handleSignOut,
  };
};

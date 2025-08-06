import { useState, useEffect } from "react";
import { authService } from "../services/authService";

/**
 * Authentication hook - manages auth state and operations
 */
export const useAuth = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    authService.getCurrentSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: listener } = authService.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await authService.signOut();
    setSession(null);
  };

  return {
    session,
    user: session?.user,
    isLoggedIn: !!session,
    logout,
  };
};

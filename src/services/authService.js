import { supabase } from "../supabaseClient";

/**
 * Authentication service - handles all Supabase authentication operations
 */
export const authService = {
  /**
   * Get current session
   */
  getCurrentSession: () => {
    return supabase.auth.getSession();
  },

  /**
   * Sign out user
   */
  signOut: () => {
    return supabase.auth.signOut();
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

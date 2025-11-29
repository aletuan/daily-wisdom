import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Initialize Supabase client with AsyncStorage for session persistence
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Sign up a new user with email, password, and nickname
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} nickname - User nickname (stored in profile)
 * @returns {Promise<{user, session, error}>}
 */
export async function signUp(email, password, nickname) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname, // Stored in user metadata, used by trigger to create profile
        },
        emailRedirectTo: undefined, // No email verification
      },
    });

    if (error) {
      return { user: null, session: null, error };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user, session, error}>}
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error };
  }
}

/**
 * Get current session
 * @returns {Promise<{session, error}>}
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
}

/**
 * Sign out current user
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
}

/**
 * Get current user profile from profiles table
 * @returns {Promise<{profile, error}>}
 */
export async function getUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { profile: null, error: new Error('No user logged in') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { profile: data, error };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error };
  }
}

/**
 * Update user profile
 * @param {string} nickname - New nickname
 * @returns {Promise<{profile, error}>}
 */
export async function updateProfile(nickname) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { profile: null, error: new Error('No user logged in') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ nickname })
      .eq('id', user.id)
      .select()
      .single();

    return { profile: data, error };
  } catch (error) {
    console.error('Update profile error:', error);
    return { profile: null, error };
  }
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Called when auth state changes
 * @returns {Object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

// Export supabase client for advanced usage
export { supabase };

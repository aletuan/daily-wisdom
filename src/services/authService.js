import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
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

    // Add email from auth user to profile data
    const profileWithEmail = {
      ...data,
      email: user.email,
    };

    return { profile: profileWithEmail, error };
  } catch (error) {
    console.error('Get profile error:', error);
    return { profile: null, error };
  }
}

/**
 * Calculate zodiac sign from date of birth
 * @param {Date} dateOfBirth - User's date of birth
 * @returns {string} Zodiac sign name
 */
export function calculateZodiacSign(dateOfBirth) {
  if (!dateOfBirth) return null;

  const date = new Date(dateOfBirth);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';

  return null;
}

/**
 * Upload avatar image to Supabase Storage
 * @param {string} imageUri - Local URI of the image to upload
 * @returns {Promise<{avatarUrl, error}>}
 */
export async function uploadAvatar(imageUri) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { avatarUrl: null, error: new Error('No user logged in') };
    }

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Create file path: avatars/{userId}/{timestamp}.jpg
    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload to Supabase Storage with base64 decode option
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error('Avatar upload error:', error);
      return { avatarUrl: null, error };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { avatarUrl: publicUrl, error: null };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return { avatarUrl: null, error };
  }
}

// Helper function to decode base64
function decode(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Update user profile with multiple fields
 * @param {Object} profileData - Profile fields to update
 * @param {string} profileData.nickname - User nickname
 * @param {string} profileData.gender - User gender (male/female/other)
 * @param {string} profileData.date_of_birth - Date of birth (YYYY-MM-DD)
 * @param {string} profileData.avatar_url - Avatar image URL
 * @returns {Promise<{profile, error}>}
 */
export async function updateProfile(profileData) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { profile: null, error: new Error('No user logged in') };
    }

    // Auto-calculate zodiac sign if date of birth is provided
    const updateData = { ...profileData };
    if (profileData.date_of_birth) {
      updateData.zodiac_sign = calculateZodiacSign(profileData.date_of_birth);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
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

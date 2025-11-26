import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { GEMINI_API_KEY } from '@env';

// Gemini Flash Image API endpoint
const IMAGEN_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

// Storage keys
const AVATAR_CACHE_KEY = '@avatar_cache_';
const AVATAR_DIR = `${FileSystem.cacheDirectory}avatars/`;

/**
 * Ensure avatar directory exists
 */
async function ensureAvatarDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(AVATAR_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AVATAR_DIR, { intermediates: true });
    }
}

/**
 * Generate a unique filename for an author
 */
function getAvatarFilename(authorName) {
    const normalized = authorName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${normalized}.png`;
}

/**
 * Check if avatar exists in cache
 */
async function getCachedAvatar(authorName) {
    try {
        const cacheKey = AVATAR_CACHE_KEY + authorName.toLowerCase();
        const cachedPath = await AsyncStorage.getItem(cacheKey);

        if (cachedPath) {
            const fileInfo = await FileSystem.getInfoAsync(cachedPath);
            if (fileInfo.exists) {
                return cachedPath;
            }
        }
        return null;
    } catch (error) {
        console.error('Error checking cached avatar:', error);
        return null;
    }
}

/**
 * Save avatar to cache
 */
async function cacheAvatar(authorName, filePath) {
    try {
        const cacheKey = AVATAR_CACHE_KEY + authorName.toLowerCase();
        await AsyncStorage.setItem(cacheKey, filePath);
    } catch (error) {
        console.error('Error caching avatar:', error);
    }
}

/**
 * Generate author avatar using Gemini Imagen REST API
 * @param {string} authorName - Name of the author
 * @returns {Promise<string|null>} - Local file path to generated avatar or null
 */
export async function generateAuthorAvatar(authorName) {
    try {
        // Check cache first
        const cachedPath = await getCachedAvatar(authorName);
        if (cachedPath) {
            console.log(`Using cached avatar for ${authorName}`);
            return cachedPath;
        }

        console.log(`Generating new avatar for ${authorName}...`);

        // Ensure directory exists
        await ensureAvatarDirectory();

        // Create the prompt for pen-and-ink sketch style
        const prompt = `Portrait of ${authorName}, detailed pen and ink sketch style, classical engraving technique, cross-hatching shading, pure white background, black and white only, historical figure portrait, Renaissance engraving style, highly detailed facial features, traditional illustration, etching art style, no color, monochrome, professional historical portrait, 1024x1024`;

        // Call Gemini Flash Image API
        const response = await fetch(IMAGEN_API_URL, {
            method: 'POST',
            headers: {
                'x-goog-api-key': GEMINI_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini Image API error:', errorText);
            return null;
        }

        const data = await response.json();

        // Extract base64 image from response
        // Gemini returns images in inlineData format (usually in parts[1])
        const parts = data.candidates?.[0]?.content?.parts;
        if (!parts) {
            console.error('No parts in Gemini response:', data);
            return null;
        }

        // Find the part with inlineData (could be in any part)
        const imagePart = parts.find(part => part.inlineData);
        if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
            console.error('No image data in Gemini response:', data);
            return null;
        }

        const base64Image = imagePart.inlineData.data;

            // Save to file
            const filename = getAvatarFilename(authorName);
            const filePath = AVATAR_DIR + filename;

            await FileSystem.writeAsStringAsync(filePath, base64Image, {
                encoding: FileSystem.EncodingType.Base64,
            });

        // Cache the path
        await cacheAvatar(authorName, filePath);

        console.log(`Avatar generated and cached for ${authorName}`);
        return filePath;

    } catch (error) {
        console.error('Error generating avatar:', error);
        return null;
    }
}

/**
 * Clear all cached avatars
 */
export async function clearAvatarCache() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const avatarKeys = keys.filter(key => key.startsWith(AVATAR_CACHE_KEY));
        await AsyncStorage.multiRemove(avatarKeys);

        // Remove directory and files
        const dirInfo = await FileSystem.getInfoAsync(AVATAR_DIR);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(AVATAR_DIR, { idempotent: true });
        }

        console.log('Avatar cache cleared');
    } catch (error) {
        console.error('Error clearing avatar cache:', error);
    }
}

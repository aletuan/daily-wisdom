import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { generateAuthorAvatar } from '../services/avatarGenerationService';

// Avatar mapping - normalize author names to static image files
const AVATAR_MAP = {
    'soren kierkegaard': require('../../assets/avatars/soren-kierkegaard.png'),
    'søren kierkegaard': require('../../assets/avatars/soren-kierkegaard.png'),
    'marcus aurelius': require('../../assets/avatars/marcus-aurelius.png'),
};

const PLACEHOLDER = require('../../assets/avatars/placeholder-avatar.png');

export default function AuthorAvatar({ authorName }) {
    const [avatarUri, setAvatarUri] = useState(null);
    const [loading, setLoading] = useState(false);

    // Normalize author name for lookup
    const normalizedName = authorName?.toLowerCase().trim();
    const staticAvatar = AVATAR_MAP[normalizedName];

    useEffect(() => {
        async function loadAvatar() {
            // If we have a static avatar, use it immediately
            if (staticAvatar) {
                return;
            }

            // Try to generate/load avatar for unknown authors
            setLoading(true);
            try {
                const generatedPath = await generateAuthorAvatar(authorName);
                if (generatedPath) {
                    setAvatarUri(generatedPath);
                }
            } catch (error) {
                console.error('Failed to load avatar:', error);
            } finally {
                setLoading(false);
            }
        }

        loadAvatar();
    }, [authorName, staticAvatar]);

    // Determine which source to use
    const getImageSource = () => {
        if (staticAvatar) {
            return staticAvatar;
        }
        if (avatarUri) {
            return { uri: avatarUri };
        }
        return PLACEHOLDER;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#7A9B88" />
                </View>
            ) : (
                <Image
                    source={getImageSource()}
                    style={styles.avatar}
                    resizeMode="contain"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 160,
        marginRight: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Match page background
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

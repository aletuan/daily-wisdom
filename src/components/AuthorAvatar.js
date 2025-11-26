import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// Avatar mapping - normalize author names to image files
const AVATAR_MAP = {
    'soren kierkegaard': require('../../assets/avatars/soren-kierkegaard.png'),
    'søren kierkegaard': require('../../assets/avatars/soren-kierkegaard.png'),
    'marcus aurelius': require('../../assets/avatars/marcus-aurelius.png'),
    // Common variations
    'eleanor roosevelt': require('../../assets/avatars/placeholder-avatar.png'), // Temporary placeholder
    'w.b. yeats': require('../../assets/avatars/placeholder-avatar.png'), // Temporary placeholder
    'ralph waldo emerson': require('../../assets/avatars/placeholder-avatar.png'), // Temporary placeholder
};

const PLACEHOLDER = require('../../assets/avatars/placeholder-avatar.png');

export default function AuthorAvatar({ authorName }) {
    // Normalize author name for lookup
    const normalizedName = authorName?.toLowerCase().trim();
    const avatarSource = AVATAR_MAP[normalizedName];

    // If no avatar found, use placeholder
    const source = avatarSource || PLACEHOLDER;

    return (
        <View style={styles.container}>
            <Image
                source={source}
                style={styles.avatar}
                resizeMode="contain"
            />
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
});

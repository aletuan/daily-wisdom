import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';

export default function ProfileIcon({ nickname, onPress }) {
    const firstLetter = nickname ? nickname.charAt(0).toUpperCase() : '?';

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View style={styles.container}>
                <Text style={styles.letter}>{firstLetter}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

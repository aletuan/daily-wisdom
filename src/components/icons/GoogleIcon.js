import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GoogleIcon({ size = 20 }) {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.icon, { fontSize: size * 0.65 }]}>G</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontWeight: 'bold',
        color: '#4285F4', // Google blue
    },
});

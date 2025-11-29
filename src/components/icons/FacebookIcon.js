import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FacebookIcon({ size = 20 }) {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={[styles.icon, { fontSize: size * 0.7 }]}>f</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1877F2', // Facebook blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

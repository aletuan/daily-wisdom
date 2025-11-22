import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    const handlePress = () => {
        navigation.navigate('Quote');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Youth Wisdom</Text>
                <Text style={styles.subtitle}>Your daily guide to navigating life's journey.</Text>

                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Start Your Journey</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Soft Off-White
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 30,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#2E7D32', // Darker Green for title
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: '#546E7A', // Blue Grey for subtitle
        marginBottom: 50,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#81C784', // Sage Green
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30, // More rounded
        elevation: 4,
        shadowColor: '#81C784',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

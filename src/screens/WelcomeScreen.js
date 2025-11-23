import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

export default function WelcomeScreen({ navigation }) {
    const handlePress = () => {
        navigation.navigate('Onboarding');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.title, TYPOGRAPHY.h1]}>Youth Wisdom</Text>
                <Text style={[styles.subtitle, TYPOGRAPHY.body]}>Your daily guide to navigating life's journey.</Text>

                <Image
                    source={require('../../assets/welcome-image.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={[styles.buttonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>Start Your Journey</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white, // White background
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
        color: COLORS.textMain, // Darker Green for title
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.textSecondary, // Blue Grey for subtitle
        marginBottom: 30,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 40,
    },
    button: {
        backgroundColor: COLORS.sageGreen, // Sage Green
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30, // More rounded
        elevation: 4,
        shadowColor: COLORS.sageGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { WELCOME_CONTENT } from '../data/welcomeContent';

export default function WelcomeScreen({ navigation }) {
    const [language, setLanguage] = useState('en');

    const handlePress = () => {
        navigation.navigate('Onboarding', { language });
    };

    const t = WELCOME_CONTENT[language];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.languageToggle}>
                    <TouchableOpacity onPress={() => setLanguage('en')}>
                        <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
                    </TouchableOpacity>
                    <Text style={styles.langDivider}>|</Text>
                    <TouchableOpacity onPress={() => setLanguage('vi')}>
                        <Text style={[styles.langText, language === 'vi' && styles.langTextActive]}>VI</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, TYPOGRAPHY.h1]}>{t.title}</Text>
                <Text style={[styles.subtitle, TYPOGRAPHY.body]}>{t.subtitle}</Text>

                <Image
                    source={require('../../assets/welcome-image.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={[styles.buttonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>{t.start}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    topBar: {
        paddingHorizontal: 24,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    languageToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    langText: {
        fontSize: 16,
        color: COLORS.lightGrey,
        fontWeight: '600',
        paddingHorizontal: 4,
    },
    langTextActive: {
        color: COLORS.darkGreen,
        fontWeight: 'bold',
    },
    langDivider: {
        fontSize: 16,
        color: COLORS.lightGrey,
        marginHorizontal: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginBottom: 20,
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { EMOTION_CONTENT } from '../data/emotionContent';
import EmotionSlider from '../components/EmotionSlider';
import ProfileIcon from '../components/ProfileIcon';
import { getUserProfile, onAuthStateChange } from '../services/authService';

export default function EmotionScreen({ route, navigation }) {
    const { context, language = 'en' } = route.params;
    const t = EMOTION_CONTENT[language];
    const [overwhelmedHopeful, setOverwhelmedHopeful] = useState(50);
    const [stuckProgress, setStuckProgress] = useState(50);

    const handleContinue = () => {
        navigation.navigate('Wisdom', {
            context,
            language,
            emotions: {
                overwhelmedHopeful,
                stuckProgress,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.question, TYPOGRAPHY.h2]}>{t.question}</Text>

                <View style={styles.slidersContainer}>
                    <EmotionSlider
                        leftLabel={t.overwhelmed}
                        rightLabel={t.hopeful}
                        value={overwhelmedHopeful}
                        onValueChange={setOverwhelmedHopeful}
                    />

                    <EmotionSlider
                        leftLabel={t.stuck}
                        rightLabel={t.makingProgress}
                        value={stuckProgress}
                        onValueChange={setStuckProgress}
                    />
                </View>

                <Text style={[styles.hint, TYPOGRAPHY.caption, { fontStyle: 'italic' }]}>
                    {t.hint}
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.continueButtonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>{t.continue}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 32,
    },
    question: {
        fontSize: 21,
        fontWeight: '500',
        color: '#5A6B5E',
        marginBottom: 40,
        lineHeight: 30,
        letterSpacing: -0.3,
    },
    slidersContainer: {
        marginBottom: 24,
    },
    hint: {
        fontSize: 14,
        color: '#8B8A84',
        fontStyle: 'italic',
        textAlign: 'center',
        fontWeight: '400',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
    },
    continueButton: {
        backgroundColor: '#7A9B88',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
});

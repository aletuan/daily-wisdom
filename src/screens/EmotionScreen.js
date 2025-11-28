import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { EMOTION_CONTENT } from '../data/emotionContent';
import EmotionSlider from '../components/EmotionSlider';

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
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 40,
        lineHeight: 30,
    },
    slidersContainer: {
        marginBottom: 24,
    },
    hint: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    continueButton: {
        backgroundColor: '#333333',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

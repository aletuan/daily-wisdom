import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import EmotionSlider from '../components/EmotionSlider';

export default function EmotionScreen({ route, navigation }) {
    const { context } = route.params;
    const [overwhelmedHopeful, setOverwhelmedHopeful] = useState(50);
    const [stuckProgress, setStuckProgress] = useState(50);

    const handleContinue = () => {
        navigation.navigate('Wisdom', {
            context,
            emotions: {
                overwhelmedHopeful,
                stuckProgress,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.question, TYPOGRAPHY.h2]}>And how are you feeling about this right now?</Text>

                <View style={styles.slidersContainer}>
                    <EmotionSlider
                        leftLabel="Overwhelmed"
                        rightLabel="Hopeful"
                        value={overwhelmedHopeful}
                        onValueChange={setOverwhelmedHopeful}
                    />

                    <EmotionSlider
                        leftLabel="Stuck"
                        rightLabel="Making progress"
                        value={stuckProgress}
                        onValueChange={setStuckProgress}
                    />
                </View>

                <Text style={[styles.hint, TYPOGRAPHY.caption, { fontStyle: 'italic' }]}>
                    There's no right answer here. Just be honest with yourself.
                </Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.continueButtonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.softOffWhite,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 40,
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
        backgroundColor: COLORS.softOffWhite,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    continueButton: {
        backgroundColor: COLORS.sageGreen,
        paddingVertical: 18,
        borderRadius: 30,
        elevation: 4,
        shadowColor: COLORS.sageGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

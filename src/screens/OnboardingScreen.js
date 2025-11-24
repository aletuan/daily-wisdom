import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { ONBOARDING_OPTIONS } from '../data/onboardingOptions';
import OptionButton from '../components/OptionButton';
import SelectionCard from '../components/SelectionCard';
import DirectionIcon from '../components/icons/DirectionIcon';
import HabitIcon from '../components/icons/HabitIcon';
import StressIcon from '../components/icons/StressIcon';
import GrowthIcon from '../components/icons/GrowthIcon';

const ICONS = {
    direction: DirectionIcon,
    habits: HabitIcon,
    stress: StressIcon,
    growth: GrowthIcon,
};

export default function OnboardingScreen({ navigation }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [customText, setCustomText] = useState('');
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        if (selectedOption === 'custom') {
            // Small timeout to ensure component is mounted and layout is ready
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [selectedOption]);

    const handleContinue = () => {
        const context = selectedOption === 'custom' ? customText :
            ONBOARDING_OPTIONS.find(opt => opt.id === selectedOption)?.label;

        if (context) {
            navigation.navigate('Emotion', { context });
        }
    };

    const isCustomSelected = selectedOption === 'custom';
    const canContinue = selectedOption && (!isCustomSelected || customText.trim().length > 0);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={headerHeight}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={[styles.content, isCustomSelected && { paddingBottom: 200 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={[styles.greeting, TYPOGRAPHY.h2]}>Hi, I'm here to walk with you on your journey.</Text>

                <Text style={[styles.question, TYPOGRAPHY.body]}>Let's start simple - what brings you here today?</Text>

                <View style={styles.gridContainer}>
                    {ONBOARDING_OPTIONS.filter(opt => opt.id !== 'custom').map((option) => (
                        <SelectionCard
                            key={option.id}
                            label={option.label}
                            icon={ICONS[option.id]}
                            selected={selectedOption === option.id}
                            onPress={() => setSelectedOption(option.id)}
                        />
                    ))}
                </View>

                <View style={styles.customOptionContainer}>
                    <OptionButton
                        label={ONBOARDING_OPTIONS.find(opt => opt.id === 'custom').label}
                        selected={selectedOption === 'custom'}
                        onPress={() => setSelectedOption('custom')}
                        variant="solid" // Keep solid style for consistency or change if needed
                    />
                </View>

                {isCustomSelected && (
                    <TextInput
                        ref={inputRef}
                        style={[styles.customInput, TYPOGRAPHY.body]}
                        placeholder="Whatever you need to share..."
                        placeholderTextColor={COLORS.blueGrey}
                        value={customText}
                        onChangeText={setCustomText}
                        onFocus={() => setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300)}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!canContinue}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.continueButtonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingTop: 40,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 16,
        lineHeight: 32,
    },
    question: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginBottom: 32,
        lineHeight: 26,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    customOptionContainer: {
        marginBottom: 20,
    },
    customInput: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: COLORS.textMain,
        borderWidth: 2,
        borderColor: COLORS.sageGreen,
        minHeight: 120,
        marginTop: 8,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
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
    continueButtonDisabled: {
        backgroundColor: COLORS.lightGrey,
        elevation: 0,
        shadowOpacity: 0,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

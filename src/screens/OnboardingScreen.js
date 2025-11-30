import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { FONTS, TYPOGRAPHY } from '../styles/typography';
import { getOnboardingOptions } from '../data/onboardingOptions';
import { ONBOARDING_CONTENT } from '../data/onboardingContent';
import OptionButton from '../components/OptionButton';
import SelectionCard from '../components/SelectionCard';
import DirectionIcon from '../components/icons/DirectionIcon';
import HabitIcon from '../components/icons/HabitIcon';
import StressIcon from '../components/icons/StressIcon';
import GrowthIcon from '../components/icons/GrowthIcon';
import ProfileIcon from '../components/ProfileIcon';
import { getUserProfile, onAuthStateChange } from '../services/authService';

const ICONS = {
    direction: DirectionIcon,
    habits: HabitIcon,
    stress: StressIcon,
    growth: GrowthIcon,
};

export default function OnboardingScreen({ navigation, route }) {
    const language = route.params?.language || 'en';
    const t = ONBOARDING_CONTENT[language];
    const options = getOnboardingOptions(language);

    const [selectedOption, setSelectedOption] = useState(null);
    const [customText, setCustomText] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const scrollViewRef = useRef(null);
    const inputRef = useRef(null);
    const headerHeight = useHeaderHeight();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    useEffect(() => {
        if (selectedOption === 'custom') {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            // Small timeout to ensure component is mounted and layout is ready
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [selectedOption]);

    useEffect(() => {
        loadUserProfile();

        // Listen for auth state changes
        const { data: authListener } = onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                loadUserProfile();
            } else if (event === 'SIGNED_OUT') {
                setUserProfile(null);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    // Reload profile when screen comes into focus (e.g., after uploading avatar)
    useFocusEffect(
        React.useCallback(() => {
            loadUserProfile();
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                userProfile ? (
                    <View style={{ marginRight: 16 }}>
                        <ProfileIcon
                            nickname={userProfile.nickname}
                            avatarUrl={userProfile.avatar_url}
                            onPress={() => {
                                navigation.navigate('Profile', { language });
                            }}
                        />
                    </View>
                ) : null,
        });
    }, [userProfile, navigation]);

    const loadUserProfile = async () => {
        const { profile, error } = await getUserProfile();
        if (profile && !error) {
            setUserProfile(profile);
        }
    };

    const handleOptionSelect = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedOption(id);
    };

    const handleBackToOptions = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedOption(null);
        setCustomText('');
    };

    const handleContinue = () => {
        const context = selectedOption === 'custom' ? customText :
            options.find(opt => opt.id === selectedOption)?.label;

        if (context) {
            navigation.navigate('Emotion', { context, language });
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
                {!isCustomSelected && (
                    <>
                        <Text style={[styles.greeting, TYPOGRAPHY.h2]}>{t.greeting}</Text>
                        <Text style={[styles.question, TYPOGRAPHY.body]}>{t.question}</Text>

                        <View style={styles.gridContainer}>
                            {options.filter(opt => opt.id !== 'custom').map((option) => (
                                <SelectionCard
                                    key={option.id}
                                    label={option.label}
                                    icon={ICONS[option.id]}
                                    selected={selectedOption === option.id}
                                    onPress={() => handleOptionSelect(option.id)}
                                />
                            ))}
                        </View>

                        <View style={styles.customOptionContainer}>
                            <OptionButton
                                label={options.find(opt => opt.id === 'custom').label}
                                selected={selectedOption === 'custom'}
                                onPress={() => handleOptionSelect('custom')}
                                variant="solid"
                            />
                        </View>
                    </>
                )}

                {isCustomSelected && (
                    <View style={styles.zenContainer}>
                        <TouchableOpacity onPress={handleBackToOptions} style={styles.backLink}>
                            <Text style={styles.backLinkText}>{t.backToOptions}</Text>
                        </TouchableOpacity>

                        <TextInput
                            ref={inputRef}
                            style={[styles.zenInput, { fontFamily: FONTS.serif.regular }]}
                            placeholder={t.customPlaceholder}
                            placeholderTextColor={COLORS.lightGrey}
                            value={customText}
                            onChangeText={setCustomText}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
                    onPress={handleContinue}
                    disabled={!canContinue}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.continueButtonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>{t.continue}</Text>
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
        paddingTop: 32,
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
    zenContainer: {
        flex: 1,
        minHeight: 300,
    },
    backLink: {
        marginBottom: 24,
        alignSelf: 'flex-start',
    },
    backLinkText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontFamily: FONTS.sans.regular,
    },
    zenInput: {
        fontSize: 24,
        color: COLORS.textMain,
        lineHeight: 34,
        minHeight: 200,
        padding: 0,
        textAlignVertical: 'top',
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
    continueButtonDisabled: {
        backgroundColor: COLORS.lightGrey,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

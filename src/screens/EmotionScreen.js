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
    const [userProfile, setUserProfile] = useState(null);

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

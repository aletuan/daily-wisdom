import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { generatePersonalizedWisdom } from '../services/claudeService';
import { WISDOM_CONTENT } from '../data/wisdomContent';
import AuthorAvatar from '../components/AuthorAvatar';
import AuthModal from '../components/AuthModal';
import ProfileIcon from '../components/ProfileIcon';
import { getUserProfile, onAuthStateChange } from '../services/authService';

const ActivityItem = ({ text }) => {
    const [checked, setChecked] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.activityItem, checked && styles.activityItemChecked]}
            onPress={() => setChecked(!checked)}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.activityText, checked && styles.activityTextChecked]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default function WisdomScreen({ route, navigation }) {
    const { context, emotions, language = 'en' } = route.params;
    const t = WISDOM_CONTENT[language];
    const [wisdom, setWisdom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const authModalOpenedRef = useRef(false);

    useEffect(() => {
        loadWisdom();
        loadUserProfile();

        // Listen for auth state changes
        const { data: authListener } = onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                loadUserProfile();

                // Navigate to profile if auth modal was opened from this screen
                if (event === 'SIGNED_IN' && authModalOpenedRef.current) {
                    authModalOpenedRef.current = false;
                    setShowAuthModal(false);
                    navigation.navigate('Profile', { language });
                }
            } else if (event === 'SIGNED_OUT') {
                setUserProfile(null);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [language, navigation]);

    // Reload profile when screen comes into focus (e.g., after uploading avatar)
    useFocusEffect(
        React.useCallback(() => {
            loadUserProfile();
        }, [])
    );

    // Update navigation header when userProfile changes
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

    const loadWisdom = async () => {
        setLoading(true);
        setError(null);
        // Reset animation
        fadeAnim.setValue(0);
        slideAnim.setValue(20);

        try {
            const result = await generatePersonalizedWisdom(context, emotions, language);
            setWisdom(result);

            // Trigger animation after a brief delay to ensure render
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 100);

        } catch (err) {
            console.error('Error generating wisdom:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.header, TYPOGRAPHY.h3]}>{t.header}</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.sageGreen} />
                        <Text style={[styles.loadingText, TYPOGRAPHY.body]}>{t.loading}</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadWisdom}>
                            <Text style={styles.retryButtonText}>{t.retry}</Text>
                        </TouchableOpacity>
                    </View>
                ) : wisdom && (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }}
                    >
                        <View style={styles.wisdomContainer}>
                            <AuthorAvatar authorName={wisdom.author} />
                            <View style={styles.quoteContent}>
                                <Text style={[styles.quoteText, TYPOGRAPHY.quote]}>"{wisdom.text}"</Text>
                                <Text style={[styles.authorText, TYPOGRAPHY.h3]}>- {wisdom.author}</Text>
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>{t.whyThis}</Text>
                            <Text style={[styles.whyThisText, TYPOGRAPHY.body]}>{wisdom.why_this}</Text>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>{t.steps}</Text>
                            <View style={styles.activitiesContainer}>
                                {wisdom.activities?.map((activity, index) => (
                                    <ActivityItem key={index} text={activity} />
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {wisdom && !loading && !error && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                            if (userProfile) {
                                // User is logged in - implement save functionality
                                // TODO: Implement actual save to favorites functionality
                                console.log('Save to favorites:', wisdom);
                            } else {
                                // User not logged in - show auth modal
                                authModalOpenedRef.current = true;
                                setShowAuthModal(true);
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>{t.saveToFavorites || 'Save to Favorites'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                language={language}
            />
        </View>
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
        paddingBottom: 24,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.sageGreen,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    wisdomContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    quoteContent: {
        flex: 1,
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: COLORS.textMain,
        lineHeight: 24,
        marginBottom: 8,
    },
    authorText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'right',
    },
    sectionContainer: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 12,
    },
    whyThisText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 26,
    },
    activitiesContainer: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
    },
    activityItemChecked: {
        backgroundColor: '#F5F5F5', // Light gray
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#BEBEBE',
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#BEBEBE',
        borderColor: '#BEBEBE',
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    activityText: {
        fontSize: 16,
        color: COLORS.textMain,
        flex: 1,
    },
    activityTextChecked: {
        // Keep text color unchanged when checked
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    saveButton: {
        backgroundColor: '#333333',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

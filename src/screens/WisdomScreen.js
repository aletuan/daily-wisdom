import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Animated, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { generatePersonalizedWisdom } from '../services/claudeService';
import { WISDOM_CONTENT } from '../data/wisdomContent';
import { FAVORITES_CONTENT } from '../data/favoritesContent';
import AuthorAvatar from '../components/AuthorAvatar';
import AuthModal from '../components/AuthModal';
import ProfileIcon from '../components/ProfileIcon';
import { getUserProfile, onAuthStateChange, saveFavorite } from '../services/authService';
import { useUser } from '../contexts/UserContext';

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
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const authModalOpenedRef = useRef(false);

    useEffect(() => {
        loadWisdom();

        // Listen for auth state changes
        const { data: authListener } = onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                // Navigate to profile if auth modal was opened from this screen
                if (event === 'SIGNED_IN' && authModalOpenedRef.current) {
                    authModalOpenedRef.current = false;
                    setShowAuthModal(false);
                    navigation.navigate('Profile', { language });
                }
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [language, navigation]);

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

    const { userProfile } = useUser(); // Get userProfile from context

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
                        onPress={async () => {
                            if (userProfile) {
                                // User is logged in - save to favorites
                                try {
                                    const { favorite, error } = await saveFavorite(
                                        wisdom,
                                        context,
                                        emotions,
                                        language
                                    );

                                    if (error) {
                                        Alert.alert(
                                            language === 'en' ? 'Error' : 'Lỗi',
                                            FAVORITES_CONTENT[language].saveError
                                        );
                                        return;
                                    }

                                    Alert.alert(
                                        FAVORITES_CONTENT[language].saved,
                                        FAVORITES_CONTENT[language].savedDesc,
                                        [
                                            {
                                                text: FAVORITES_CONTENT[language].viewFavorites,
                                                onPress: () => navigation.navigate('Favorites', { language })
                                            },
                                            {
                                                text: FAVORITES_CONTENT[language].ok,
                                                style: 'cancel'
                                            }
                                        ]
                                    );
                                } catch (err) {
                                    console.error('Save favorite error:', err);
                                    Alert.alert(
                                        language === 'en' ? 'Error' : 'Lỗi',
                                        FAVORITES_CONTENT[language].saveError
                                    );
                                }
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
        fontSize: 19,
        fontWeight: '500',
        color: '#5A6B5E',
        marginBottom: 24,
        letterSpacing: -0.3,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#8B8A84',
        fontWeight: '400',
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 15,
        color: '#8B8A84',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '400',
    },
    retryButton: {
        backgroundColor: '#7A9B88',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '500',
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
        fontSize: 15,
        fontStyle: 'italic',
        color: '#5A6B5E',
        lineHeight: 24,
        marginBottom: 8,
        fontWeight: '400',
    },
    authorText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8B8A84',
        textAlign: 'right',
    },
    sectionContainer: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    sectionHeader: {
        fontSize: 17,
        fontWeight: '500',
        color: '#5A6B5E',
        marginBottom: 12,
        letterSpacing: -0.2,
    },
    whyThisText: {
        fontSize: 15,
        color: '#7E6E5F',
        lineHeight: 26,
        fontWeight: '400',
    },
    activitiesContainer: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F7F5',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEAE5',
    },
    activityItemChecked: {
        backgroundColor: '#F0EBE6',
        borderColor: '#D4C7BA',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#B8CFC0',
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#7A9B88',
        borderColor: '#7A9B88',
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: 'bold',
    },
    activityText: {
        fontSize: 15,
        color: '#5A6B5E',
        flex: 1,
        fontWeight: '400',
        lineHeight: 22,
    },
    activityTextChecked: {
        // Keep text color unchanged when checked
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
    },
    saveButton: {
        backgroundColor: '#7A9B88',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});

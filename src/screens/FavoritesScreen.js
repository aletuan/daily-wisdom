import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { FONTS } from '../styles/typography';
import { FAVORITES_CONTENT } from '../data/favoritesContent';
import { getFavorites, getFavoritesByDate, deleteFavorite, getUserProfile, onAuthStateChange } from '../services/authService';
import AuthorAvatar from '../components/AuthorAvatar';
import ProfileIcon from '../components/ProfileIcon';
import WisdomDetailModal from '../components/WisdomDetailModal';

export default function FavoritesScreen({ route, navigation }) {
    const { language = 'en' } = route.params || {};
    const t = FAVORITES_CONTENT[language];

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        loadFavorites();
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

    // Reload profile when screen comes into focus
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

    const loadFavorites = async () => {
        setLoading(true);
        setError(null);

        try {
            const { favorites: data, error: fetchError } = await getFavorites();

            if (fetchError) {
                setError(t.loadError);
                console.error('Load favorites error:', fetchError);
                return;
            }

            setFavorites(data);
        } catch (err) {
            console.error('Load favorites error:', err);
            setError(t.loadError);
        } finally {
            setLoading(false);
        }
    };

    const loadUserProfile = async () => {
        const { profile, error } = await getUserProfile();
        if (profile && !error) {
            setUserProfile(profile);
        }
    };

    // Build marked dates object for calendar
    const markedDates = useMemo(() => {
        const marked = {};
        const today = new Date().toISOString().split('T')[0];

        favorites.forEach(fav => {
            const date = new Date(fav.saved_at).toISOString().split('T')[0];
            marked[date] = {
                marked: true,
                dotColor: COLORS.darkGreen,
            };
        });

        // Add today indicator
        if (marked[today]) {
            marked[today] = {
                ...marked[today],
                selected: true,
                selectedColor: COLORS.sageGreen,
            };
        } else {
            marked[today] = {
                selected: true,
                selectedColor: COLORS.sageGreen,
            };
        }

        return marked;
    }, [favorites]);

    // Get 5 most recent favorites
    const recentFavorites = useMemo(() => {
        return favorites.slice(0, 5);
    }, [favorites]);

    const handleDatePress = async (day) => {
        const { favorites: dayFavorites, error: fetchError } = await getFavoritesByDate(day.dateString);

        if (fetchError) {
            console.error('Get favorites by date error:', fetchError);
            return;
        }

        if (dayFavorites.length > 0) {
            // Show the first (most recent) favorite for that date
            setSelectedFavorite(dayFavorites[0]);
            setShowDetailModal(true);
        }
    };

    const handleFavoritePress = (favorite) => {
        setSelectedFavorite(favorite);
        setShowDetailModal(true);
    };

    const handleDelete = async (favoriteId) => {
        const { error: deleteError } = await deleteFavorite(favoriteId);

        if (deleteError) {
            console.error('Delete favorite error:', deleteError);
            return;
        }

        // Reload favorites to update UI
        loadFavorites();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.sageGreen} />
                    <Text style={[styles.loadingText, TYPOGRAPHY.body]}>
                        {t.loading}
                    </Text>
                </View>
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyTitle, TYPOGRAPHY.h2]}>
                        {t.emptyState}
                    </Text>
                    <Text style={[styles.emptyDesc, TYPOGRAPHY.body]}>
                        {t.emptyStateDesc}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Fixed Calendar */}
            <Calendar
                current={new Date().toISOString().split('T')[0]}
                markedDates={markedDates}
                onDayPress={handleDatePress}
                theme={{
                    calendarBackground: COLORS.white,
                    textSectionTitleColor: COLORS.textSecondary,
                    selectedDayBackgroundColor: COLORS.sageGreen,
                    selectedDayTextColor: COLORS.white,
                    todayTextColor: COLORS.sageGreen,
                    dayTextColor: COLORS.textMain,
                    textDisabledColor: '#BEBEBE',
                    dotColor: COLORS.darkGreen,
                    selectedDotColor: COLORS.white,
                    arrowColor: COLORS.textMain,
                    monthTextColor: COLORS.textMain,
                    textDayFontFamily: FONTS.sans.regular,
                    textMonthFontFamily: FONTS.serif.semiBold,
                    textDayHeaderFontFamily: FONTS.sans.semiBold,
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
            />

            {/* Hint Text */}
            <Text style={[styles.hintText, TYPOGRAPHY.caption]}>
                {t.tapDateToView}
            </Text>

            {/* Recent Favorites Header */}
            <Text style={[styles.recentHeader, TYPOGRAPHY.h3]}>
                {t.recentFavorites}
            </Text>

            {/* Scrollable Recent Favorites List */}
            <ScrollView
                style={styles.recentScrollView}
                contentContainerStyle={styles.recentList}
                showsVerticalScrollIndicator={false}
            >
                {recentFavorites.map((favorite) => (
                    <TouchableOpacity
                        key={favorite.id}
                        style={styles.favoriteCard}
                        onPress={() => handleFavoritePress(favorite)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardRow}>
                            <AuthorAvatar authorName={favorite.author} />
                            <View style={styles.cardContent}>
                                <Text style={styles.quotePreview} numberOfLines={2}>
                                    "{favorite.text}"
                                </Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardAuthor}>
                                        - {favorite.author}
                                    </Text>
                                    <Text style={styles.cardDate}>
                                        {formatDate(favorite.saved_at)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Wisdom Detail Modal */}
            <WisdomDetailModal
                visible={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                favorite={selectedFavorite}
                language={language}
                onDelete={handleDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.textMain,
        marginBottom: 16,
        textAlign: 'center',
    },
    emptyDesc: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    calendar: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    hintText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingVertical: 16,
        fontStyle: 'italic',
    },
    recentHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    recentScrollView: {
        flex: 1,
    },
    recentList: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    favoriteCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
    quotePreview: {
        fontSize: 15,
        color: COLORS.textMain,
        lineHeight: 22,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardAuthor: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    cardDate: {
        fontSize: 12,
        color: COLORS.lightGrey,
    },
});

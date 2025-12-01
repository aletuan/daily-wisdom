import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { WELCOME_CONTENT } from '../data/welcomeContent';
import AuthModal from '../components/AuthModal';
import { onAuthStateChange, getUserProfile } from '../services/authService';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
    const [language, setLanguage] = useState('en');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const authModalOpenedRef = useRef(false);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadUserProfile();

        // Listen for auth state changes
        const { data: authListener } = onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                loadUserProfile();
                setShowAuthModal(false);  // Close modal on successful sign in

                // Navigate to onboarding if auth modal was opened from this screen
                if (authModalOpenedRef.current) {
                    authModalOpenedRef.current = false;
                    navigation.navigate('Onboarding', { language });
                }
            } else if (event === 'SIGNED_OUT') {
                setUserProfile(null);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, [language, navigation]);

    const loadUserProfile = async () => {
        const { profile, error } = await getUserProfile();
        if (profile && !error) {
            setUserProfile(profile);
        }
    };

    const handlePress = () => {
        navigation.navigate('Onboarding', { language });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentSlide(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const t = WELCOME_CONTENT[language];

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselSlide}>
            <Text style={styles.carouselText}>{item.text}</Text>
        </View>
    );

    const renderPaginationDots = () => (
        <View style={styles.paginationContainer}>
            {t.carouselSlides.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.paginationDot,
                        index === currentSlide && styles.paginationDotActive,
                    ]}
                />
            ))}
        </View>
    );

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

                <FlatList
                    ref={flatListRef}
                    data={t.carouselSlides}
                    renderItem={renderCarouselItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    style={styles.carousel}
                    contentContainerStyle={styles.carouselContent}
                />
                {renderPaginationDots()}

                <Image
                    source={require('../../assets/welcome-image.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={[styles.buttonText, TYPOGRAPHY.body, { fontWeight: '600' }]}>{t.start}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInContainer}
                    onPress={() => {
                        authModalOpenedRef.current = true;
                        setShowAuthModal(true);
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.signInText}>
                        {t.hasAccount}{' '}
                        <Text style={styles.signInLink}>{t.signIn}</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <AuthModal
                visible={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                language={language}
                initialMode="signin"
            />
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
        backgroundColor: '#333333', // Dark gray button
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        alignSelf: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    signInContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    signInText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    signInLink: {
        color: COLORS.textMain,
        fontWeight: '600',
    },
    carousel: {
        flexGrow: 0,
        marginVertical: 20,
    },
    carouselContent: {
        alignItems: 'center',
    },
    carouselSlide: {
        width: width - 60,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
    },
    carouselText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.lightGrey,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: COLORS.darkGreen,
        width: 24,
    },
});

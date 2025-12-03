import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Compass, Sparkles, Heart, User } from 'lucide-react-native';
import { COLORS } from '../styles/colors';

export default function BottomNavigation({ navigation, language, currentScreen }) {
    return (
        <View style={styles.navigationBar}>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                    if (currentScreen !== 'Onboarding') {
                        navigation.navigate('Onboarding', { language });
                    }
                }}
                activeOpacity={0.7}
            >
                <Compass
                    size={24}
                    color={currentScreen === 'Onboarding' ? '#7A9B88' : '#C4C3BE'}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        currentScreen === 'Onboarding' && styles.navButtonActive,
                    ]}
                >
                    Explore
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                    if (currentScreen !== 'Onboarding') {
                        navigation.navigate('Onboarding', { language });
                    }
                }}
                activeOpacity={0.7}
            >
                <Sparkles
                    size={24}
                    color={currentScreen === 'Onboarding' ? '#7A9B88' : '#C4C3BE'}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        currentScreen === 'Onboarding' && styles.navButtonActive,
                    ]}
                >
                    Wisdom
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                    if (currentScreen !== 'Favorites') {
                        navigation.navigate('Favorites', { language });
                    }
                }}
                activeOpacity={0.7}
            >
                <Heart
                    size={24}
                    color={currentScreen === 'Favorites' ? '#7A9B88' : '#C4C3BE'}
                    fill={currentScreen === 'Favorites' ? '#7A9B88' : 'none'}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        currentScreen === 'Favorites' && styles.navButtonActive,
                    ]}
                >
                    Favorites
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                    if (currentScreen !== 'Profile') {
                        navigation.navigate('Profile', { language });
                    }
                }}
                activeOpacity={0.7}
            >
                <User
                    size={24}
                    color={currentScreen === 'Profile' ? '#7A9B88' : '#C4C3BE'}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        currentScreen === 'Profile' && styles.navButtonActive,
                    ]}
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: '#F0EBE6',
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navButtonText: {
        fontSize: 11,
        color: '#C4C3BE',
        marginTop: 4,
        fontWeight: '400',
    },
    navButtonActive: {
        color: '#7A9B88',
        fontWeight: '500',
    },
});

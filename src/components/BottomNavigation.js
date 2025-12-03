import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';

export default function BottomNavigation({ navigation, language, currentScreen }) {
    const handleNewWisdom = () => {
        // Navigate to Emotion screen with a generic context for getting new wisdom
        navigation.navigate('Emotion', {
            context: 'daily wisdom',
            language,
        });
    };

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
                <MaterialIcons
                    name="explore"
                    size={24}
                    color={currentScreen === 'Onboarding' ? COLORS.textMain : COLORS.lightGrey}
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
                onPress={handleNewWisdom}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name="auto-awesome"
                    size={24}
                    color={currentScreen === 'Emotion' ? COLORS.textMain : COLORS.lightGrey}
                />
                <Text
                    style={[
                        styles.navButtonText,
                        currentScreen === 'Emotion' && styles.navButtonActive,
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
                <MaterialIcons
                    name="favorite"
                    size={24}
                    color={currentScreen === 'Favorites' ? COLORS.textMain : COLORS.lightGrey}
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
                <MaterialIcons
                    name="person"
                    size={24}
                    color={currentScreen === 'Profile' ? COLORS.textMain : COLORS.lightGrey}
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
        borderTopColor: '#E0E0E0',
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navButtonText: {
        fontSize: 12,
        color: COLORS.lightGrey,
        marginTop: 4,
    },
    navButtonActive: {
        color: COLORS.textMain,
        fontWeight: '600',
    },
});

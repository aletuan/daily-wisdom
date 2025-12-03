import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

// Calm, muted color themes for each card
const COLOR_THEMES = {
    sage: {
        background: '#F5F7F5',
        border: '#E8EBE8',
        icon: '#7A9B88',
        text: '#5A6B5E',
        selectedBg: '#E8F0EB',
        selectedBorder: '#B8CFC0',
    },
    stone: {
        background: '#F7F7F6',
        border: '#E9E9E7',
        icon: '#8B8A84',
        text: '#5C5B57',
        selectedBg: '#EAEAE8',
        selectedBorder: '#C4C3BE',
    },
    sky: {
        background: '#F5F7F9',
        border: '#E7EBF0',
        icon: '#7B91A8',
        text: '#556B7E',
        selectedBg: '#E8EDF3',
        selectedBorder: '#B8C7D6',
    },
    warm: {
        background: '#F9F7F5',
        border: '#EFEAE5',
        icon: '#A89384',
        text: '#7E6E5F',
        selectedBg: '#F0EBE6',
        selectedBorder: '#D4C7BA',
    },
};

export default function SelectionCard({ label, icon: Icon, selected, onPress, colorTheme = 'sage' }) {
    const theme = COLOR_THEMES[colorTheme];

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: theme.background, borderColor: theme.border },
                selected && { backgroundColor: theme.selectedBg, borderColor: theme.selectedBorder }
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <Icon color={theme.icon} width={44} height={44} />
            </View>
            <Text style={[
                styles.text,
                { color: theme.text },
                selected && { fontWeight: '600' },
                TYPOGRAPHY.body
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        elevation: 1,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        width: '48%', // Approx half width for 2-column grid
        aspectRatio: 1, // Square shape
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 20,
    },
});

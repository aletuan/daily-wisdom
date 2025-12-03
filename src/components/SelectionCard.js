import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

// Color themes for each card
const COLOR_THEMES = {
    blue: {
        background: '#EFF6FF',
        border: '#DBEAFE',
        icon: '#3B82F6',
        text: '#1E40AF',
        selectedBg: '#3B82F6',
        selectedBorder: '#2563EB',
    },
    green: {
        background: '#F0FDF4',
        border: '#DCFCE7',
        icon: '#22C55E',
        text: '#166534',
        selectedBg: '#22C55E',
        selectedBorder: '#16A34A',
    },
    orange: {
        background: '#FFF7ED',
        border: '#FFEDD5',
        icon: '#F97316',
        text: '#C2410C',
        selectedBg: '#F97316',
        selectedBorder: '#EA580C',
    },
    purple: {
        background: '#FAF5FF',
        border: '#F3E8FF',
        icon: '#A855F7',
        text: '#7E22CE',
        selectedBg: '#A855F7',
        selectedBorder: '#9333EA',
    },
};

export default function SelectionCard({ label, icon: Icon, selected, onPress, colorTheme = 'blue' }) {
    const theme = COLOR_THEMES[colorTheme];

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: theme.background, borderColor: theme.border },
                selected && { backgroundColor: theme.selectedBg, borderColor: theme.selectedBorder }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Icon color={selected ? COLORS.white : theme.icon} width={48} height={48} />
            </View>
            <Text style={[
                styles.text,
                { color: theme.text },
                selected && styles.textSelected,
                TYPOGRAPHY.body
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        width: '48%', // Approx half width for 2-column grid
        aspectRatio: 1, // Square shape
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: COLORS.textMain,
        textAlign: 'center',
        fontWeight: '600',
    },
    textSelected: {
        color: COLORS.white,
    },
});

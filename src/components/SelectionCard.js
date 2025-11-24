import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

export default function SelectionCard({ label, icon: Icon, selected, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.card, selected && styles.cardSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Icon color={selected ? COLORS.white : COLORS.darkGreen} width={48} height={48} />
            </View>
            <Text style={[styles.text, selected && styles.textSelected, TYPOGRAPHY.body]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        width: '48%', // Approx half width for 2-column grid
        aspectRatio: 1, // Square shape
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardSelected: {
        backgroundColor: COLORS.sageGreen,
        borderColor: COLORS.sageGreen,
        elevation: 4,
        shadowOpacity: 0.15,
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

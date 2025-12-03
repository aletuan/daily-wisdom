import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

export default function OptionButton({ label, selected, onPress, variant = 'default' }) {
    const isRedVariant = variant === 'red';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isRedVariant && styles.buttonRed,
                selected && (isRedVariant ? styles.buttonRedSelected : styles.buttonSelected)
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.text,
                isRedVariant && styles.textRed,
                selected && (isRedVariant ? styles.textRedSelected : styles.textSelected),
                TYPOGRAPHY.body
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.white,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        elevation: 1,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    buttonSelected: {
        backgroundColor: COLORS.sageGreen,
        borderColor: COLORS.sageGreen,
        elevation: 3,
        shadowOpacity: 0.15,
    },
    text: {
        fontSize: 16,
        color: COLORS.textMain,
        textAlign: 'center',
        fontWeight: '500',
    },
    textSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },
    buttonRed: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
    },
    buttonRedSelected: {
        backgroundColor: '#FEE2E2',
        borderColor: '#FCA5A5',
        elevation: 3,
        shadowOpacity: 0.15,
    },
    textRed: {
        color: '#991B1B',
        fontWeight: '600',
    },
    textRedSelected: {
        color: '#DC2626',
        fontWeight: '700',
    },
});

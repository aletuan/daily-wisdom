import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export default function OptionButton({ label, selected, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.button, selected && styles.buttonSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.text, selected && styles.textSelected]}>
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
        color: COLORS.darkBlueGrey,
        textAlign: 'center',
        fontWeight: '500',
    },
    textSelected: {
        color: COLORS.white,
        fontWeight: '600',
    },
});

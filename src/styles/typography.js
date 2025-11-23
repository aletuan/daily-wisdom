import { StyleSheet } from 'react-native';

export const FONTS = {
    serif: {
        regular: 'Lora_400Regular',
        semiBold: 'Lora_600SemiBold',
        bold: 'Lora_700Bold',
    },
    sans: {
        regular: 'Inter_400Regular',
        semiBold: 'Inter_600SemiBold',
    },
};

export const TYPOGRAPHY = StyleSheet.create({
    h1: {
        fontFamily: FONTS.serif.bold,
        fontSize: 32,
        lineHeight: 40,
    },
    h2: {
        fontFamily: FONTS.serif.semiBold,
        fontSize: 24,
        lineHeight: 32,
    },
    h3: {
        fontFamily: FONTS.serif.semiBold,
        fontSize: 20,
        lineHeight: 28,
    },
    body: {
        fontFamily: FONTS.sans.regular,
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontFamily: FONTS.sans.regular,
        fontSize: 14,
        lineHeight: 20,
    },
    quote: {
        fontFamily: FONTS.serif.regular,
        fontSize: 24,
        lineHeight: 36,
        fontStyle: 'italic',
    },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';

export default function EmotionSlider({ leftLabel, rightLabel, value, onValueChange }) {
    return (
        <View style={styles.container}>
            <View style={styles.labelsContainer}>
                <Text style={[styles.label, TYPOGRAPHY.caption]}>{leftLabel}</Text>
                <Text style={[styles.label, TYPOGRAPHY.caption]}>{rightLabel}</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#000000"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
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
                minimumTrackTintColor="#7A9B88"
                maximumTrackTintColor="#E8EBE8"
                thumbTintColor="#7A9B88"
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
        fontSize: 13,
        color: '#8B8A84',
        fontWeight: '400',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

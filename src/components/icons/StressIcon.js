import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../../styles/colors';

export default function StressIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <Path d="M9 9h.01" />
            <Path d="M15 9h.01" />
        </Svg>
    );
}

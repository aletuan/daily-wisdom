import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../../styles/colors';

export default function DirectionIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="10" />
            <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
        </Svg>
    );
}

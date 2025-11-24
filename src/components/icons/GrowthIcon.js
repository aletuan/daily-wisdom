import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../styles/colors';

export default function GrowthIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 19V5" />
            <Path d="M5 12l7-7 7 7" />
        </Svg>
    );
}

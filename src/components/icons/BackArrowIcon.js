import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../styles/colors';

export default function BackArrowIcon({ color = COLORS.darkGreen, width = 24, height = 24 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15 19L8 12L15 5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

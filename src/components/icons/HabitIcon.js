import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../styles/colors';

export default function HabitIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 20h9" />
            <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </Svg>
    );
}

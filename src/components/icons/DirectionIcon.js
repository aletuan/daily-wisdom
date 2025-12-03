import React from 'react';
import { Compass } from 'lucide-react-native';
import { COLORS } from '../../styles/colors';

export default function DirectionIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return <Compass size={width} color={color} />;
}

import React from 'react';
import { Zap } from 'lucide-react-native';
import { COLORS } from '../../styles/colors';

export default function StressIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return <Zap size={width} color={color} />;
}

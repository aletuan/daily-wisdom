import React from 'react';
import { TrendingUp } from 'lucide-react-native';
import { COLORS } from '../../styles/colors';

export default function GrowthIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return <TrendingUp size={width} color={color} />;
}

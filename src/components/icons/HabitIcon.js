import React from 'react';
import { RefreshCw } from 'lucide-react-native';
import { COLORS } from '../../styles/colors';

export default function HabitIcon({ color = COLORS.darkGreen, width = 40, height = 40 }) {
    return <RefreshCw size={width} color={color} />;
}

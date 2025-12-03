import React from 'react';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../styles/colors';

export default function BackArrowIcon({ color = COLORS.darkGreen, width = 24, height = 24 }) {
    return <ChevronLeft size={width} color={color} />;
}

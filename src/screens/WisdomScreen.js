import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { COLORS } from '../styles/colors';
import { generatePersonalizedWisdom } from '../services/claudeService';

const ActivityItem = ({ text }) => {
    const [checked, setChecked] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.activityItem, checked && styles.activityItemChecked]}
            onPress={() => setChecked(!checked)}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.activityText, checked && styles.activityTextChecked]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

export default function WisdomScreen({ route, navigation }) {
    const { context, emotions } = route.params;
    const [wisdom, setWisdom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        loadWisdom();
    }, []);

    const loadWisdom = async () => {
        setLoading(true);
        setError(null);
        // Reset animation
        fadeAnim.setValue(0);
        slideAnim.setValue(20);

        try {
            const result = await generatePersonalizedWisdom(context, emotions);
            setWisdom(result);

            // Trigger animation after a brief delay to ensure render
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 100);

        } catch (err) {
            console.error('Error generating wisdom:', err);
            setError('Unable to generate wisdom right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.header}>Here's something for you today...</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.sageGreen} />
                        <Text style={styles.loadingText}>Curating wisdom...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadWisdom}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : wisdom && (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }}
                    >
                        <View style={styles.wisdomContainer}>
                            <Text style={styles.quoteText}>"{wisdom.text}"</Text>
                            <Text style={styles.authorText}>- {wisdom.author}</Text>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionHeader}>Why this today</Text>
                            <Text style={styles.whyThisText}>{wisdom.why_this}</Text>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionHeader}>Try these steps</Text>
                            <View style={styles.activitiesContainer}>
                                {wisdom.activities?.map((activity, index) => (
                                    <ActivityItem key={index} text={activity} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <Text style={styles.closingText}>
                            Take your time with this.{'\n'}
                            We'll come back with you {new Date().getHours() >= 18 ? 'tomorrow' : 'tonight'}.
                        </Text>
                    </Animated.View>
                )}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.softOffWhite,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingTop: 40,
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.blueGrey,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.sageGreen,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    wisdomContainer: {
        backgroundColor: COLORS.white,
        padding: 28,
        borderRadius: 20,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.sageGreen,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    quoteText: {
        fontSize: 24,
        fontStyle: 'italic',
        color: COLORS.darkBlueGrey,
        lineHeight: 36,
        marginBottom: 16,
    },
    authorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.sageGreen,
        textAlign: 'right',
    },
    sectionContainer: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 12,
    },
    whyThisText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        lineHeight: 26,
    },
    activitiesContainer: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    activityItemChecked: {
        backgroundColor: '#F0F7F0', // Very light green
        borderColor: COLORS.sageGreen,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.sageGreen,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.sageGreen,
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    activityText: {
        fontSize: 16,
        color: COLORS.darkBlueGrey,
        flex: 1,
    },
    activityTextChecked: {
        color: COLORS.sageGreen,
        textDecorationLine: 'line-through',
    },
    separator: {
        height: 2,
        backgroundColor: '#E0E0E0',
        width: '40%',
        alignSelf: 'center',
        marginBottom: 32,
        marginTop: 8,
    },
    closingText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        marginBottom: 40,
    },
});

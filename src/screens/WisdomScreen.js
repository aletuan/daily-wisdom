import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '../styles/colors';
import { generatePersonalizedWisdom } from '../services/claudeService';

export default function WisdomScreen({ route, navigation }) {
    const { context, emotions } = route.params;
    const [wisdom, setWisdom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWisdom();
    }, []);

    const loadWisdom = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await generatePersonalizedWisdom(context, emotions);
            setWisdom(result);
        } catch (err) {
            console.error('Error generating wisdom:', err);
            setError('Unable to generate wisdom right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartOver = () => {
        navigation.navigate('Onboarding');
    };

    const handleGetAnother = () => {
        loadWisdom();
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
                    <>
                        <View style={styles.wisdomContainer}>
                            <Text style={styles.quoteText}>"{wisdom.text}"</Text>
                            <Text style={styles.authorText}>- {wisdom.author}</Text>

                            <View style={styles.divider} />

                            <Text style={styles.connectionText}>{wisdom.connection}</Text>
                        </View>

                        <Text style={styles.supportText}>
                            No rush. Take your time with this.{'\n'}
                            I'll check in with you tonight.
                        </Text>
                    </>
                )}
            </ScrollView>

            {!loading && !error && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleGetAnother}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Get another perspective</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleStartOver}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Start over</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.sageGreen,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    quoteText: {
        fontSize: 22,
        fontStyle: 'italic',
        color: COLORS.darkBlueGrey,
        lineHeight: 32,
        marginBottom: 16,
    },
    authorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.sageGreen,
        textAlign: 'right',
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginBottom: 20,
    },
    connectionText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    supportText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.softOffWhite,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: COLORS.sageGreen,
        paddingVertical: 18,
        borderRadius: 30,
        elevation: 4,
        shadowColor: COLORS.sageGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: COLORS.sageGreen,
    },
    secondaryButtonText: {
        color: COLORS.sageGreen,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

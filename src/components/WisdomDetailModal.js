import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { FAVORITES_CONTENT } from '../data/favoritesContent';
import { EMOTION_CONTENT } from '../data/emotionContent';
import AuthorAvatar from './AuthorAvatar';

export default function WisdomDetailModal({ visible, onClose, favorite, language = 'en', onDelete }) {
    const t = FAVORITES_CONTENT[language];
    const emotionT = EMOTION_CONTENT[language];

    if (!favorite) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleDelete = () => {
        Alert.alert(
            t.deleteConfirm,
            t.deleteConfirmDesc,
            [
                {
                    text: t.cancel,
                    style: 'cancel'
                },
                {
                    text: t.delete,
                    style: 'destructive',
                    onPress: () => {
                        onDelete(favorite.id);
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <ScrollView
                                style={styles.scrollView}
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Header with close indicator */}
                                <View style={styles.headerBar} />

                                {/* Wisdom Content */}
                                <View style={styles.wisdomContainer}>
                                    <AuthorAvatar authorName={favorite.author} />
                                    <View style={styles.quoteContent}>
                                        <Text style={[styles.quoteText, TYPOGRAPHY.quote]}>
                                            "{favorite.text}"
                                        </Text>
                                        <Text style={[styles.authorText, TYPOGRAPHY.h3]}>
                                            - {favorite.author}
                                        </Text>
                                    </View>
                                </View>

                                {/* Saved Date */}
                                <Text style={styles.savedDate}>
                                    {t.savedOn} {formatDate(favorite.saved_at)}
                                </Text>

                                {/* Why This Section */}
                                <View style={styles.section}>
                                    <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>
                                        {t.whyThis}
                                    </Text>
                                    <Text style={[styles.sectionText, TYPOGRAPHY.body]}>
                                        {favorite.why_this}
                                    </Text>
                                </View>

                                {/* Activities Section */}
                                <View style={styles.section}>
                                    <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>
                                        {t.steps}
                                    </Text>
                                    <View style={styles.activitiesList}>
                                        {favorite.activities && favorite.activities.map((activity, index) => (
                                            <View key={index} style={styles.activityItem}>
                                                <View style={styles.activityDot} />
                                                <Text style={styles.activityText}>
                                                    {activity}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Context Section (if available) */}
                                {favorite.context && (
                                    <View style={styles.section}>
                                        <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>
                                            {t.yourContext}
                                        </Text>
                                        <Text style={[styles.sectionText, TYPOGRAPHY.body]}>
                                            {favorite.context}
                                        </Text>
                                    </View>
                                )}

                                {/* Emotions Section (if available) */}
                                {favorite.emotions && (
                                    <View style={styles.section}>
                                        <Text style={[styles.sectionHeader, TYPOGRAPHY.h3]}>
                                            {t.yourEmotions}
                                        </Text>
                                        <View style={styles.emotionsContainer}>
                                            <View style={styles.emotionRow}>
                                                <Text style={styles.emotionLabel}>
                                                    {emotionT.overwhelmed}
                                                </Text>
                                                <View style={styles.emotionBar}>
                                                    <View
                                                        style={[
                                                            styles.emotionFill,
                                                            { width: `${100 - (favorite.emotions.overwhelmedHopeful || 50)}%` }
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.emotionLabel}>
                                                    {emotionT.hopeful}
                                                </Text>
                                            </View>
                                            <View style={styles.emotionRow}>
                                                <Text style={styles.emotionLabel}>
                                                    {emotionT.stuck}
                                                </Text>
                                                <View style={styles.emotionBar}>
                                                    <View
                                                        style={[
                                                            styles.emotionFill,
                                                            { width: `${100 - (favorite.emotions.stuckProgress || 50)}%` }
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.emotionLabel}>
                                                    {emotionT.makingProgress}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Delete Button */}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handleDelete}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.deleteButtonText}>
                                        {t.delete}
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    headerBar: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    wisdomContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    quoteContent: {
        flex: 1,
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: COLORS.textMain,
        lineHeight: 24,
        marginBottom: 8,
    },
    authorText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'right',
    },
    savedDate: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGreen,
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    activitiesList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    activityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.darkGreen,
        marginTop: 8,
        marginRight: 12,
    },
    activityText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textMain,
        lineHeight: 24,
    },
    emotionsContainer: {
        gap: 16,
    },
    emotionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emotionLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        width: 80,
    },
    emotionBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    emotionFill: {
        height: '100%',
        backgroundColor: COLORS.darkGreen,
    },
    deleteButton: {
        marginTop: 8,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FF3B30',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
});

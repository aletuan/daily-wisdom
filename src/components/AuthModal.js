import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { AUTH_CONTENT } from '../data/authContent';

export default function AuthModal({ visible, onClose, language = 'en' }) {
    const t = AUTH_CONTENT[language];
    const [mode, setMode] = useState('signup'); // 'signup' or 'signin'
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isSignUp = mode === 'signup';

    const handleSubmit = () => {
        // TODO: Implement authentication logic
        console.log('Auth submit:', { mode, nickname, email, password });
        onClose();
    };

    const handleSocialLogin = (provider) => {
        // TODO: Implement social login
        console.log('Social login:', provider);
        onClose();
    };

    const switchMode = () => {
        setMode(isSignUp ? 'signin' : 'signup');
        setNickname('');
        setEmail('');
        setPassword('');
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
                            <Text style={[styles.title, TYPOGRAPHY.h3]}>
                                {isSignUp ? t.signUpTitle : t.signInTitle}
                            </Text>

                            {isSignUp && (
                                <TextInput
                                    style={styles.input}
                                    placeholder={t.nickname}
                                    placeholderTextColor={COLORS.lightGrey}
                                    value={nickname}
                                    onChangeText={setNickname}
                                    autoCapitalize="none"
                                />
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder={t.email}
                                placeholderTextColor={COLORS.lightGrey}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={t.password}
                                placeholderTextColor={COLORS.lightGrey}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSignUp ? t.signUpButton : t.signInButton}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.separatorContainer}>
                                <View style={styles.separatorLine} />
                                <Text style={styles.separatorText}>{t.orContinueWith}</Text>
                                <View style={styles.separatorLine} />
                            </View>

                            <View style={styles.socialButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.socialButton}
                                    onPress={() => handleSocialLogin('google')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.socialButtonText}>G {t.google}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.socialButton}
                                    onPress={() => handleSocialLogin('facebook')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.socialButtonText}>f {t.facebook}</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={switchMode} style={styles.switchModeContainer}>
                                <Text style={styles.switchModeText}>
                                    {isSignUp ? t.hasAccount : t.noAccount}{' '}
                                    <Text style={styles.switchModeLink}>
                                        {isSignUp ? t.signInNow : t.signUpNow}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
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
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.textMain,
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        fontSize: 16,
        color: COLORS.textMain,
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    submitButton: {
        backgroundColor: '#333333',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    separatorText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginHorizontal: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: COLORS.white,
    },
    socialButtonText: {
        fontSize: 16,
        color: COLORS.textMain,
        fontWeight: '500',
    },
    switchModeContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchModeText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    switchModeLink: {
        color: COLORS.textMain,
        fontWeight: '600',
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { AUTH_CONTENT } from '../data/authContent';
import GoogleIcon from './icons/GoogleIcon';
import FacebookIcon from './icons/FacebookIcon';
import { signUp, signIn } from '../services/authService';

export default function AuthModal({ visible, onClose, language = 'en' }) {
    const t = AUTH_CONTENT[language];
    const [mode, setMode] = useState('signup'); // 'signup' or 'signin'
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isSignUp = mode === 'signup';

    const handleSubmit = async () => {
        // Validation
        if (isSignUp && !nickname.trim()) {
            setError(t.nicknameRequired);
            return;
        }
        if (!email.trim()) {
            setError(t.emailRequired);
            return;
        }
        if (password.length < 6) {
            setError(t.passwordTooShort);
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                // Sign up flow
                const { user, session, error: signUpError } = await signUp(
                    email.trim(),
                    password,
                    nickname.trim()
                );

                if (signUpError) {
                    setError(signUpError.message);
                    return;
                }

                // Success - auto signed in, close modal
                console.log('Sign up successful:', user);
                setNickname('');
                setEmail('');
                setPassword('');
                onClose();
            } else {
                // Sign in flow
                const { user, session, error: signInError } = await signIn(
                    email.trim(),
                    password
                );

                if (signInError) {
                    setError(signInError.message);
                    return;
                }

                // Success - close modal
                console.log('Sign in successful:', user);
                setEmail('');
                setPassword('');
                onClose();
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(t.genericError);
        } finally {
            setLoading(false);
        }
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
        setError(''); // Clear error on mode switch
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContainer}>
                            <Text style={[styles.title, TYPOGRAPHY.h3]}>
                                {isSignUp ? t.signUpTitle : t.signInTitle}
                            </Text>

                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

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
                                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {isSignUp ? t.signUpButton : t.signInButton}
                                    </Text>
                                )}
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
                                    <GoogleIcon size={24} />
                                    <Text style={styles.socialButtonText}>{t.google}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.socialButton}
                                    onPress={() => handleSocialLogin('facebook')}
                                    activeOpacity={0.7}
                                >
                                    <FacebookIcon size={24} />
                                    <Text style={styles.socialButtonText}>{t.facebook}</Text>
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
            </KeyboardAvoidingView>
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
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F8F8F8',
        gap: 8,
    },
    socialButtonText: {
        fontSize: 15,
        color: COLORS.textMain,
        fontWeight: '600',
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
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
});

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, Platform, Keyboard, Animated } from 'react-native';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { AUTH_CONTENT } from '../data/authContent';
import GoogleIcon from './icons/GoogleIcon';
import FacebookIcon from './icons/FacebookIcon';
import { signUp, signIn } from '../services/authService';

export default function AuthModal({ visible, onClose, language = 'en', initialMode = 'signup' }) {
    const t = AUTH_CONTENT[language];
    const [mode, setMode] = useState(initialMode); // 'signup' or 'signin'
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const translateY = useRef(new Animated.Value(0)).current;

    const isSignUp = mode === 'signup';

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                // Fixed shift - doesn't change between keyboard types
                Animated.timing(translateY, {
                    toValue: -180,
                    duration: Platform.OS === 'ios' ? 250 : 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: Platform.OS === 'ios' ? 250 : 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, [translateY]);

    // Reset mode to initialMode when modal becomes visible
    useEffect(() => {
        if (visible) {
            setMode(initialMode);
            setError('');
        }
    }, [visible, initialMode]);

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
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                { transform: [{ translateY }] }
                            ]}
                        >
                            <Text style={[styles.title, TYPOGRAPHY.h3]}>
                                {isSignUp ? t.signUpTitle : t.signInTitle}
                            </Text>

                            <Text style={styles.description}>
                                {isSignUp ? t.signUpDescription : t.signInDescription}
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
                        </Animated.View>
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
        fontSize: 19,
        fontWeight: '500',
        color: '#5A6B5E',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    description: {
        fontSize: 13,
        color: '#8B8A84',
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '400',
    },
    input: {
        fontSize: 15,
        color: '#5A6B5E',
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8EBE8',
        fontWeight: '400',
    },
    submitButton: {
        backgroundColor: '#7A9B88',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F0EBE6',
    },
    separatorText: {
        fontSize: 13,
        color: '#8B8A84',
        marginHorizontal: 16,
        fontWeight: '400',
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
        borderColor: '#E8EBE8',
        backgroundColor: '#F9F7F5',
        gap: 8,
    },
    socialButtonText: {
        fontSize: 14,
        color: '#5A6B5E',
        fontWeight: '500',
    },
    switchModeContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchModeText: {
        fontSize: 13,
        color: '#8B8A84',
        fontWeight: '400',
    },
    switchModeLink: {
        color: '#7A9B88',
        fontWeight: '500',
    },
    errorContainer: {
        backgroundColor: '#F9F7F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EFEAE5',
    },
    errorText: {
        color: '#A89384',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '400',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
});

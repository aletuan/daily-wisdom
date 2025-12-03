import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { PROFILE_CONTENT } from '../data/profileContent';
import { getUserProfile, updateProfile, uploadAvatar, signOut, calculateZodiacSign } from '../services/authService';
import { useUser } from '../contexts/UserContext';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen({ route, navigation }) {
    const { language = 'en' } = route.params || {};
    const t = PROFILE_CONTENT[language];
    const { refreshProfile } = useUser();

    // Profile data state
    const [profile, setProfile] = useState(null);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [dateOfBirthText, setDateOfBirthText] = useState('');
    const [zodiacSign, setZodiacSign] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSignOut} activeOpacity={0.7} style={{ marginRight: 16 }}>
                    <Text style={{ fontSize: 16, color: COLORS.textMain }}>{t.signOut}</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, t]);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const { profile: profileData, error: profileError } = await getUserProfile();

            if (profileError) {
                setError(t.updateError);
                return;
            }

            if (profileData) {
                setProfile(profileData);
                setNickname(profileData.nickname || '');
                setEmail(profileData.email || '');
                setGender(profileData.gender || '');

                // Format date of birth for display
                if (profileData.date_of_birth) {
                    const date = new Date(profileData.date_of_birth);
                    setDateOfBirth(date);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    setDateOfBirthText(`${day}/${month}/${year}`);
                }

                setZodiacSign(profileData.zodiac_sign || '');
                setAvatarUrl(profileData.avatar_url || '');
            }
        } catch (err) {
            console.error('Load profile error:', err);
            setError(t.updateError);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async () => {
        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission required', 'Please allow access to your photo library to upload an avatar.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled) {
                return;
            }

            setUploading(true);
            setError('');

            // Upload to Supabase
            const { avatarUrl: uploadedUrl, error: uploadError } = await uploadAvatar(result.assets[0].uri);

            if (uploadError) {
                setError(t.uploadError);
                return;
            }

            // Update local state and profile
            setAvatarUrl(uploadedUrl);

            // Save to database immediately
            const { error: updateError } = await updateProfile({ avatar_url: uploadedUrl });

            if (updateError) {
                setError(t.updateError);
            } else {
                refreshProfile(); // Update global context
            }
        } catch (err) {
            console.error('Avatar upload error:', err);
            setError(t.uploadError);
        } finally {
            setUploading(false);
        }
    };

    const handleDateChange = (text) => {
        setDateOfBirthText(text);

        // Clear dateOfBirth if text is incomplete or invalid (but keep zodiac)
        if (text.length < 10) {
            setDateOfBirth(null);
            return;
        }

        // Validate format dd/mm/yyyy when complete (10 characters)
        if (text.length === 10 && text.includes('/')) {
            const parts = text.split('/');
            if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);

                // Validate date ranges
                if (!isNaN(day) && !isNaN(month) && !isNaN(year) &&
                    day >= 1 && day <= 31 && month >= 1 && month <= 12 &&
                    year >= 1900 && year <= new Date().getFullYear()) {
                    const date = new Date(year, month - 1, day);
                    // Check if date is valid (handles invalid dates like 31/02/2023)
                    if (date.getDate() === day && date.getMonth() === month - 1) {
                        setDateOfBirth(date);
                        // Auto-calculate zodiac sign
                        const zodiac = calculateZodiacSign(date);
                        setZodiacSign(zodiac);
                        return;
                    }
                }
            }
        }

        // If we reach here, date is invalid - clear dateOfBirth but keep zodiac
        setDateOfBirth(null);
    };

    const validateForm = () => {
        if (!nickname.trim()) {
            setError(t.usernameRequired);
            return false;
        }

        if (nickname.trim().length < 2) {
            setError(t.usernameTooShort);
            return false;
        }

        if (!gender) {
            setError(t.genderRequired);
            return false;
        }

        if (!dateOfBirth) {
            if (dateOfBirthText.trim() === '') {
                setError(t.dateRequired);
            } else {
                setError(t.invalidDate || 'Invalid date format. Please use dd/mm/yyyy');
            }
            return false;
        }

        // Check age (must be at least 13)
        const today = new Date();
        const age = today.getFullYear() - dateOfBirth.getFullYear();
        if (age < 13) {
            setError(t.ageTooYoung);
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const profileData = {
                nickname: nickname.trim(),
                gender,
                date_of_birth: dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
            };

            const { error: updateError } = await updateProfile(profileData);

            if (updateError) {
                setError(t.updateError);
                return;
            }

            refreshProfile(); // Update global context

            // Show success message without reloading screen
            Alert.alert('Success', t.saveSuccess);
        } catch (err) {
            console.error('Save profile error:', err);
            setError(t.updateError);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        const { error } = await signOut();
                        if (error) {
                            setError(t.signOutError);
                        } else {
                            refreshProfile(); // Clear global context
                            // Navigate to Welcome screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }],
                            });
                        }
                    },
                },
            ]
        );
    };

    const getAvatarDisplay = () => {
        if (avatarUrl) {
            return <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />;
        }
        // Show first letter of nickname as fallback
        const firstLetter = nickname ? nickname.charAt(0).toUpperCase() : '?';
        return <Text style={styles.avatarLetter}>{firstLetter}</Text>;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.sageGreen} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handleAvatarUpload}
                        activeOpacity={0.7}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator size="large" color={COLORS.white} />
                        ) : (
                            getAvatarDisplay()
                        )}
                        <View style={styles.editIcon}>
                            <MaterialIcons name="edit" size={14} color="#000000" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Error Display */}
                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Username Input (Read-only) */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.username}</Text>
                    <TextInput
                        style={[styles.input, styles.inputReadonly]}
                        placeholder={t.username}
                        placeholderTextColor={COLORS.lightGrey}
                        value={nickname}
                        editable={false}
                    />
                </View>

                {/* Email Display (Read-only) */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.email}</Text>
                    <TextInput
                        style={[styles.input, styles.inputReadonly]}
                        placeholder={t.emailLabel}
                        placeholderTextColor={COLORS.lightGrey}
                        value={email}
                        editable={false}
                    />
                </View>

                {/* Gender Selection */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.gender}</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => setGender('male')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.radioCircle}>
                                {gender === 'male' && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.genderLabel}>{t.male}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => setGender('female')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.radioCircle}>
                                {gender === 'female' && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.genderLabel}>{t.female}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.genderOption}
                            onPress={() => setGender('other')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.radioCircle}>
                                {gender === 'other' && <View style={styles.radioDot} />}
                            </View>
                            <Text style={styles.genderLabel}>{t.other}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Date of Birth Input */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.dateOfBirth}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="dd/mm/yyyy"
                        placeholderTextColor={COLORS.lightGrey}
                        value={dateOfBirthText}
                        onChangeText={handleDateChange}
                        maxLength={10}
                    />
                </View>

                {/* Zodiac Sign Display (Read-only) */}
                {zodiacSign && (
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>{t.zodiacSign}</Text>
                        <TextInput
                            style={[styles.input, styles.inputReadonly]}
                            value={zodiacSign}
                            editable={false}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Footer with Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.buttonDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.saveButtonText}>{t.save}</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Bottom Navigation Bar */}
            <BottomNavigation
                navigation={navigation}
                language={language}
                currentScreen="Profile"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingTop: 32,
        paddingBottom: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    avatarLetter: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: '600',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
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
    fieldContainer: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        color: COLORS.textMain,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    inputReadonly: {
        color: COLORS.lightGrey,
        backgroundColor: '#F8F8F8',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 12,
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
    },
    genderLabel: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
    },
    saveButton: {
        backgroundColor: '#333333',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Platform, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../styles/colors';
import { TYPOGRAPHY } from '../styles/typography';
import { PROFILE_CONTENT } from '../data/profileContent';
import { getUserProfile, updateProfile, uploadAvatar, signOut, calculateZodiacSign } from '../services/authService';

export default function ProfileScreen({ route, navigation }) {
    const { language = 'en' } = route.params || {};
    const t = PROFILE_CONTENT[language];

    // Profile data state
    const [profile, setProfile] = useState(null);
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [zodiacSign, setZodiacSign] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

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
                setDateOfBirth(profileData.date_of_birth ? new Date(profileData.date_of_birth) : null);
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
            }
        } catch (err) {
            console.error('Avatar upload error:', err);
            setError(t.uploadError);
        } finally {
            setUploading(false);
        }
    };

    const handleDateChange = (selectedDate) => {
        setDateOfBirth(selectedDate);
        // Auto-calculate zodiac sign
        const zodiac = calculateZodiacSign(selectedDate);
        setZodiacSign(zodiac);
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
            setError(t.dateRequired);
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

            // Reload profile to get updated data
            await loadProfile();

            // Show success message
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
                            <Text style={styles.editIconText}>✎</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Error Display */}
                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Username Input */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.username}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.username}
                        placeholderTextColor={COLORS.lightGrey}
                        value={nickname}
                        onChangeText={setNickname}
                        autoCapitalize="none"
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

                {/* Gender Picker */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.gender}</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowGenderPicker(!showGenderPicker)}
                    >
                        <Text style={[styles.pickerButtonText, !gender && styles.placeholderText]}>
                            {gender ? t[gender] : t.selectGender}
                        </Text>
                        <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>
                    {showGenderPicker && (
                        <Picker
                            selectedValue={gender}
                            onValueChange={(value) => {
                                setGender(value);
                                setShowGenderPicker(false);
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label={t.selectGender} value="" />
                            <Picker.Item label={t.male} value="male" />
                            <Picker.Item label={t.female} value="female" />
                            <Picker.Item label={t.other} value="other" />
                        </Picker>
                    )}
                </View>

                {/* Date of Birth Picker */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>{t.dateOfBirth}</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={[styles.pickerButtonText, !dateOfBirth && styles.placeholderText]}>
                            {dateOfBirth ? dateOfBirth.toLocaleDateString() : t.selectDate}
                        </Text>
                        <Text style={styles.pickerArrow}>📅</Text>
                    </TouchableOpacity>
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

            {/* Footer with Buttons */}
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

                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signOutButtonText}>{t.signOut}</Text>
                </TouchableOpacity>
            </View>

            {/* Date Picker Modal */}
            {showDatePicker && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View style={styles.datePickerModal}>
                        <View style={styles.datePickerContainer}>
                            <View style={styles.datePickerHeader}>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text style={styles.datePickerButton}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text style={[styles.datePickerButton, styles.datePickerDone]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={dateOfBirth || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()}
                                onChange={(event, selectedDate) => {
                                    if (Platform.OS === 'android') {
                                        setShowDatePicker(false);
                                    }
                                    if (selectedDate) {
                                        handleDateChange(selectedDate);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            )}
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
        marginBottom: 32,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    avatarLetter: {
        color: COLORS.white,
        fontSize: 48,
        fontWeight: '600',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    editIconText: {
        fontSize: 16,
        color: '#000000',
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
        marginBottom: 24,
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
    pickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    pickerButtonText: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    placeholderText: {
        color: COLORS.lightGrey,
    },
    pickerArrow: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    picker: {
        marginTop: 8,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    saveButton: {
        backgroundColor: '#333333',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    signOutButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    signOutButtonText: {
        color: COLORS.textMain,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    datePickerModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    datePickerContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    datePickerButton: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    datePickerDone: {
        fontWeight: '600',
        color: COLORS.sageGreen,
    },
});

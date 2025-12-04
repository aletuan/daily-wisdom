import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import { signOut } from '../services/authService';
import { useUser } from '../contexts/UserContext';

export default function SettingsScreen({ route, navigation }) {
    const { language = 'en' } = route.params || {};
    const { refreshProfile } = useUser();

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
                            Alert.alert('Error', 'Failed to sign out. Please try again.');
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

    const handleSwitchProfile = () => {
        Alert.alert('Switch Profile', 'This feature is coming soon!');
    };

    const handleFollowInvite = () => {
        Alert.alert('Follow and Invite', 'This feature is coming soon!');
    };

    const handleNotifications = () => {
        Alert.alert('Notifications', 'This feature is coming soon!');
    };

    const handleHelp = () => {
        Alert.alert('Help', 'This feature is coming soon!');
    };

    const handleAbout = () => {
        Alert.alert('About', 'This feature is coming soon!');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Follow and Invite Friends */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleFollowInvite}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="person-add" size={24} color={COLORS.textMain} />
                        <Text style={styles.menuItemText}>Follow and invite friends</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGrey} />
                </TouchableOpacity>

                {/* Notification */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleNotifications}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="notifications" size={24} color={COLORS.textMain} />
                        <Text style={styles.menuItemText}>Notification</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGrey} />
                </TouchableOpacity>

                {/* Help */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleHelp}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="help-outline" size={24} color={COLORS.textMain} />
                        <Text style={styles.menuItemText}>Help</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGrey} />
                </TouchableOpacity>

                {/* About */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleAbout}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="info-outline" size={24} color={COLORS.textMain} />
                        <Text style={styles.menuItemText}>About</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGrey} />
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Switch Profile */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleSwitchProfile}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="swap-horiz" size={24} color="#007AFF" />
                        <Text style={[styles.menuItemText, styles.blueText]}>Switch profile</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.lightGrey} />
                </TouchableOpacity>

                {/* Log Out */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleSignOut}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuItemContent}>
                        <MaterialIcons name="logout" size={24} color="#DC2626" />
                        <Text style={[styles.menuItemText, styles.redText]}>Log out</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollView: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuItemText: {
        fontSize: 16,
        color: COLORS.textMain,
    },
    blueText: {
        color: '#007AFF',
    },
    redText: {
        color: '#DC2626',
    },
    divider: {
        height: 8,
        backgroundColor: '#F8F8F8',
    },
});

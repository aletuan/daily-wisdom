import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileIcon from './ProfileIcon';
import { useUser } from '../contexts/UserContext';

export default function HeaderProfileIcon({ language = 'en' }) {
    const navigation = useNavigation();
    const { userProfile } = useUser();

    if (!userProfile) return null;

    return (
        <View style={{ marginRight: 16 }}>
            <ProfileIcon
                nickname={userProfile.nickname}
                avatarUrl={userProfile.avatar_url}
                onPress={() => {
                    navigation.navigate('Profile', { language });
                }}
            />
        </View>
    );
}

import { Text, StyleSheet, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EmotionScreen from '../screens/EmotionScreen';
import WisdomScreen from '../screens/WisdomScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HeaderProfileIcon from '../components/HeaderProfileIcon';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={({ navigation }) => ({
                    headerBackVisible: false, // Hide native back button
                    headerTintColor: COLORS.darkGreen,
                    headerTitleStyle: {
                        fontFamily: FONTS.serif.semiBold,
                        fontSize: 18,
                    },
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: COLORS.white,
                    },
                    headerLeftContainerStyle: {
                        paddingLeft: 8,
                        paddingRight: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    },
                    headerLeft: ({ canGoBack }) =>
                        canGoBack ? (
                            <View style={styles.backButtonWrapper}>
                                <Pressable
                                    onPress={() => navigation.goBack()}
                                    style={styles.backButton}
                                    android_ripple={null}
                                    hitSlop={0}
                                >
                                    <Text style={styles.backArrow}>←</Text>
                                </Pressable>
                            </View>
                        ) : null,
                })}
            >
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ title: 'Your Journey' }}
                />
                <Stack.Screen
                    name="Emotion"
                    component={EmotionScreen}
                    options={({ route }) => ({
                        title: route.params?.language === 'vi' ? 'Cảm xúc của bạn' : 'Your Feelings',
                        headerRight: () => <HeaderProfileIcon language={route.params?.language} />
                    })}
                />
                <Stack.Screen
                    name="Wisdom"
                    component={WisdomScreen}
                    options={({ route }) => ({
                        title: route.params?.language === 'vi' ? 'Lời khuyên cho bạn' : 'Your Wisdom',
                        headerRight: () => <HeaderProfileIcon language={route.params?.language} />
                    })}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ title: 'Settings' }}
                />
                <Stack.Screen
                    name="Favorites"
                    component={FavoritesScreen}
                    options={{ title: 'My Favorites' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    backButtonWrapper: {
        width: 40,
        height: 40,
        overflow: 'hidden',
        borderRadius: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: COLORS.textMain,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

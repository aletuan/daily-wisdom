import { Text, StyleSheet, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EmotionScreen from '../screens/EmotionScreen';
import WisdomScreen from '../screens/WisdomScreen';
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
                        paddingLeft: 16,
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
                    options={{ title: 'How You Feel' }}
                />
                <Stack.Screen
                    name="Wisdom"
                    component={WisdomScreen}
                    options={{ title: 'Your Wisdom' }}
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
        borderRadius: 20,
        backgroundColor: COLORS.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backArrow: {
        color: COLORS.textMain,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

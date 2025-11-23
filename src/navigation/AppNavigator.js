import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EmotionScreen from '../screens/EmotionScreen';
import WisdomScreen from '../screens/WisdomScreen';
import QuoteScreen from '../screens/QuoteScreen';
import BackArrowIcon from '../components/icons/BackArrowIcon';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';

const Stack = createNativeStackNavigator();

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
                    headerLeft: ({ canGoBack }) =>
                        canGoBack ? (
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                                activeOpacity={0.6}
                            >
                                <BackArrowIcon color={COLORS.darkGreen} />
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
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
                <Stack.Screen
                    name="Quote"
                    component={QuoteScreen}
                    options={{ title: 'Daily Wisdom' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginLeft: -8,
        marginRight: 16,
    },
    backText: {
        fontFamily: FONTS.sans.regular,
        fontSize: 16,
        color: COLORS.darkGreen,
        marginLeft: 4,
    },
});

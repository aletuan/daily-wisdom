import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EmotionScreen from '../screens/EmotionScreen';
import WisdomScreen from '../screens/WisdomScreen';
import QuoteScreen from '../screens/QuoteScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ title: 'Your Journey', headerBackTitle: 'Back' }}
                />
                <Stack.Screen
                    name="Emotion"
                    component={EmotionScreen}
                    options={{ title: 'How You Feel', headerBackTitle: 'Back' }}
                />
                <Stack.Screen
                    name="Wisdom"
                    component={WisdomScreen}
                    options={{ title: 'Your Wisdom', headerBackTitle: 'Back' }}
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

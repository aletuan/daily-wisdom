# Youth Wisdom

**Youth Wisdom** is a mobile application designed to be a daily living adviser for young people. It combines the timeless wisdom of famous quotes with modern AI coaching to help users navigate life's journey with purpose and confidence.

## Features

- **AI Wisdom Coach**: A personalized onboarding flow that understands your current focus (e.g., Finding Direction, Building Habits).
- **Emotion Tracking**: Share how you're feeling (Overwhelmed vs. Hopeful, Stuck vs. Making Progress) to get relevant advice.
- **Personalized Wisdom**: Uses the Claude API to curate famous quotes that speak directly to your current state.
- **Deep Insights**: Explains *why* this specific wisdom matters for you today.
- **Actionable Steps**: Provides 3 simple, interactive steps you can take right now to embody the wisdom.
- **Minimalist Design**: A distraction-free interface that encourages you to sit with the wisdom.

## Screenshots

<div style="display: flex; flex-direction: row; gap: 20px;">
  <img src="assets/screenshot-welcome.png" alt="Welcome Screen" width="250" />
  <img src="assets/screenshot-quote.png" alt="Wisdom Screen" width="250" />
</div>

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo Go app (on your mobile device) or an iOS/Android simulator.
- **Anthropic API Key**: Required for the AI features.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd hello-mobile
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    - Create a `.env` file in the root directory (copy from `.env.example`).
    - Add your Anthropic API key:
      ```
      ANTHROPIC_API_KEY=sk-ant-your-key-here
      ```

### Running the App

1.  Start the Expo development server:
    ```bash
    npx expo start --clear
    ```

2.  Run on your device or simulator:
    - **Physical Device**: Scan the QR code with the Expo Go app.
    - **iOS Simulator**: Press `i` in the terminal.
    - **Android Emulator**: Press `a` in the terminal.

## Troubleshooting & Common Issues

### App Stuck on "Opening project..." or Timeout Error
If the Expo Go app on your phone gets stuck or shows a timeout error when trying to connect:

1.  **Check Network**: Ensure your phone and computer are on the **same Wi-Fi network**.
2.  **Use Tunnel Connection**: If the issue persists (often due to firewall or network isolation), try running the app with the `--tunnel` flag:
    ```bash
    npx expo start --tunnel
    ```
    *Note: This may require installing `@expo/ngrok` when prompted.*

### API Errors
If you see an error generating wisdom:
1.  Check that your `ANTHROPIC_API_KEY` is correct in `.env`.
2.  Ensure you have credits in your Anthropic account.
3.  Restart the server with `npx expo start --clear` to ensure environment variables are reloaded.

## Technologies

- **React Native**: For building the mobile UI.
- **Expo**: For easy development and deployment.
- **React Navigation**: For seamless screen transitions.
- **Anthropic Claude API**: For generating personalized wisdom and insights.

## License

This project is licensed under the MIT License.

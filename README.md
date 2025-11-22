# Youth Wisdom

**Youth Wisdom** is a mobile application designed to be a daily living adviser for young people. It provides inspiring quotes and actionable steps to help users navigate life's journey with purpose and confidence.

## Features

- **Inspiring Welcome**: A clean and motivating entry point to start your daily journey.
- **Daily Wisdom**: Get a random famous quote to inspire your day.
- **Actionable Steps**: Each quote comes with a set of 3 practical todo items.
- **Interactive Checklist**: Track your progress by marking actionable steps as complete.

## Screenshots

*(Add screenshots here)*

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo Go app (on your mobile device) or an iOS/Android simulator.

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

### Running the App

1.  Start the Expo development server:
    ```bash
    npx expo start
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

### Port Already in Use
If you see an error that port 8081 is busy:
1.  Kill the process occupying the port:
    ```bash
    lsof -i :8081
    kill -9 <PID>
    ```
2.  Or simply restart Expo, and it will ask to use a different port (e.g., 8082).

## Technologies

- **React Native**: For building the mobile UI.
- **Expo**: For easy development and deployment.
- **React Navigation**: For seamless screen transitions.

## License

This project is licensed under the MIT License.

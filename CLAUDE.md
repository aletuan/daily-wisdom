# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Youth Wisdom is a React Native mobile app built with Expo that provides personalized daily wisdom and life coaching for young people. The app combines famous quotes with AI-powered insights using the Anthropic Claude API (claude-3-haiku-20240307 model).

## Development Commands

### Starting the App
```bash
# Start Expo dev server (clears cache)
npx expo start --clear

# Run on specific platforms
npx expo start --ios      # iOS simulator
npx expo start --android  # Android emulator
npx expo start --tunnel   # Use tunnel if network isolation issues occur
```

### Standard Development
```bash
npm install               # Install dependencies
npx expo start           # Start dev server without cache clear
```

## Architecture

### Navigation Flow
The app uses React Navigation with a native stack navigator (AppNavigator.js):
1. **Welcome** → Language selection (English/Vietnamese)
2. **Onboarding** → Focus area selection (grid) or custom input (Zen Mode)
3. **Emotion** → Emotional state tracking with dual sliders
4. **Wisdom** → AI-generated personalized wisdom
5. **Quote** → Alternative screen for displaying quotes with author avatars

The selected language propagates throughout the entire journey via navigation params.

### State Management
- **No global state library**: Uses React Navigation params to pass language and user context between screens
- **Persistent storage**: AsyncStorage for language preference
- **Navigation pattern**: Linear flow with back navigation support

### Core Services

#### Claude API Integration (src/services/claudeService.js)
- Uses `@anthropic-ai/sdk` to generate personalized wisdom
- Model: `claude-3-haiku-20240307` (~$0.0001 per generation)
- Handles bilingual responses (English/Vietnamese)
- Fallback to curated quotes (src/data/quotes.js) if API fails
- Returns: `{ text, author, why_this, activities }`

#### Environment Configuration
- API key loaded via `react-native-dotenv` and `@env` import
- Babel plugin configured in babel.config.js
- `.env` file required (see `.env.example`)

### Key Architectural Patterns

#### Bilingual Content
All user-facing text organized by language code:
```javascript
export const CONTENT = {
  en: { greeting: "Hi...", ... },
  vi: { greeting: "Chào...", ... }
};
```
Files: `src/data/*Content.js`

#### Design System
- **Typography**: Lora (serif) for quotes/headers, Inter (sans) for body text
- **Colors**: Sage green theme (`#7A9B88`, `#2C4A3B`) with warm neutrals
- **Centralized**: `src/styles/colors.js` and `src/styles/typography.js`

#### Component Organization
- **screens/**: Full-page views with navigation
- **components/**: Reusable UI elements (buttons, sliders, icons)
- **data/**: Static content and translations
- **services/**: External API integrations (Claude)
- **utils/**: Helper functions (currently minimal)

### Asset Loading
App.js preloads fonts (Lora, Inter) and images using `expo-font` and `expo-asset` before rendering navigation.

## Important Development Notes

### API Key Setup
1. Copy `.env.example` to `.env`
2. Add your Anthropic API key: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart with `npx expo start --clear` to reload environment variables

### Network Troubleshooting
If Expo Go can't connect (timeout/stuck on "Opening project..."):
- Ensure phone and computer on same Wi-Fi
- Use `npx expo start --tunnel` (may require `@expo/ngrok`)

### Recent Features
- Author avatar portraits with pure white backgrounds (assets/avatars/)
- Bilingual support with top-right language toggle
- Zen Mode custom input with background dimming
- Grid-based selection interface for focus areas

## Project Structure
```
src/
├── components/       # Reusable UI components and icons
├── data/            # Static content, translations, quotes
├── navigation/      # React Navigation setup
├── screens/         # Full-page screen components
├── services/        # External API integrations (Claude)
├── styles/          # Design system (colors, typography)
└── utils/           # Helper functions
```

## Technologies
- React Native 0.81.5 with React 19.1.0
- Expo ~54.0.25
- React Navigation 7.x (native stack)
- Anthropic SDK 0.70.1
- AsyncStorage for persistence

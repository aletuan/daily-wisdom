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

#### Avatar Generation Service (src/services/avatarGenerationService.js)
Multi-tier avatar loading strategy to minimize costs and maximize speed:

**Tier 1: Local Cache (instant)**
- Checks AsyncStorage and local file system first
- Returns immediately if avatar was previously loaded

**Tier 2: GitHub CDN (fast, free)**
- Fetches from https://github.com/aletuan/youth-wisdom-avatars
- Pre-generated avatars for 200+ famous philosophers/authors
- Shared across all users (first user downloads, everyone benefits)
- CDN URL pattern: `https://raw.githubusercontent.com/aletuan/youth-wisdom-avatars/main/avatars/{normalized-name}.png`

**Tier 3: Gemini API (slow, $0.01 per generation)**
- Only used for rare/obscure authors not in CDN
- Generates pen-and-ink sketch style portraits using Gemini 2.5 Flash Image API
- Style: Classical engraving technique, cross-hatching, pure white background
- Automatically caches locally after generation

**Cost Analysis:**
- CDN avatars: $0 (free GitHub hosting and bandwidth)
- Generated avatars: ~$0.01 each (rare, only for unknown authors)
- Estimated cost: <$5/month for <10k users

**Avatar Repository:**
- Separate repo: https://github.com/aletuan/youth-wisdom-avatars
- Batch generation script: `scripts/avatar-cdn/generate-batch.js`
- Current count: 10 avatars (can scale to 200+)
- Community-contributable via PR

#### Environment Configuration
- API keys loaded via `react-native-dotenv` and `@env` import
- Babel plugin configured in babel.config.js
- `.env` file required (see `.env.example`)
- Required keys:
  - `ANTHROPIC_API_KEY` - For wisdom generation
  - `GEMINI_API_KEY` - For avatar generation (fallback only)

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
2. Add your API keys:
   - `ANTHROPIC_API_KEY=sk-ant-...` (required for wisdom generation)
   - `GEMINI_API_KEY=...` (optional, only for generating new avatars)
3. Restart with `npx expo start --clear` to reload environment variables

Note: GEMINI_API_KEY is only used when an author's avatar is not found in the CDN. Most users will never trigger Gemini API calls.

### Network Troubleshooting
If Expo Go can't connect (timeout/stuck on "Opening project..."):
- Ensure phone and computer on same Wi-Fi
- Use `npx expo start --tunnel` (may require `@expo/ngrok`)

### Recent Features
- **Avatar CDN System**: Multi-tier loading (local cache → GitHub CDN → Gemini API) with cost optimization
- **GitHub Avatar Repository**: https://github.com/aletuan/youth-wisdom-avatars (10 avatars, expandable to 200+)
- **Batch Avatar Generation**: Script to generate avatars in bulk with Gemini API
- Author avatar portraits with pen-and-ink sketch style, pure white backgrounds
- Bilingual support (English/Vietnamese) with top-right language toggle
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

## Avatar Generation & Management

### Testing Avatar CDN
```bash
# Test CDN connectivity and avatar availability
node scripts/test-avatar-cdn.js
```

### Generating New Avatars
Navigate to the avatar CDN repository and run the batch generation script:

```bash
cd scripts/avatar-cdn

# Generate all remaining avatars (skips existing)
node generate-batch.js

# Generate specific range (e.g., next 20 avatars)
node generate-batch.js --start=10 --limit=20

# Custom delay between API calls (default 1000ms)
node generate-batch.js --delay=2000
```

### Adding Avatars to CDN
1. Generate new avatars using the batch script
2. Commit and push to the youth-wisdom-avatars repository
3. Avatars are immediately available via GitHub Raw CDN
4. App will automatically fetch from CDN on next request

### Avatar Naming Convention
Authors are normalized to lowercase with special characters replaced by hyphens:
- "Marcus Aurelius" → `marcus-aurelius.png`
- "Søren Kierkegaard" → `soren-kierkegaard.png`
- "Lao Tzu" → `lao-tzu.png`

## Technologies
- React Native 0.81.5 with React 19.1.0
- Expo ~54.0.25
- React Navigation 7.x (native stack)
- Anthropic SDK 0.70.1
- Google Gemini 2.5 Flash Image API (avatar generation)
- AsyncStorage for persistence
- expo-file-system for local avatar caching

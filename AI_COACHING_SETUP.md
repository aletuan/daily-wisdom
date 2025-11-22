# AI Coaching Feature Setup

## Prerequisites

1. **Anthropic API Key**: You need an API key from Anthropic to use Claude.
   - Sign up at: https://console.anthropic.com/
   - Create an API key in your account settings
   - Note: API usage incurs costs based on tokens used

## Installation

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Add your Anthropic API key to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Important**: Restart the Expo server after adding the API key:
   ```bash
   # Stop the current server (Ctrl+C), then:
   npx expo start --clear
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

## Usage

The new AI coaching flow works as follows:

1. **Welcome Screen**: User taps "Start Your Journey"
2. **Onboarding Screen**: User selects what brings them here (or types custom input)
3. **Emotion Screen**: User adjusts sliders to indicate their emotional state
4. **Wisdom Screen**: AI generates personalized wisdom based on their input

## Features

- **Personalized Wisdom**: Claude generates context-aware advice based on user input
- **Emotional Intelligence**: Takes into account the user's current emotional state
- **Fallback System**: If API fails, falls back to curated quotes
- **Gentle UX**: Non-judgmental, supportive tone throughout

## API Costs

- Model used: `claude-3-haiku-20240307` (cost-effective)
- Average tokens per request: ~150
- Estimated cost: ~$0.0001 per wisdom generation

## Privacy Considerations

- User inputs (context and emotions) are sent to Claude API
- No data is stored on Anthropic's servers beyond the API call
- Consider adding a privacy notice in your app

## Troubleshooting

### API Key Not Working
- Ensure your API key is correctly set in `.env`
- Check that you have credits in your Anthropic account
- Verify the key starts with `sk-ant-`

### App Not Loading
- Make sure all dependencies are installed: `npm install`
- Restart the Expo server: `npx expo start --clear`

### Wisdom Not Generating
- Check console for error messages
- Verify internet connection
- The app will fall back to curated quotes if API fails

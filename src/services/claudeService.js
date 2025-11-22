import Anthropic from '@anthropic-ai/sdk';
import { QUOTES } from '../data/quotes';
import { ANTHROPIC_API_KEY } from '@env';

// Initialize Claude client
// NOTE: In production, store API key securely using AsyncStorage or environment variables
const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
});

/**
 * Generate personalized wisdom based on user context and emotional state
 * @param {string} context - What the user is working on
 * @param {object} emotions - Emotional state with overwhelmedHopeful and stuckProgress values (0-100)
 * @returns {Promise<object>} - Object containing { text, author, connection }
 */
export async function generatePersonalizedWisdom(context, emotions) {
    try {
        // Convert emotion slider values to descriptive states
        const emotionState = interpretEmotions(emotions);

        const prompt = `You are a wise curator of human wisdom.

Context: User is working on "${context}"
Current feeling: ${emotionState}

Task: Select a famous quote (real quote by a real person) that perfectly addresses this state of mind.
Output format: JSON with the following fields:
- "text": The exact text of the quote
- "author": The name of the person who said it
- "why_this": A profound but friendly explanation (2-3 sentences) of why this quote fits their current state. Acknowledge their feelings and explain how this wisdom offers a shift in perspective.
- "activities": An array of 3 simple, actionable steps (max 10 words each) the user can take right now to embody this wisdom.

Example output:
{
  "text": "The only way out is through.",
  "author": "Robert Frost",
  "why_this": "It's completely natural to feel stuck when facing a big challenge. This quote reminds us that the uncomfortable feelings aren't a sign to stop, but actually the doorway to your next breakthrough.",
  "activities": [
    "Take 3 deep breaths right now.",
    "Write down one thing you're grateful for.",
    "Step outside for 2 minutes."
  ]
}

Do not make up quotes. Use real, verified quotes from history, philosophy, or literature.`;

        const message = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 350,
            temperature: 0.7,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        // Parse the JSON response
        const content = message.content[0].text;
        console.log('Claude response:', content); // Debug log

        // Extract JSON - handle potential markdown code blocks or extra text
        // Look for the first opening brace and the last closing brace
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            const jsonString = content.substring(firstBrace, lastBrace + 1);
            return JSON.parse(jsonString);
        } else {
            throw new Error('No JSON object found in response');
        }
    } catch (error) {
        console.error('Claude API error:', error);

        // Fallback to curated quotes if API fails
        return getFallbackWisdom(context);
    }
}

/**
 * Interpret emotion slider values into descriptive text
 */
function interpretEmotions(emotions) {
    const { overwhelmedHopeful, stuckProgress } = emotions;

    const overwhelmLevel = overwhelmedHopeful < 40 ? 'overwhelmed' :
        overwhelmedHopeful > 60 ? 'hopeful' :
            'somewhere in between';

    const progressLevel = stuckProgress < 40 ? 'stuck' :
        stuckProgress > 60 ? 'making progress' :
            'working through it';

    return `feeling ${overwhelmLevel} and ${progressLevel}`;
}

/**
 * Get a fallback quote when API is unavailable
 */
function getFallbackWisdom(context) {
    // Find a relevant quote or return a random one
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    return {
        text: randomQuote.text,
        author: randomQuote.author,
        why_this: "Sometimes the ancient wisdom speaks most directly to our modern struggles. This thought invites you to pause and find your center amidst the noise.",
        activities: [
            "Take a moment to breathe deeply.",
            "Reflect on what this quote means to you.",
            "Share this thought with a friend."
        ]
    };
}

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
- "connection": A brief, gentle sentence (10-15 words) connecting this quote to their current feeling

Example output:
{
  "text": "The only way out is through.",
  "author": "Robert Frost",
  "connection": "This reminds us that your current struggle is actually the path forward."
}

Do not make up quotes. Use real, verified quotes from history, philosophy, or literature.`;

        const message = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 200,
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
        // Extract JSON if Claude adds extra text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Failed to parse JSON response');
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
        connection: "Here is a timeless thought to guide you on your journey today."
    };
}

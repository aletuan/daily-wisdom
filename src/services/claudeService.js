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
 * @returns {Promise<string>} - Personalized wisdom message
 */
export async function generatePersonalizedWisdom(context, emotions) {
    try {
        // Convert emotion slider values to descriptive states
        const emotionState = interpretEmotions(emotions);

        const prompt = `You are a gentle, supportive life coach speaking to a young person.

Context: They're working on "${context}"
Current feeling: ${emotionState}

Provide a short, personalized piece of wisdom (2-3 sentences) that:
- Acknowledges their current state
- Offers gentle encouragement
- Includes one small, actionable insight
- Feels warm and non-judgmental

Keep it conversational and authentic. Don't use clichés or overly formal language.`;

        const message = await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 150,
            temperature: 0.7,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        return message.content[0].text;
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
    // Map context to relevant quote categories
    const contextKeywords = {
        direction: ['future', 'dreams', 'create'],
        habits: ['slowly', 'stop', 'continue'],
        stress: ['courage', 'failure', 'success'],
        growth: ['value', 'believe', 'halfway'],
    };

    // Find a relevant quote or return a random one
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return `"${randomQuote.text}"\n\n- ${randomQuote.author}`;
}

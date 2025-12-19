'use server';

import { getGeminiModel } from '@/lib/gemini';

export async function generateToolInsight(prompt: string) {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating tool insight:', error);
        return "I'm having a little trouble connecting to my brain right now. Please try again in a moment!";
    }
}

import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { toolName, inputData, resultData, promptType } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API Key not configured' },
                { status: 500 }
            );
        }

        const model = getGeminiModel();

        let prompt = '';

        if (promptType === 'advice') {
            prompt = `
                You are an expert consultant for the tool: ${toolName}.
                The user has input the following data: ${JSON.stringify(inputData)}.
                The calculated result is: ${JSON.stringify(resultData)}.
                
                Please provide:
                1. A brief analysis of this result (is it good, bad, average?).
                2. 3-4 actionable tips or recommendations based specifically on these numbers.
                3. Keep the tone professional, helpful, and concise.
                4. Do not use markdown headers (#), just use bullet points and bold text.
            `;
        } else if (promptType === 'summary') {
            prompt = `
                Summarize the following content or result for ${toolName}:
                ${JSON.stringify(resultData)}
                Keep it under 100 words.
            `;
        } else {
            prompt = `Analyze this data for ${toolName}:Result: ${JSON.stringify(resultData)}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ insight: text });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate insight', details: error.message },
            { status: 500 }
        );
    }
}

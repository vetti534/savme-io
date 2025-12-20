export async function generateToolInsight(prompt: string, toolName: string = 'Tool') {
    try {
        const response = await fetch('/gemini-proxy.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                toolName: toolName,
                customPrompt: prompt
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.insight || "No insight generated.";
    } catch (error) {
        console.error('Error fetching tool insight:', error);
        return "I'm having a little trouble connecting to my brain right now. Please try again in a moment!";
    }
}

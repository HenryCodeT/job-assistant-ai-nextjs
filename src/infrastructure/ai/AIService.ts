// src/infrastructure/ai/AIService.ts

const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || 'gpt-4';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; 

export class AIService {
  
  async generateText(systemPrompt: string | null, userPrompt: string, temperature: number = 0.7): Promise<string> {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: messages,
        temperature: temperature,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
        // Handle Rate Limit specifically
        if (response.status === 429) {
             throw new Error("AI Rate Limit exceeded. Please wait and try again.");
        }
        throw new Error(`AI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
import OpenAI from 'openai';
import { config } from '@config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class ChatAPI {
  private openai: OpenAI;
  private maxTokens: number;

  constructor(maxTokens: number = 12800) {
    this.openai = new OpenAI({
      apiKey: config.gemini.apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    this.maxTokens = maxTokens;
  }

  async chat(messages: ChatCompletionMessageParam[]) {

    const tokenCount = messages.reduce((acc, message) => {
      return acc + message.content.length;
    }, 0);
    console.log('tokenCount', tokenCount);
    
    try {
      const completion = await this.openai.chat.completions.create({
        temperature: 1,
        model: 'gemini-1.5-pro-latest',
        messages,
        max_tokens: 1000000,
        response_format: { type: 'json_object' },
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


import OpenAI from 'openai';
import { config } from '@config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class ChatAPI {
  private openai: OpenAI;
  private maxTokens: number;

  constructor(maxTokens: number = 12800) {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    this.maxTokens = maxTokens;
  }

  async chat(messages: ChatCompletionMessageParam[]) {




    const completion = await this.openai.chat.completions.create({
      model: 'gemini-1.5-flash-latest',
      messages,
      response_format: { type: 'json_object' },
    });
    return completion.choices[0].message.content;
  }


}

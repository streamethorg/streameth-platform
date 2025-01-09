import OpenAI from 'openai';
import { config } from '@config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export class ChatAPI {
  private openai: OpenAI;
  private maxTokens: number;

  constructor(maxTokens: number = 12800) {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.maxTokens = maxTokens;
  }

  async chat(messages: ChatCompletionMessageParam[]) {




    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: 'json_object' },
    });
    return completion.choices[0].message;
  }


}

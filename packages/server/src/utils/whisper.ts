import OpenAI from 'openai';
import { config } from '@config';
import { promises as fs } from 'fs';
import path from 'path';

export class WhisperAPI {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async transcribe(
    filePath: string,
  ): Promise<OpenAI.Audio.TranscriptionVerbose> {
    const fileStream = require('fs').createReadStream(filePath);
    console.log('Transcribing file:', filePath);
    console.log('File size:', (await fs.stat(filePath)).size);
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: fileStream,
        model: 'whisper-1',
        language: 'en',
        response_format: 'verbose_json',
        timestamp_granularities: ['word'],
      });

      return response;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}

export default new WhisperAPI();

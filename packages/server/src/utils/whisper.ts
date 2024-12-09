import OpenAI from 'openai';
import { config } from '@config';
import { promises as fs, createReadStream } from 'fs';

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
    const fileStream = createReadStream(filePath);
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
      console.log('Whisper transcription response:', response);
      // await fs.unlink(filePath);
      return response;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}

export default new WhisperAPI();

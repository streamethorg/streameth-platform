import { translationsQueue } from '@utils/redis';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import * as path from 'path';
import StorageService from '@utils/s3';
import { ProcessingStatus } from '@interfaces/session.interface';
import Session from '@models/session.model';
import { createAssetFromUrl } from '@utils/livepeer';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { HfInference, HfInferenceEndpoint } from "@huggingface/inference";
import SessionService from "@services/session.service";
import { HttpException } from "@exceptions/HttpException";

interface TranslationJob {
  sessionId: string;
  targetLanguage: string;
}

const hfToken = process.env.HF_TOKEN;
if (!hfToken) {
  console.error("❌ HF_TOKEN is not set in environment variables");
  process.exit(1);
}

const inference = new HfInference(hfToken);

// Map of language codes to TTS models
const TTS_MODELS = {
  'es': 'facebook/mms-tts-spa',
  'en': 'facebook/mms-tts-eng',
  'fr': 'facebook/mms-tts-fra',
  'de': 'facebook/mms-tts-deu',
  'it': 'facebook/mms-tts-ita',
  'ja': 'facebook/mms-tts-jpn',
  'ko': 'facebook/mms-tts-kor',
  'pt': 'facebook/mms-tts-por',
  'ru': 'facebook/mms-tts-rus',
  'zh': 'facebook/mms-tts-cmn'
};

const consumer = async () => {
  console.log("🚀 Starting session translations worker...");
  const queue = await translationsQueue();
  queue.process(async (job) => {
    const { sessionId, targetLanguage } = job.data;
    console.log(`🔄 Processing translation for session ${sessionId} to language ${targetLanguage}... 🚀`);
    try {
      const sessionService = new SessionService();
      const session = await sessionService.get(sessionId);
      if (!session.transcripts || !session.transcripts.text) {
        console.error("❌ No transcription found for session:", sessionId);
        throw new HttpException(400, 'Session must have transcriptions before translation');
      }
      const originalText = session.transcripts.text;
      console.log("📝 Original transcript found. Starting text-to-text translation...");

      // Update session status to translating
      await Session.findByIdAndUpdate(sessionId, {
        $set: {
          [`translations.${targetLanguage}`]: { 
            status: ProcessingStatus.translating 
          }
        }
      });

      // Perform text translation
      const translationResponse = await inference.translation({
        model: 'facebook/mbart-large-50-many-to-many-mmt',
        inputs: originalText,
        parameters: {
          "src_lang": "en_XX",
          "tgt_lang": targetLanguage
        }
      }).catch(error => {
        console.error("❌ Translation API error:", error);
        throw new Error(`Translation failed: ${error.message}`);
      });

      // Store translated text immediately
      console.log("🔤 Translation complete:", translationResponse);
      await Session.findByIdAndUpdate(sessionId, {
        $set: {
          [`translations.${targetLanguage}`]: {
            status: ProcessingStatus.translating,
            text: translationResponse.translation_text
          }
        }
      });
      console.log("💾 Session updated with translated transcript.");

      try {
        // Text-to-speech conversion for the translated text
        console.log("🔊 Converting translated text to speech...");
        
        // Get the appropriate TTS model for the target language
        const ttsModel = TTS_MODELS[targetLanguage] || TTS_MODELS['en']; // Default to English if language not supported
        console.log(`Using TTS model: ${ttsModel}`);

        const endpoint = new HfInferenceEndpoint(
          `https://huggingface.co/facebook/${ttsModel}`,
          hfToken
        );

        const audioBlob = await endpoint.textToSpeech({
          inputs: translationResponse.translation_text,
        });

        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);
        const audioFilePath = path.join(tmpdir(), `${session._id}-${targetLanguage}.mp3`);
        await fs.promises.writeFile(audioFilePath, audioBuffer);
        console.log("🔊 Audio file created at:", audioFilePath);

        // Create a new asset for the audio
        console.log("⏫ Uploading audio to Livepeer...");
        const newTitle = `${session.name} [${targetLanguage}] Audio`;
        const audioAsset = await createAssetFromUrl(newTitle, audioFilePath);

        // Update session with audio asset and mark as completed
        await Session.findByIdAndUpdate(sessionId, {
          $set: {
            [`translations.${targetLanguage}`]: {
              status: ProcessingStatus.completed,
              text: translationResponse.translation_text,
              assetId: audioAsset
            }
          }
        });
        console.log("🎉 Session translation and audio completed successfully for session:", sessionId);

      } catch (audioError) {
        console.error("❌ Error in audio processing:", audioError);
        // Even if audio fails, keep the translation but mark it accordingly
        await Session.findByIdAndUpdate(sessionId, {
          $set: {
            [`translations.${targetLanguage}`]: {
              status: ProcessingStatus.audioFailed,
              text: translationResponse.translation_text
            }
          }
        });
        // Don't throw here - we want to keep the translation even if audio fails
      }

      return true;
    } catch (error) {
      console.error("❌ Error processing session translation:", error);
      if (job.data.sessionId) {
        await Session.findByIdAndUpdate(job.data.sessionId, {
          $set: {
            [`translations.${targetLanguage}`]: { 
              status: ProcessingStatus.failed 
            }
          }
        });
      }
      throw error;
    }
  });
};

const init = async () => {
  try {
    console.log("🚀 Initializing session translations worker...");
    if (!dbConnection.url) {
      console.error("❌ Database URL is not configured");
      throw new Error("Database URL is not configured");
    }
    console.log("🔌 Connecting to database...");
    await connect(dbConnection.url, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Database connected successfully");

    await consumer();
    console.log("✅ Worker initialization completed.");
  } catch (err) {
    console.error("❌ Worker initialization failed:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection in session translations worker:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception in session translations worker:", error);
  process.exit(1);
});

init().catch((error) => {
  console.error("❌ Fatal error during session translations worker initialization:", error);
  process.exit(1);
}); 
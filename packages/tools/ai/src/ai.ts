import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function createTranscription(
  audioFilePath: string
): Promise<void> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: "whisper-1",
    response_format: "text",
    temperature: 0.3,
  });

  console.log(transcription);
}

export async function createSummary(
  textFilePath: string
): Promise<string | null> {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content: "Say this is a test\n" }],
  });

  console.log(stream.choices[0].message.content);
  return stream.choices[0].message.content;
}

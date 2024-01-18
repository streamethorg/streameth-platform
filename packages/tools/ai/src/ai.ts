import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function createTranscription(
  filePath: string,
  resultPath: string,
  fileName: string
): Promise<void> {
  if (!fs.existsSync(filePath)) {
    console.log("File does not exist");
    return;
  }

  if (!fs.existsSync(resultPath)) {
    fs.mkdirSync(resultPath, { recursive: true });
  }

  console.log(`Transcribing ${filePath}...`);
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "text",
      temperature: 0.3,
    });

    if (transcription) {
      fs.writeFileSync(path.join(resultPath, fileName), String(transcription));
      console.log(`Transcription saved to ${resultPath}`);
    } else {
      console.log("No transcription data received.");
    }
  } catch (error) {
    console.error("Error during transcription:", error);
  }
}

export async function createSummary(
  textFilePath: string,
  fileName: string
): Promise<void> {
  if (!fs.existsSync(textFilePath)) {
    fs.mkdirSync(textFilePath, { recursive: true });
  }

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{ role: "user", content: "Say this is a test\n" }],
  });

  console.log(stream.choices[0].message.content);
  if (!stream.choices[0].message.content) {
    console.log("Something went wrong making the summary");
  }

  fs.writeFileSync(
    path.join(textFilePath, fileName),
    String(stream.choices[0].message.content)
  );
  console.log(`Transcription saved to ${textFilePath}`);
}

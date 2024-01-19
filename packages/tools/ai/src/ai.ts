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
  transcriptedFilePath: string,
  textFilePath: string,
  fileName: string
): Promise<void> {
  if (!fs.existsSync(textFilePath)) {
    fs.mkdirSync(textFilePath, { recursive: true });
  }

  if (!fs.existsSync(transcriptedFilePath)) {
    console.log("File does not exist");
    return;
  }

  const input_text = fs.readFileSync(transcriptedFilePath);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You, as an AI, have experience in the crypto field. Try to avoid names. Summarize this text given by the user. It will be delimited by triple single quotes for a description for a video:\\n\\n'''${input_text}'''`.\n\nThe summary is meant for users to understand what the video is about, before watching the actual video.",
      },
      {
        role: "user",
        content: `'''${input_text}'''`,
      },
    ],
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0.4,
    presence_penalty: 0,
  });

  console.log(response.choices[0].message.content);
  if (!response.choices[0].message.content) {
    console.log("Something went wrong making the summary");
  }

  fs.writeFileSync(
    path.join(textFilePath, fileName),
    String(response.choices[0].message.content)
  );
  console.log(`Transcription saved to ${textFilePath}`);
}

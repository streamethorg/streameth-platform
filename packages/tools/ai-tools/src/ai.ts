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
): Promise<string> {
  if (!fs.existsSync(textFilePath)) {
    fs.mkdirSync(textFilePath, { recursive: true });
  }

  if (!fs.existsSync(transcriptedFilePath)) {
    throw new Error("File does not exist");
  }

  const input_text = fs.readFileSync(transcriptedFilePath);

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
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

  const summary = response.choices[0].message.content;
  if (!summary) {
    throw new Error("Something went wrong making the summary");
  }
  console.log(summary);

  fs.writeFileSync(path.join(textFilePath, fileName), String(summary));
  console.log(`Transcription saved to ${textFilePath}`);

  return summary;
}

export async function createLabels(
  transcriptedFilePath: string
): Promise<string[]> {
  if (!fs.existsSync(transcriptedFilePath)) {
    throw new Error("File does not exist");
  }

  const input_text = fs.readFileSync(transcriptedFilePath);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "Objective: Use AI to assign a minimum of 5 labels to a video based on its transcription. The system avoids names, but city names are included if they are prominently featured in the video. Each label is limited to a maximum of 2 words.\n\nLabel Format: {label}, {label}, {label}, {label}\n\nLabel List:\n- cryptocurrency\n- biology\n- ethereum\n- bitcoin\n- NFT\n- art\n- developers\n- artists\n- music\n- cybersecurity\n- web3\n- workshop\n- panel talk\n- social media\n- community building\n- machine learning\n- IoT\n- AI\n- VR\n- virtual reality\n- AR\n- augmented reality\n- sustainability\n- genetics\n- health tech\n- biotech\n- medical research\n- fintech\n- desci\n- defi\n- gaming\n- film\n- streaming\n- digital media\n- education\n- human rights\n- venture capital\n- economics\n- automotive\n- space exploration\n- agriculture\n- retail\n- data science\n- blockchain\n- cloud computing\n- asia\n- europe\n- middle east\n- africa\n- north america\n- south america\n- UX design\n- user interface\n- innovation\n- e-learning\n- social networking\n- privacy\n- legal\n- urban planning\n- nanotechnology\n- quantum computing\n- social\n- mental health\n- mindfulness\n- e-sports\n- fitness\n- food\n- nutrition\n- ethics\n- sociology\n- marketing\n- branding\n- history\n- earth\n- travel\n- lifestyle\n\nTranscription Input: The transcription is provided within triple single quotes: '''${input_text}'''.",
      },
      {
        role: "user",
        content: `'''${input_text}'''`,
      },
    ],
    temperature: 0,
    max_tokens: 256,
    top_p: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const labels = response.choices[0].message.content;
  if (!labels) {
    throw new Error("Something went wrong making the summary");
  }
  console.log(labels);

  return labels.split(",").map((label) => label.trim());
}

import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import nlp from "compromise";
import { ITranscript } from "streameth-new-server/src/interfaces/transcribe.interface";
import { ICaptionOptions } from "@/types/constants";
type Word = { word: string; start: number; end: number };

const Captions: React.FC<{
  isVertical: boolean;
  transcription: ITranscript;
  captionOptions: ICaptionOptions;
  startAt: number;
  frameRate: number;
}> = ({ isVertical, transcription, captionOptions, startAt, frameRate }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / frameRate + startAt;

  const { enabled, position, font, color, baseColor, size } = captionOptions;

  // Position determines if captions are at top, middle or bottom of the screen
  const captionPosition =
    position === "top" ? "top" : position === "middle" ? "middle" : "bottom";

  // Memoized NLP processing to split sentences into shorter, more suitable TikTok-like captions
  const { refinedCaptions, captionWordGroups } = useMemo(() => {
    const maxCaptionLength = 30; // Define maximum character length for each caption
    const doc = nlp(transcription.text);
    let sentences = doc.sentences().out("array"); // Extract sentences from the text using NLP

    let refinedCaptions: string[] = [];
    let captionWordGroups: Word[][] = [];
    let wordPointer = 0;

    // Step 1: Split sentences into smaller chunks for refined captions
    sentences.forEach((sentence: string) => {
      while (sentence.length > maxCaptionLength) {
        let splitIndex = sentence.lastIndexOf(" ", maxCaptionLength);
        if (splitIndex === -1) {
          splitIndex = maxCaptionLength;
        }
        refinedCaptions.push(sentence.slice(0, splitIndex));
        sentence = sentence.slice(splitIndex).trim(); // Continue with the rest of the sentence
      }
      refinedCaptions.push(sentence); // Add the remaining chunk
    });

    refinedCaptions.forEach((sentence) => {
      // Step 2: Map each refined caption to a group of words
      const sentenceWords = sentence.split(/[\s-]+/);

      const lineWords: Word[] = [];

      sentenceWords.forEach(() => {
        if (wordPointer < transcription.chunks.length) {
          lineWords.push(transcription.chunks[wordPointer]);
          wordPointer++;
        }
      });

      if (lineWords.length > 0) {
        captionWordGroups.push(lineWords); // Associate words with the refined caption
      }
    });

    return { refinedCaptions, captionWordGroups };
  }, [transcription]);

  // Find the current word index based on time
  let currentWordIndex = transcription.chunks.findIndex(
    (word) => word.start <= currentTime && word.end >= currentTime
  );

  if (currentWordIndex === -1) {
    // If no current word, find the last word before the current time
    for (let i = transcription.chunks.length - 1; i >= 0; i--) {
      if (transcription.chunks[i].end <= currentTime) {
        currentWordIndex = i;
        break;
      }
    }

    if (currentWordIndex === -1) {
      currentWordIndex = 0; // Default to the first word
    }
  }

  const currentCaptionIndex = captionWordGroups.findIndex((wordGroup) => {
    const firstWord = wordGroup[0];
    const lastWord = wordGroup[wordGroup.length - 1];
    return currentTime >= firstWord.start && currentTime <= lastWord.end;
  });

  const wordsToDisplay = captionWordGroups[currentCaptionIndex] || [];

  if (isVertical) {
    return (
      <div
        className={`z-20 captions absolute w-full text-center p-2 rounded`}
        style={{
          fontFamily: font,
          [captionPosition === "middle" ? "top" : captionPosition]:
            captionPosition === "top"
              ? "20%"
              : captionPosition === "middle"
                ? "50%"
                : "5%",
          transform:
            captionPosition === "top"
              ? "translateY(-50%)"
              : captionPosition === "middle"
                ? "translateY(-50%)"
                : "translateY(0)",
        }}
      >
        {wordsToDisplay.map((word, index) => (
          <span
            key={index}
            className={`inline-block drop-shadow-[0_1.2px_1.2px_rgba(1,0,0,0.8)] mx-2 ${
              word.start <= currentTime && word.end >= currentTime
                ? "font-bold"
                : ""
            }`}
            style={{
              color:
                word.start <= currentTime && word.end >= currentTime
                  ? color
                  : baseColor,
              fontSize: `${size}px`,
            }}
          >
            {word.word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`z-20 captions absolute w-full text-center bg-opacity-50 p-2 rounded`}
      style={{
        fontFamily: font,
        [captionPosition === "middle" ? "top" : captionPosition]:
          captionPosition === "top"
            ? "5%"
            : captionPosition === "middle"
              ? "50%"
              : "5%",
        transform:
          captionPosition === "middle" ? "translateY(-50%)" : "translateY(0)",
      }}
    >
      {wordsToDisplay.map((word, index) => (
        <span
          key={index}
          className={`inline-block drop-shadow-[0_1.2px_1.2px_rgba(1,0,0,0.8)] mx-2 ${
            word.start <= currentTime && word.end >= currentTime
              ? "font-bold"
              : ""
          }`}
          style={{
            color:
              word.start <= currentTime && word.end >= currentTime
                ? color
                : baseColor,
            fontSize: `${size}px`,
          }}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
};

export default Captions;

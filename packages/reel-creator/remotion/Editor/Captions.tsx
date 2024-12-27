import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import nlp from "compromise";

type Word = { word: string; start: number; end: number };

type CaptionsProps = {
  isVertical: boolean;
  transcription: {
    text: string;
    words: Word[];
  };
  captionEnabled: boolean;
  captionPosition: string;
  captionFont: string;
  captionColor: string;
  frameRate: number;
  startAt: number;
};

const Captions: React.FC<CaptionsProps> = ({
  isVertical,
  transcription,
  captionEnabled,
  captionPosition,
  captionFont,
  captionColor,
  frameRate,
  startAt,
}) => {
  const frame = useCurrentFrame();
  const currentTime = frame / frameRate + startAt;

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
        if (wordPointer < transcription.words.length) {
          lineWords.push(transcription.words[wordPointer]);
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
  let currentWordIndex = transcription.words.findIndex(
    (word) => word.start <= currentTime && word.end >= currentTime
  );

  if (currentWordIndex === -1) {
    // If no current word, find the last word before the current time
    for (let i = transcription.words.length - 1; i >= 0; i--) {
      if (transcription.words[i].end <= currentTime) {
        currentWordIndex = i;
        break;
      }
    }

    if (currentWordIndex === -1) {
      currentWordIndex = 0; // Default to the first word
    }
  }

  // Step 3: Find the current caption and the corresponding word group
  const currentCaptionIndex = captionWordGroups.findIndex((wordGroup) => {
    const firstWord = wordGroup[0];
    const lastWord = wordGroup[wordGroup.length - 1];
    return currentTime >= firstWord.start && currentTime <= lastWord.end;
  });

  const currentCaption = refinedCaptions[currentCaptionIndex] || "";
  const wordsToDisplay = captionWordGroups[currentCaptionIndex] || [];

  if (!captionEnabled) {
    return null;
  }

  if (isVertical) {
    return (
      <div
        className={`z-20 captions ${captionPosition} absolute w-full text-center p-2 rounded`}
        style={{
          fontFamily: captionFont,
          top: '20%', // Position in the middle of the top half
          transform: 'translateY(-50%)', // Center vertically
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
                  ? captionColor
                  : "white",
              fontSize: "75px",
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
      className={`z-20 captions ${captionPosition} absolute w-full text-center bg-opacity-50 p-2 rounded`}
      style={{
        fontFamily: captionFont,
        bottom: '5%', // Add margin from the bottom
        transform: 'translateY(0)', // Ensure it stays at the bottom
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
                ? captionColor
                : "white",
            fontSize: "50px",
          }}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
};

export default Captions;

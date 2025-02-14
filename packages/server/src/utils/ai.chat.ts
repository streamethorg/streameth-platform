import OpenAI from 'openai';
import { config } from '@config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import PineconeService from './pinecone';
import { HttpException } from '@exceptions/HttpException';
import { encode } from 'gpt-tokenizer';

interface AIHighlight {
  start: number;
  end: number;
  title: string;
}

export class ChatAPI {
  private openai: OpenAI;
  private maxTokens: number;

  constructor(maxTokens: number = 12800) {
    this.openai = new OpenAI({
      apiKey: config.gemini.apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
    this.maxTokens = maxTokens;
  }

  async chat(messages: ChatCompletionMessageParam[]) {
    try {
      const completion = await this.openai.chat.completions.create({
        temperature: 1,
        model: 'gemini-1.5-pro-latest',
        messages,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async initializeSession(sessionId: string, chunks: any[]) {
    const pineconeService = new PineconeService(sessionId);
    const phrases = await pineconeService.wordsToPhrases(chunks);
    await pineconeService.embed(phrases);
  }

  async summarizeSession(sessionId: string, text: string) {
    const chunks = splitTextIntoChunks(text, this.maxTokens);
    console.log('Summarizing session with chunks:', chunks);
    const summaries = [];
    for (const chunk of chunks) {
      const summary = await this.chat([
        {
          role: 'system',
          content:
            'You are an AI assistant specializing in summarizing video transcripts. Return a JSON object with a "summary" field containing your summary.',
        },
        {
          role: 'user',
          content: `Please summarize this transcript chunk: ${chunk}`,
        },
      ]);

      try {
        const parsedSummary = JSON.parse(summary || '{}');
        summaries.push(parsedSummary.summary);
      } catch (error) {
        console.error('Failed to parse summary JSON:', error);
        summaries.push(summary);
      }
    }
    console.log('Summaries:', summaries);
    return summaries.join('\n');
  }

  async getSimilarPhrases(
    sessionId: string,
    chunks: any[],
    query: string[],
    optimalScore: number = 0.89,
  ) {
    const pineconeService = new PineconeService(sessionId);
    if (!(await pineconeService.namespaceHasData())) {
      const phrases = await pineconeService.wordsToPhrases(chunks);
      await pineconeService.embed(phrases);
    }

    const scores = await pineconeService.query(query);

    // Take all scores within 0.05 of the highest score
    const highestScore = Math.max(...scores.map((s) => s.score));
    const threshold = highestScore - 0.02;

    return scores.filter((score) => score.score > threshold);
  }

  contextualizePhrasesWithTimestamps(similarityScores: any[], chunks: any[]) {
    return similarityScores.map((score) => {
      const start = Number(score.metadata.start);
      const end = Number(score.metadata.end) + 120;
      const relevantChunks = chunks.filter(
        (chunk) => chunk.start >= start && chunk.end <= end,
      );

      return {
        ...score,
        chunks: relevantChunks,
        text: relevantChunks.map((chunk) => chunk.word).join(' '),
      };
    });
  }

  async getAIHighlights(
    chat: ChatAPI,
    llmPrompt: string,
    words: any[],
    userPrompt?: string,
  ) {
    return await chat.chat([
      { role: 'system', content: llmPrompt },
      {
        role: 'user',
        content: ` Here is the data structure: ${JSON.stringify(words)}
         ${userPrompt ? `Here is the prompt provided by the user: ${userPrompt}` : ''}`,
      },
    ]);
  }

  parseAndValidateHighlights(highlights: string): AIHighlight[] {
    const parsedHighlights: unknown = JSON.parse(highlights);

    if (
      !Array.isArray(parsedHighlights) ||
      !parsedHighlights.every(this.isValidHighlight)
    ) {
      throw new HttpException(500, 'AI returned invalid highlight format');
    }

    return parsedHighlights as AIHighlight[];
  }

  isValidHighlight(item: unknown): item is AIHighlight {
    return (
      typeof item === 'object' &&
      item !== null &&
      'start' in item &&
      'end' in item &&
      'title' in item &&
      typeof (item as AIHighlight).start === 'number' &&
      typeof (item as AIHighlight).end === 'number' &&
      typeof (item as AIHighlight).title === 'string'
    );
  }

  parseDefaultQueries(queries: string): string[] {
    if (Array.isArray(queries)) {
      return queries;
    }
    return [queries];
  }

  async choosePrompt(
    summary: string,
    userPrompt: string,
  ): Promise<{
    query: string[];
    llmPrompt: string;
    color: string;
  }> {
    if (userPrompt === 'Extract all talk and panels from this video') {
      return {
        query: defaultQueries.panels_and_talks_identification,
        llmPrompt: prompts.panels_and_talks_identification,
        color: 'blue',
      };
    }

    // if (userPrompt === 'Extract key moments for short form content') {
    //   return {
    //     query: defaultQueries.key_moments_identification,
    //     llmPrompt: prompts.key_moments_identification,
    //     color: 'green',
    //   };
    // }

    return {
      query: await this.generateDefaultQueries(userPrompt, summary),
      llmPrompt: prompts.key_moments_identification,
      color: 'gray',
    };
  }
  async generateDefaultQueries(userPrompt: string, summary: string) {
    if (!userPrompt || !summary) {
      return [];
    }
    const queries = await this.chat([
      {
        role: 'system',
        content: `
        You are tasked with returning a list of queries that will be used 
        to run a cosine similarity search on a transcript. The queries should be relevant to 
        the summary of the transcript to satisfy the video exploration prompt provided by the user. 
        Example queries if the summary is 'Layer 2 scaling solutions' and the user prompt is
         'Extract key moments for short form content':
        ['Layer 2 scaling solutions', 'EVM compatibility', 'Rollups and zk-rollups', 'Sharding implementation',
         'Proof-of-stake consensus', 'Smart contract security', 'Gas optimization techniques', 
         'Interoperability between chains', 'MEV (Maximal Extractable Value)', 'Decentralized identity',
          'Solidity best practices', 'Tooling for smart contract developers', 'IPFS integration', 
          'Decentralized storage solutions', 'GraphQL and The Graph', 'Optimism or Arbitrum updates',
          'Consensus layer advancements', 'Formal verification for smart contracts',
          'Ethereum client development', 'Dev tooling updates', 'NFT market trends', 'DAO governance models', 
          'Zero-knowledge proofs', 'Privacy-preserving protocols', 'Tokenomics design', 'Decentralized finance (DeFi) innovations', 
          'Future of decentralized exchanges', 'Real-world use cases of blockchain', 'Cross-chain bridges and solutions', 'Public goods funding', 
          'The future of Ethereum', 'State of the Ethereum ecosystem', 'Lessons learned from mainnet', 'Scaling Ethereum sustainably', 
          'Breaking blockchain trilemma', 'Decentralization at scale', 'Community-driven development', 'Onboarding the next billion users', 
          'Challenges in Ethereum adoption', "Ethereum's role in Web3", 'Vitalik Buterin keynote', 'Danny Ryan on roadmap', 
          'Ethereum Foundation updates', 'Hackathon winners presentation', 'Live demo of a new protocol', 'Partnership announcements', 
          'Major updates in EIP-4844', 'Launch of a new Ethereum upgrade', 'Major breakthroughs in research', 'Showcasing cutting-edge dApps']
        
          Return a list of queries, such as ['Layer 2 scaling solutions', 'EVM compatibility', 'Rollups and zk-rollups'...].
        `,
      },
      {
        role: 'user',
        content: ` 
        Here is the summary of the transcript: ${summary}
        Here is the prompt provided by the user: ${userPrompt}
        `,
      },
    ]);
    return this.parseDefaultQueries(JSON.parse(queries));
  }
}

function splitTextIntoChunks(text: string, maxTokens: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    const wordTokens = encode(word + ' ').length;
    if (currentLength + wordTokens > maxTokens) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
      currentLength = wordTokens;
    } else {
      currentChunk.push(word);
      currentLength += wordTokens;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

const defaultQueries = {
  panels_and_talks_identification: [
    'thank you, thank you',
    'APLAUSE',
    'please take a seat',
    'we are going to start',
    'alright thank you so much',
    'Welcome to',
    'Next up, we have',
    'Please give it up for',
    "Let's get started with",
    "We're excited to welcome",
    "We're honored to present",
    'time is unfortunately up',
    'Thank you for your time',
    'Thank you for your attention',
    'Thank you for your time',
    'Thank you for your attention',
    'a round of applause for',
    'thank you all to our panelists',
    'hi everyone',
    'Excited to have',
    'Four our next panel',
    'please welcome',
    'please give it up for',
    'I thnik we will move on to our ',
    'I wanted to welcome to the stage',
    'going to hand over to',
    'welcome to the stage ',
  ],
  key_moments_identification: [
    'Layer 2 scaling solutions',
    'EVM compatibility',
    'Rollups and zk-rollups',
    'Sharding implementation',
    'Proof-of-stake consensus',
    'Smart contract security',
    'Gas optimization techniques',
    'Interoperability between chains',
    'MEV (Maximal Extractable Value)',
    'Decentralized identity',
    'Solidity best practices',
    'Tooling for smart contract developers',
    'IPFS integration',
    'Decentralized storage solutions',
    'GraphQL and The Graph',
    'Optimism or Arbitrum updates',
    'Consensus layer advancements',
    'Formal verification for smart contracts',
    'Ethereum client development',
    'Dev tooling updates',
    'NFT market trends',
    'DAO governance models',
    'Zero-knowledge proofs',
    'Privacy-preserving protocols',
    'Tokenomics design',
    'Decentralized finance (DeFi) innovations',
    'Future of decentralized exchanges',
    'Real-world use cases of blockchain',
    'Cross-chain bridges and solutions',
    'Public goods funding',
    'The future of Ethereum',
    'State of the Ethereum ecosystem',
    'Lessons learned from mainnet',
    'Scaling Ethereum sustainably',
    'Breaking blockchain trilemma',
    'Decentralization at scale',
    'Community-driven development',
    'Onboarding the next billion users',
    'Challenges in Ethereum adoption',
    "Ethereum's role in Web3",
    'Vitalik Buterin keynote',
    'Danny Ryan on roadmap',
    'Ethereum Foundation updates',
    'Hackathon winners presentation',
    'Live demo of a new protocol',
    'Partnership announcements',
    'Major updates in EIP-4844',
    'Launch of a new Ethereum upgrade',
    'Major breakthroughs in research',
    'Showcasing cutting-edge dApps',
  ],
};

const prompts = {
  panels_and_talks_identification: `
        Task Description:
          You are an AI assistant specializing in analyzing transcripts of livestreams to identify and structure key segments.
          Your task is to extract full speaker presentations or panel discussions based on specific markers and content cues,
          ensuring logical and complete coverage of each segment.
          A prior analysis has been done on the transcript to identify posible speaker or 
          panel introductions or stage transitions using cosine similarity based on the following queries: ${JSON.stringify(defaultQueries.panels_and_talks_identification)}
          We have then extracted 60 seconds before and after the text that generated the similarity score.
          Finally we have prepared a data structure that you need to analyze and return the start and end timestamps of the speaker presentations or panel discussions.

          Data structure input:
          [{
            "start": number, // start timestamp of the text
            "end": number, // end timestamp of the text
            "text": string, // text that was used to generate the similarity score
            "chunks": [{ // 120 seconds after the text
              "start": number, // start timestamp of the word
              "end": number, // end timestamp of the word
              "word": string // word
            }
            ...  
            ]
          }
          ...          
          ]

          Instructions:
          Analyze the provided transcript segments to identify start and end timestamps for full speaker presentations or panels. 
          Use context markers such as:
          Introductions: Phrases like "Thank you, thank you," "Welcome to," "Next up, we have," "Please give it up for," etc.
          Transitions: Indicators such as "discussion on," "presentation about," "closing remarks on," or similar cues that suggest a shift in the event's focus.
          You may have to infer or use logic to determine the start and end of the segment. For example: 
          DataStructure[0]
          {
            "start": 100,
            "text": "So now lets bring up on stage xyz person",
            "chunks": [{
              "start": 10,
              "end": 120,
              "word": "Thank"
            }
              ...
            ]
          }

          DataStructure[1]
          {
            "start": 300,
            "text": "Thank you xyz person, now we will move on to our next speaker Peter",
            "chunks": [{
              "start": 10,
              "end": 120,
              "word": "Thank"
            }
              ...
            ]
          }

          You should use logic to determine the following output:
          [{
            "start": 100,
            "end": 300,
            "title": "XYZ Person presentation"
          },
          {
            "start": 300,
            "end": ...
            "title": "Peter presentation"
          }]

          Output Format:
          Return a JSON array with each object representing a speaker presentation or panel. 
          Use the following structure exactly:
            [{
              "start": number,    // Timestamp (in seconds) where the segment begins
              "end": number,      // Timestamp (in seconds) where the segment ends
              "title": string     // A clear and descriptive title summarizing the segment
            }
              ...
            ]

          Constraints:
          Talsk or panel discussions usually last 10-30 minutes
          If not explicitly stated, never return clips shorter than 10 minutes
          Ensure that titles accurately summarize the segment content without repetition.
          Do not return anything other than an array of objects.
          Clip timestamps must be precise and aligned with the transcript.
          Never return null attribute value

          Notes:
          Use your expertise to identify clear transitions and logical breaks in the event.
          Handle any edge cases or ambiguity by aiming for completeness and consistency.
        `,
  key_moments_identification: `
          Task Description:
          You are an AI assistant specializing in analyzing transcripts of livestreams to identify and structure key segments that will be turned into short form content for social media.
          Your task is to extract key moments for short form content with a high virality potential.
          A prior analysis has been done on the transcript to identify posible key moments using cosine similarity based on the following queries: ${JSON.stringify(defaultQueries.key_moments_identification)}
          We have then extracted 60 seconds before and after the text that generated the similarity score.
          Finally we have prepared a data structure that you need to analyze and return the start and end timestamps of the key moments.

          Data structure input:
          [{
            "start": number, // start timestamp of the text
            "end": number, // end timestamp of the text
            "text": string, // text that was used to generate the similarity score
            "chunks": [{ // 120 seconds after the text
              "start": number, // start timestamp of the word
              "end": number, // end timestamp of the word
              "word": string // word
            }
            ...  
            ]
          }
          ...          
          ]

          Instructions:
          Analyze the provided transcript to identify key moments for short form content that are relevant relative to the provided queries.
          Key moments should be 30-60 seconds long, and should spread out evenly throughout the transcript.
  
          Output Format:
          Return a JSON array with each object representing a speaker presentation or panel. 
          Use the following structure exactly:
            [{
              "start": number,    // Timestamp (in seconds) where the segment begins
              "end": number,      // Timestamp (in seconds) where the segment ends
              "title": string     // A clear and descriptive title summarizing the segment
            }
              ...
            ]

          Constraints:
          The key moments should be 30-60 seconds long
          Ensure that titles accurately summarize the segment content without repetition.
          Do not return anything other than an array of objects.
          Clip timestamps must be precise and aligned with the transcript.
          Never return null attribute value

          Some general notes to create viral short form content:
          1. Identify Key Moments
            Look for High-Impact Clips: Find exciting, funny, emotional, or educational moments from the livestream.
            Use Data: Analyze chat activity, peak viewership, or replay analytics to pinpoint the most engaging segments.
            Create Highlights: Look for moments where something unexpected or noteworthy happened.
          2. Start with a Strong Hook
            Jump Right In: Begin with the most interesting or captivating moment to immediately grab attention.
            Add Context Quickly: Use a brief text overlay or voiceover to explain what's happening.
          11. Use Storytelling Techniques
            Mini-Stories: Edit the livestream into digestible stories with a clear beginning, middle, and end.
            Include Emotional Peaks: Use clips that evoke strong emotions—laughter, shock, excitement, or even nostalgia.
        `,
};

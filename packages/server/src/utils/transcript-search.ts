import Fuse from 'fuse.js';
import OpenAI from 'openai';
import { config } from '@config';

interface TranscriptChunk {
  start: number;
  end: number;
  word: string;
}

interface Phrase {
  text: string;
  start: number;
  end: number;
}

export interface SearchResult {
  score: number;
  metadata: {
    start: number;
    end: number;
    text: string;
  };
}

/**
 * TranscriptSearchService - Replaces Pinecone with local search
 * 
 * Uses a hybrid approach:
 * 1. Fuzzy keyword matching (fast, works for most highlight extraction queries)
 * 2. On-demand embeddings via Gemini API (fallback for semantic search)
 */
export class TranscriptSearchService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.gemini.apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
  }

  /**
   * Convert word-level chunks into phrases for searching
   */
  wordsToPhrases(
    chunks: TranscriptChunk[],
    phraseLength: number = 10
  ): Phrase[] {
    const phrases: Phrase[] = [];

    for (let i = 0; i < chunks.length; i += phraseLength) {
      const chunkGroup = chunks.slice(i, i + phraseLength);
      if (chunkGroup.length > 0) {
        phrases.push({
          text: chunkGroup.map((chunk) => chunk.word).join(' '),
          start: chunkGroup[0].start,
          end: chunkGroup[chunkGroup.length - 1].end,
        });
      }
    }

    return phrases;
  }

  /**
   * Primary search method: Fuzzy keyword matching
   * Fast and works well for literal phrase queries like "thank you", "welcome to", etc.
   */
  keywordSearch(
    phrases: Phrase[],
    queries: string[],
    threshold: number = 0.4
  ): SearchResult[] {
    const fuse = new Fuse(phrases, {
      keys: ['text'],
      threshold: threshold,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 3,
    });

    const allMatches: SearchResult[] = [];

    for (const query of queries) {
      const results = fuse.search(query);
      
      for (const result of results) {
        allMatches.push({
          score: 1 - (result.score || 0), // Fuse score is inverted (0 = perfect match)
          metadata: {
            start: result.item.start,
            end: result.item.end,
            text: result.item.text,
          },
        });
      }
    }

    // Deduplicate by start time, keeping highest score
    const uniqueMatches = new Map<number, SearchResult>();
    
    for (const match of allMatches) {
      const start = match.metadata.start;
      if (!uniqueMatches.has(start) || match.score > uniqueMatches.get(start)!.score) {
        uniqueMatches.set(start, match);
      }
    }

    return Array.from(uniqueMatches.values())
      .sort((a, b) => a.metadata.start - b.metadata.start);
  }

  /**
   * Fallback search method: On-demand semantic embeddings
   * Used when keyword search doesn't find enough results or for custom user prompts
   */
  async semanticSearch(
    phrases: Phrase[],
    queries: string[],
    topK: number = 50
  ): Promise<SearchResult[]> {
    if (phrases.length === 0 || queries.length === 0) {
      return [];
    }

    // Generate embeddings for phrases and queries
    const [phraseEmbeddings, queryEmbeddings] = await Promise.all([
      this.generateEmbeddings(phrases.map(p => p.text)),
      this.generateEmbeddings(queries),
    ]);

    const allMatches: SearchResult[] = [];

    // Calculate cosine similarity for each query against all phrases
    for (const queryEmbedding of queryEmbeddings) {
      const scores: { index: number; score: number }[] = [];

      for (let i = 0; i < phraseEmbeddings.length; i++) {
        const score = this.cosineSimilarity(queryEmbedding, phraseEmbeddings[i]);
        scores.push({ index: i, score });
      }

      // Sort by score and take top results
      scores.sort((a, b) => b.score - a.score);
      const topResults = scores.slice(0, topK);

      for (const result of topResults) {
        const phrase = phrases[result.index];
        allMatches.push({
          score: result.score,
          metadata: {
            start: phrase.start,
            end: phrase.end,
            text: phrase.text,
          },
        });
      }
    }

    // Deduplicate by start time, keeping highest score
    const uniqueMatches = new Map<number, SearchResult>();
    
    for (const match of allMatches) {
      const start = match.metadata.start;
      if (!uniqueMatches.has(start) || match.score > uniqueMatches.get(start)!.score) {
        uniqueMatches.set(start, match);
      }
    }

    return Array.from(uniqueMatches.values())
      .sort((a, b) => a.metadata.start - b.metadata.start);
  }

  /**
   * Hybrid search: Try keyword first, fall back to semantic if needed
   */
  async search(
    chunks: TranscriptChunk[],
    queries: string[],
    options: {
      minResults?: number;
      useSemanticFallback?: boolean;
      keywordThreshold?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const {
      minResults = 5,
      useSemanticFallback = true,
      keywordThreshold = 0.4,
    } = options;

    const phrases = this.wordsToPhrases(chunks);
    
    // Try keyword search first
    let results = this.keywordSearch(phrases, queries, keywordThreshold);

    // If not enough results and semantic fallback is enabled, try semantic search
    if (results.length < minResults && useSemanticFallback) {
      console.log(`Keyword search found ${results.length} results, trying semantic search...`);
      const semanticResults = await this.semanticSearch(phrases, queries);
      
      // Merge results, preferring higher scores
      const mergedMap = new Map<number, SearchResult>();
      
      for (const result of [...results, ...semanticResults]) {
        const start = result.metadata.start;
        if (!mergedMap.has(start) || result.score > mergedMap.get(start)!.score) {
          mergedMap.set(start, result);
        }
      }
      
      results = Array.from(mergedMap.values())
        .sort((a, b) => a.metadata.start - b.metadata.start);
    }

    return results;
  }

  /**
   * Generate embeddings using Gemini API
   */
  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const BATCH_SIZE = 100;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      
      // Use Gemini's embedding model
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-004',
        input: batch,
      });

      for (const embedding of response.data) {
        allEmbeddings.push(embedding.embedding);
      }
    }

    return allEmbeddings;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }
}

export default new TranscriptSearchService();


import {
  Pinecone,
  RecordMetadata,
  ScoredPineconeRecord,
} from '@pinecone-database/pinecone';

import { config } from '@config';

const pc = new Pinecone({
  apiKey: config.pinecone.apiKey,
});

export default class PineconeService {
  private pc: Pinecone;
  private model: string;
  private indexName: string;
  private namespace: string;
  constructor() {
    this.pc = pc;
    this.model = 'multilingual-e5-large';
    this.indexName = 'transcripts';
    this.namespace = 'all-transcripts';
  }

  async createIndex() {
    try {
      await this.pc.createIndex({
        name: this.indexName,
        dimension: 1024,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      });
    } catch (error) {
      console.error('Error creating index:', error);
    }
  }

  async embed(
    transcriptId: string,
    phraseArray: { text: string; start: number; end: number }[],
  ): Promise<void> {
    if (phraseArray.length === 0) {
      throw new Error('phraseArray is empty');
    }

    const BATCH_SIZE = 96;
    const allRecords = [];

    for (let i = 0; i < phraseArray.length; i += BATCH_SIZE) {
      const batch = phraseArray.slice(i, i + BATCH_SIZE);

      const embeddings = await this.pc.inference.embed(
        this.model,
        batch.map((phrase) => phrase.text),
        { inputType: 'passage', truncate: 'END' },
      );

      const records = embeddings.map((embedding, index) => {
        if (!embedding.values || embedding.values.length !== 1024) {
          throw new Error(`Invalid embedding at index ${index}`);
        }
        return {
          id: `${transcriptId}-${batch[index].start}-${batch[index].end}`,
          values: Array.from(embedding.values),
          metadata: {
            transcriptId: transcriptId,
            start: batch[index].start,
            end: batch[index].end,
            text: batch[index].text,
          },
        };
      });

      allRecords.push(...records);
    }

    // Upsert records in batches
    const UPSERT_BATCH_SIZE = 100;
    for (let i = 0; i < allRecords.length; i += UPSERT_BATCH_SIZE) {
      const batch = allRecords.slice(i, i + UPSERT_BATCH_SIZE);
      await this.pc
        .index(this.indexName)
        .namespace(this.namespace)
        .upsert(batch);
    }
  }

  async query(
    transcriptId: string,
    queries: string[],
  ): Promise<ScoredPineconeRecord<RecordMetadata>[]> {
    console.log('Querying with:', queries);

    const queryEmbeddings = await this.pc.inference.embed(this.model, queries, {
      inputType: 'query',
    });

    const allMatches: ScoredPineconeRecord<RecordMetadata>[] = [];

    for (const embedding of queryEmbeddings) {
      if (!embedding.values || embedding.values.length !== 1024) {
        console.error('Invalid embedding dimension:', embedding.values?.length);
        continue;
      }

      const queryResponse = await this.pc
        .index(this.indexName)
        .namespace(this.namespace)
        .query({
          topK: 500,
          vector: embedding.values,
          includeValues: false,
          includeMetadata: true,
          filter: {
            transcriptId: transcriptId,
          },
        });

      allMatches.push(...queryResponse.matches);
    }

    // Deduplicate matches based on metadata.start time and combine scores
    const uniqueMatches = new Map<
      number,
      ScoredPineconeRecord<RecordMetadata>
    >();

    allMatches.forEach((match) => {
      const start = Number(match.metadata?.start);
      if (isNaN(start)) return;

      if (
        !uniqueMatches.has(start) ||
        match.score > uniqueMatches.get(start)!.score
      ) {
        uniqueMatches.set(start, match);
      }
    });

    return Array.from(uniqueMatches.values()).sort(
      (a, b) => Number(a.metadata.start) - Number(b.metadata.start),
    );
  }

  async namespaceHasData(): Promise<boolean> {
    try {
      const index = this.pc.index(this.indexName);
      const indexStats = await index.describeIndexStats();

      // Check if namespace exists in the stats
      if (!indexStats.namespaces || !indexStats.namespaces[this.namespace]) {
        return false;
      }

      const count = indexStats.namespaces[this.namespace].recordCount;
      return count > 0;
    } catch (error) {
      console.error(`Error checking namespace data: ${error}`);
      throw new Error(`Failed to check namespace data: ${error.message}`);
    }
  }

  async wordsToPhrases(
    chunks: {
      start: number;
      end: number;
      word: string;
    }[],
  ): Promise<
    {
      text: string;
      start: number;
      end: number;
    }[]
  > {
    // Calculate dynamic phrase length
    // Aim for around 10-20 phrases total, with a minimum of 3 words per phrase
    const phraseLength = 5;
    const phraseArray: {
      text: string;
      start: number;
      end: number;
      embedding?: number[];
    }[] = [];

    // Create phrases from chunks
    for (let i = 0; i < chunks.length; i += phraseLength) {
      const chunkGroup = chunks.slice(i, i + phraseLength);
      if (chunkGroup.length > 0) {
        phraseArray.push({
          text: chunkGroup.map((chunk) => chunk.word).join(' '),
          start: chunkGroup[0].start,
          end: chunkGroup[chunkGroup.length - 1].end,
        });
      }
    }
    return phraseArray;
  }

  async transcriptHasData(): Promise<boolean> {
    try {
      const index = this.pc.index(this.indexName);
      const indexStats = await index.describeIndexStats();

      return indexStats.namespaces[this.namespace].recordCount > 0;
    } catch (error) {
      console.error(`Error checking transcript data: ${error}`);
      throw new Error(`Failed to check transcript data: ${error.message}`);
    }
  }
}

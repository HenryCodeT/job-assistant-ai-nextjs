// src/infrastructure/pinecone/PineconeRepository.ts

import { Pinecone } from '@pinecone-database/pinecone';
import { ICVRepository } from '../cvRepository';
import { CV, SearchResult } from '../../domain/cv';

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'job-assistant-cv-index';

export class PineconeRepository implements ICVRepository {
  private client: Pinecone;

  constructor() {
    this.client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }

  async store(cv: CV): Promise<void> {
    const index = this.client.index(INDEX_NAME);
    const vector = {
      id: cv.id,
      values: cv.embedding,
      metadata: {
        text: cv.text.substring(0, 1000), // Limit text in metadata for size efficiency
        ...cv.metadata,
        storedAt: new Date().toISOString(),
      },
    };
    await index.upsert([vector]);
  }

  async search(queryEmbedding: number[], topK: number = 5): Promise<SearchResult[]> {
    const index = this.client.index(INDEX_NAME);
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    return results.matches.map(match => ({
      id: match.id,
      score: match.score!,
      text: match.metadata?.text as string || '', 
      metadata: match.metadata || {},
    }));
  }
  
  async getById(cvId: string): Promise<CV | null> {
    const index = this.client.index(INDEX_NAME);
    const response = await index.fetch([cvId]);
    const vector = response.records[cvId];
    if (!vector) return null;
    
    return {
        id: cvId,
        text: vector.metadata?.text as string,
        embedding: vector.values!, // Assuming values exist when fetching by ID
        metadata: vector.metadata || {},
    } as CV;
  }
  
  async delete(cvId: string): Promise<void> {
      const index = this.client.index(INDEX_NAME);
      await index.deleteOne(cvId);
  }
}
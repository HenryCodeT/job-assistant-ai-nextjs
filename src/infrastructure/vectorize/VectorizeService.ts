// src/infrastructure/vectorize/VectorizeService.ts

import { chunkText } from '../../utils/text'; 

export interface EmbeddingResult {
  values: number[];
  dimension: number;
}

const VECTORIZE_API_URL = process.env.VECTORIZE_API_URL || 'https://platform.vectorize.io/api';
const VECTORIZE_API_KEY = process.env.VECTORIZE_API_KEY;

export class VectorizeService {
  
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    // Use chunking logic to ensure text fits the model's token limit
    const texts = chunkText(text, 8000, 200); 
    // For simplicity, we use only the first chunk for the main embedding.
    const inputForAPI = texts[0] || text.slice(0, 32000); 
    
    const response = await fetch(`${VECTORIZE_API_URL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VECTORIZE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: inputForAPI,
        model: 'text-embedding-ada-002',
      }),
    });
    
    if (!response.ok) {
        throw new Error(`Vectorize API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      values: data.data[0].embedding,
      dimension: data.data[0].embedding.length,
    };
  }
}
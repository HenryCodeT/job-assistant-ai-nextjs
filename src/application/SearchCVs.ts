// src/application/SearchCVs.ts

import { VectorizeService } from '../infrastructure/vectorize/VectorizeService';
import { ICVRepository } from '../infrastructure/cvRepository'; 
import { PineconeRepository } from '../infrastructure/pinecone/PineconeRepository';
import { SearchResult } from '../domain/cv';

interface SearchCVsInput {
  queryText: string;
  topK?: number;
}

export class SearchCVs {
  private vectorize: VectorizeService;
  private cvRepository: ICVRepository;

  constructor(
    vectorize: VectorizeService = new VectorizeService(),
    cvRepository: ICVRepository = new PineconeRepository()
  ) {
    this.vectorize = vectorize;
    this.cvRepository = cvRepository;
  }

  async execute(input: SearchCVsInput): Promise<SearchResult[]> {
    // 1. GENERATE QUERY EMBEDDING
    const queryEmbedding = await this.vectorize.generateEmbedding(input.queryText);
    
    // 2. SEARCH SIMILAR VECTORS
    const results = await this.cvRepository.search(
      queryEmbedding.values, 
      input.topK || 5
    );
    
    return results;
  }
}
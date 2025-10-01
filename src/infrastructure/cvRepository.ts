// src/infrastructure/cvRepository.ts

import { CV, SearchResult } from '../domain/cv'; 

/**
 * Contract (Interface) for any service that stores and searches CVs.
 * This adheres to the Dependency Inversion Principle.
 */
export interface ICVRepository {
  store(cv: CV): Promise<void>;
  search(queryEmbedding: number[], topK: number): Promise<SearchResult[]>;
  getById(cvId: string): Promise<CV | null>;
  delete(cvId: string): Promise<void>;
}
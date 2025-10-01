/**
 * Defines the pure data structure for a CV within the system.
 */
export interface CV {
    id: string; // Unique identifier (e.g., 'cv_1700000000')
    text: string; // The full parsed text of the CV
    embedding: number[]; // The numeric embedding vector (e.g., 1536 dimensions)
    metadata: Record<string, any>; // Extra fields (name, source, etc.)
}

/**
 * Defines the data structure after initial parsing (Firecrawl).
 */
export interface ParsedDocument {
    text: string;
    metadata: Record<string, any>;
}

/**
 * Defines the structure of a semantic search result (from Pinecone).
 */
export interface SearchResult {
    id: string;
    score: number;
    text: string;
    metadata: Record<string, any>;
}
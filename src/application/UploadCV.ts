// src/application/UploadCV.ts

import { FirecrawlService } from '../infrastructure/firecrawl/FirecrawlService';
import { VectorizeService } from '../infrastructure/vectorize/VectorizeService';
import { ICVRepository } from '../infrastructure/cvRepository'; 
import { PineconeRepository } from '../infrastructure/pinecone/PineconeRepository';
import { ParsedDocument } from '../domain/cv';

interface UploadCVInput {
  file: Buffer;
  filename: string;
  linkedinUrl?: string; 
}

export class UploadCV {
  private firecrawl: FirecrawlService;
  private vectorize: VectorizeService;
  private cvRepository: ICVRepository;

  constructor(
    firecrawl: FirecrawlService = new FirecrawlService(),
    vectorize: VectorizeService = new VectorizeService(),
    cvRepository: ICVRepository = new PineconeRepository()
  ) {
    this.firecrawl = firecrawl;
    this.vectorize = vectorize;
    this.cvRepository = cvRepository;
  }

  async execute(input: UploadCVInput): Promise<string> {
    let parsedDocument: ParsedDocument;
    
    // 1. PARSE/SCRAPE (Firecrawl): The application logic decides the source
    if (input.linkedinUrl) {
        parsedDocument = await this.firecrawl.scrapeLinkedIn({ url: input.linkedinUrl });
    } else {
        parsedDocument = await this.firecrawl.parseDocument(input.file, input.filename);
    }
    
    // 2. GENERATE EMBEDDINGS (Vectorize)
    const embedding = await this.vectorize.generateEmbedding(parsedDocument.text);

    // 3. STORE (Pinecone Repository)
    const cvId = `cv_${Date.now()}`;
    await this.cvRepository.store({
      id: cvId,
      text: parsedDocument.text,
      embedding: embedding.values,
      metadata: parsedDocument.metadata,
    });
    
    return cvId;
  }
}
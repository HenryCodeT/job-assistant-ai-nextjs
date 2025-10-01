// src/application/GenerateLetter.ts

import { AIService } from '../infrastructure/ai/AIService';
import { ICVRepository } from '../infrastructure/cvRepository'; 
import { PineconeRepository } from '../infrastructure/pinecone/PineconeRepository';

interface GenerateLetterInput {
  cvId: string;
  jobDescription: string;
}

export class GenerateLetter {
  private aiService: AIService;
  private cvRepository: ICVRepository;

  constructor(
    aiService: AIService = new AIService(),
    cvRepository: ICVRepository = new PineconeRepository()
  ) {
    this.aiService = aiService;
    this.cvRepository = cvRepository;
  }

  // Business logic for prompt engineering lives here
  private buildCoverLetterPrompt(cvText: string, jobDesc: string): string {
    return `You are an expert career advisor. Write a professional cover letter (300-400 words) using the following CV and Job Description. Focus on skills matching the job.
CV:
---
${cvText}
---
Job Description:
---
${jobDesc}
---
Generate the cover letter:`;
  }

  async execute(input: GenerateLetterInput): Promise<string> {
    // 1. RETRIEVE CV TEXT (Infrastructure)
    const cv = await this.cvRepository.getById(input.cvId);
    
    if (!cv) {
        throw new Error(`CV with ID ${input.cvId} not found.`);
    }
    
    // 2. BUILD PROMPT (Application Logic)
    const userPrompt = this.buildCoverLetterPrompt(cv.text, input.jobDescription);
    const systemPrompt = 'You are a highly skilled professional copywriter specializing in career materials.';
    
    // 3. GENERATE TEXT (Infrastructure)
    const coverLetter = await this.aiService.generateText(
      systemPrompt,
      userPrompt,
      0.8 // Creative temperature
    );
    
    return coverLetter;
  }
}
// src/infrastructure/firecrawl/FirecrawlService.ts

import { getMimeType } from '../../utils/text'; 
import { ParsedDocument } from '../../domain/cv'; 

const FIRECRAWL_API_URL = process.env.FIRECRAWL_API_URL || 'https://api.firecrawl.dev';
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

// Interfaces specific to Firecrawl's scraping parameters
interface ScrapeLinkedInParams {
  url: string
}

export class FirecrawlService {
  
  async parseDocument(file: Buffer, filename: string): Promise<ParsedDocument> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file)], { type: getMimeType(filename) });
    formData.append('file', blob, filename);

    const response = await fetch(`${FIRECRAWL_API_URL}/v1/parse`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Firecrawl parse error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      text: data.text || data.content,
      metadata: data.metadata || {},
    };
  }
  
  async scrapeLinkedIn(params: ScrapeLinkedInParams): Promise<ParsedDocument> {
    const response = await fetch(`${FIRECRAWL_API_URL}/v1/scrape`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: params.url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
        throw new Error(`Firecrawl scrape error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.markdown || data.content,
      metadata: {
        url: params.url,
        title: data.title,
        description: data.description,
      }
    };
  }
}
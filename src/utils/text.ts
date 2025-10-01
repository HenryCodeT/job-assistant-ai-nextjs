// src/utils/text.ts

/**
 * Divides a long text into chunks with an overlap.
 * Crucial for processing large CVs before generating embeddings.
 */
export function chunkText(
    text: string, 
    chunkSize: number = 4000, 
    overlap: number = 200
  ): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    if (text.length <= chunkSize) {
      return [text];
    }
  
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      // Move 'start' for the next chunk, subtracting the overlap
      start = end - overlap; 
      
      // Stop the loop if we're at the end and there's no overlap left
      if (end === text.length) break;
    }
    
    return chunks;
  }
  
  /**
   * Gets the MIME type based on the file extension.
   */
  export function getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'doc':
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'txt': return 'text/plain';
      default: return 'application/octet-stream';
    }
  }
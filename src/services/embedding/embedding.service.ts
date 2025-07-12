import axios from 'axios';

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class EmbeddingService {
  private apiKey: string;
  private model: string;
  private apiUrl: string;

  constructor(
    apiKey?: string,
    model: string = 'text-embedding-ada-002'
  ) {
    this.apiKey = apiKey || import.meta.env.VITE_OPENAI_API_KEY || '';
    this.model = model;
    this.apiUrl = 'https://api.openai.com/v1/embeddings';
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Clean and prepare text
      const cleanedText = this.cleanText(text);
      
      // Check token limit (8K for ada-002)
      if (this.estimateTokens(cleanedText) > 8000) {
        // Truncate to fit within limits
        const truncatedText = this.truncateText(cleanedText, 8000);
        return this.callEmbeddingAPI(truncatedText);
      }
      
      return this.callEmbeddingAPI(cleanedText);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      // Process in batches to avoid rate limits
      const batchSize = 20;
      const embeddings: number[][] = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const cleanedBatch = batch.map(text => this.cleanText(text));
        
        const response = await axios.post<EmbeddingResponse>(
          this.apiUrl,
          {
            input: cleanedBatch,
            model: this.model,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        embeddings.push(...response.data.data.map(d => d.embedding));
        
        // Add delay to respect rate limits
        if (i + batchSize < texts.length) {
          await this.delay(100);
        }
      }
      
      return embeddings;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error('Failed to generate batch embeddings');
    }
  }

  private async callEmbeddingAPI(text: string): Promise<number[]> {
    const response = await axios.post<EmbeddingResponse>(
      this.apiUrl,
      {
        input: text,
        model: this.model,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.data[0].embedding;
  }

  private cleanText(text: string): string {
    // Remove excessive whitespace
    let cleaned = text.replace(/\s+/g, ' ').trim();
    
    // Remove special characters that don't add meaning
    cleaned = cleaned.replace(/[^\w\s.,!?;:\-()'"]/g, '');
    
    // Normalize quotes
    cleaned = cleaned.replace(/[""]/g, '"').replace(/['']/g, "'");
    
    return cleaned;
  }

  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  private truncateText(text: string, maxTokens: number): string {
    const estimatedChars = maxTokens * 4;
    
    if (text.length <= estimatedChars) {
      return text;
    }
    
    // Try to truncate at a sentence boundary
    let truncated = text.substring(0, estimatedChars);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastExclamation = truncated.lastIndexOf('!');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
    
    if (lastSentenceEnd > estimatedChars * 0.8) {
      truncated = truncated.substring(0, lastSentenceEnd + 1);
    }
    
    return truncated;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
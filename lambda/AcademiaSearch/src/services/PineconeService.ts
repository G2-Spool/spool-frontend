import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export interface VectorChunk {
  id: string;
  content: string;
  metadata: {
    source?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    [key: string]: any;
  };
  score: number;
}

export class PineconeService {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private indexName: string = 'spool-academia'; // Default index name

  constructor(apiKey: string) {
    this.pinecone = new Pinecone({
      apiKey: apiKey,
    });
    
    // Use the same OpenAI instance for embeddings
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || apiKey,
    });
  }

  async searchRelevantChunks(descriptions: string[]): Promise<VectorChunk[]> {
    try {
      console.log('🔍 Starting Pinecone vector search for', descriptions.length, 'descriptions');

      // Generate embeddings for all descriptions
      const embeddings = await this.generateEmbeddings(descriptions);
      
      // Get the index
      const index = this.pinecone.index(this.indexName);

      // Search for each description and collect results
      const allResults: VectorChunk[] = [];
      
      for (let i = 0; i < embeddings.length; i++) {
        try {
          console.log(`🔍 Searching with description ${i + 1}...`);
          
          const queryResponse = await index.query({
            vector: embeddings[i],
            topK: 3, // Get top 3 results per description (15 total, then we'll take top 10)
            includeMetadata: true,
            includeValues: false,
          });

          if (queryResponse.matches) {
            for (const match of queryResponse.matches) {
              allResults.push({
                id: match.id,
                content: match.metadata?.content as string || '',
                metadata: match.metadata || {},
                score: match.score || 0,
              });
            }
          }
        } catch (error) {
          console.error(`Error searching with description ${i + 1}:`, error);
          // Continue with other descriptions even if one fails
        }
      }

      // Remove duplicates and sort by score
      const uniqueResults = this.deduplicateResults(allResults);
      const sortedResults = uniqueResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Take top 10 results

      console.log('✅ Pinecone search completed:', {
        totalMatches: allResults.length,
        uniqueMatches: uniqueResults.length,
        finalResults: sortedResults.length,
        averageScore: sortedResults.reduce((sum, r) => sum + r.score, 0) / sortedResults.length
      });

      return sortedResults;

    } catch (error) {
      console.error('Pinecone search error:', error);
      throw new Error(`Failed to search Pinecone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      console.log('🧮 Generating embeddings for', texts.length, 'texts');
      
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts,
      });

      const embeddings = response.data.map(item => item.embedding);
      
      console.log('✅ Embeddings generated:', {
        count: embeddings.length,
        dimensions: embeddings[0]?.length || 0
      });

      return embeddings;

    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private deduplicateResults(results: VectorChunk[]): VectorChunk[] {
    const seen = new Set<string>();
    const deduplicated: VectorChunk[] = [];

    for (const result of results) {
      if (!seen.has(result.id)) {
        seen.add(result.id);
        deduplicated.push(result);
      }
    }

    return deduplicated;
  }

  // Helper method to check if Pinecone index exists
  async checkIndexExists(): Promise<boolean> {
    try {
      const indexes = await this.pinecone.listIndexes();
      return indexes.indexes?.some(index => index.name === this.indexName) || false;
    } catch (error) {
      console.error('Error checking Pinecone index:', error);
      return false;
    }
  }

  // Helper method to get index stats
  async getIndexStats(): Promise<any> {
    try {
      const index = this.pinecone.index(this.indexName);
      const stats = await index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      return null;
    }
  }
}
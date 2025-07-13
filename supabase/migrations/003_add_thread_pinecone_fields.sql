-- Add fields to threads table for storing Pinecone integration data
ALTER TABLE threads 
ADD COLUMN IF NOT EXISTS mapped_concepts JSONB,
ADD COLUMN IF NOT EXISTS content_chunks JSONB,
ADD COLUMN IF NOT EXISTS concept_embeddings JSONB;

-- Add comment explaining the fields
COMMENT ON COLUMN threads.mapped_concepts IS 'LLM-generated concepts mapped across subjects for the learning goal';
COMMENT ON COLUMN threads.content_chunks IS 'Content chunks retrieved from Pinecone vector search';
COMMENT ON COLUMN threads.concept_embeddings IS 'Embeddings generated for concept search (stored for debugging/analysis)'; 
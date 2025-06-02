-- Add annotated_text column to conversations table
ALTER TABLE conversations ADD COLUMN annotated_text TEXT;

-- Add pattern_annotations column to store pattern positions
ALTER TABLE conversations ADD COLUMN pattern_annotations JSONB;

COMMENT ON COLUMN conversations.annotated_text IS 'The original text with pattern annotations';
COMMENT ON COLUMN conversations.pattern_annotations IS 'JSON array of pattern annotations with positions and metadata';

-- Create index for pattern_annotations for better query performance
CREATE INDEX idx_conversations_pattern_annotations ON conversations USING GIN (pattern_annotations);

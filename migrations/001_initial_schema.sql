CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";


-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  analysis_count INTEGER DEFAULT 0,
  subscription_tier VARCHAR(50) DEFAULT 'demo'
);

-- Analysis sessions
CREATE TABLE analysis_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  session_timestamp TIMESTAMP DEFAULT NOW(),
  file_type VARCHAR(50),
  file_size_kb INTEGER,
  participant_count INTEGER,
  conversation_length_turns INTEGER,
  processing_time_seconds FLOAT,
  analysis_version VARCHAR(20) DEFAULT 'v1.0',
  original_content_deleted_at TIMESTAMP
);

-- Core DNA patterns
CREATE TABLE conversation_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES analysis_sessions(id),
  participant_label VARCHAR(10),
  dna_sequence TEXT,
  pattern_counts JSONB,
  complexity_score FLOAT,
  dominant_patterns TEXT[]
);

-- Extended patterns
CREATE TABLE extended_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES analysis_sessions(id),
  pattern_type VARCHAR(50),
  frequency FLOAT,
  confidence_score FLOAT,
  example_turn_positions INTEGER[],
  contextual_markers JSONB
);

-- Collaboration analysis
CREATE TABLE collaboration_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES analysis_sessions(id),
  complementarity_score FLOAT,
  innovation_potential VARCHAR(20),
  conversation_type VARCHAR(50),
  breakthrough_turns INTEGER[],
  cognitive_roles JSONB
);

-- AI-discovered patterns
CREATE TABLE discovered_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES analysis_sessions(id),
  pattern_name VARCHAR(100),
  pattern_code VARCHAR(10),
  description TEXT,
  frequency FLOAT,
  correlation_data JSONB,
  first_discovered_at TIMESTAMP DEFAULT NOW()
);

-- Aggregated research data
CREATE TABLE pattern_research_db (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_type VARCHAR(50),
  frequency_distribution JSONB,
  correlation_matrix JSONB,
  sample_size INTEGER,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Temporary content storage
CREATE TABLE temp_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES analysis_sessions(id),
  content_encrypted TEXT,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '48 hours')
);


CREATE INDEX idx_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX idx_sessions_timestamp ON analysis_sessions(session_timestamp);
CREATE INDEX idx_dna_session_id ON conversation_dna(session_id);
CREATE INDEX idx_patterns_session_id ON extended_patterns(session_id);
CREATE INDEX idx_patterns_type ON extended_patterns(pattern_type);
CREATE INDEX idx_temp_content_expires ON temp_content(expires_at);
CREATE INDEX idx_collaboration_session ON collaboration_analysis(session_id);
CREATE INDEX idx_research_pattern_type ON pattern_research_db(pattern_type);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DNA Analysis table
CREATE TABLE dna_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  participant_a_dna VARCHAR(50) NOT NULL,
  participant_b_dna VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Metrics table
CREATE TABLE collaboration_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  potential VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation Patterns table
CREATE TABLE conversation_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  pattern_type VARCHAR(100) NOT NULL,
  frequency FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_dna_analysis_conversation_id ON dna_analysis(conversation_id);
CREATE INDEX idx_collaboration_metrics_conversation_id ON collaboration_metrics(conversation_id);
CREATE INDEX idx_conversation_patterns_conversation_id ON conversation_patterns(conversation_id);
CREATE INDEX idx_conversation_patterns_type ON conversation_patterns(pattern_type);

ALTER TABLE conversations 
ADD COLUMN annotated_text TEXT,
ADD COLUMN pattern_annotations JSONB;

ALTER TABLE collaboration_analysis 
RENAME COLUMN session_id TO conversation_id;

ALTER TABLE collaboration_analysis 
DROP CONSTRAINT IF EXISTS collaboration_analysis_session_id_fkey,
ADD CONSTRAINT collaboration_analysis_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- For conversation_dna table (if it exists)
ALTER TABLE conversation_dna 
RENAME COLUMN session_id TO conversation_id;

ALTER TABLE conversation_dna 
DROP CONSTRAINT IF EXISTS conversation_dna_session_id_fkey,
ADD CONSTRAINT conversation_dna_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- Update the unique constraint on collaboration_analysis
ALTER TABLE collaboration_analysis 
DROP CONSTRAINT IF EXISTS collaboration_analysis_session_id_key,
ADD CONSTRAINT collaboration_analysis_conversation_id_key UNIQUE (conversation_id);

ALTER TABLE collaboration_analysis 
ADD COLUMN IF NOT EXISTS score FLOAT;

ALTER TABLE collaboration_analysis 
ADD COLUMN IF NOT EXISTS potential FLOAT;

ALTER TABLE collaboration_analysis 
ALTER COLUMN score TYPE TEXT;

ALTER TABLE collaboration_analysis 
ALTER COLUMN potential TYPE TEXT;

CREATE TABLE IF NOT EXISTS ghost_conversation_analysis (
    id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    ghost_partners JSONB,
    conversational_flow JSONB,
    conversation_dna JSONB,
    ecology_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id)
);


INSERT INTO users (id, email, created_at)
       VALUES (gen_random_uuid(),  'anonymous@example.com', NOW())
       RETURNING id
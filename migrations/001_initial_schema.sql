-- Migration 001: Initial Schema
-- Created: 2024-12-31
-- Description: Core tables for pattern analysis platform

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create migration tracking table first
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

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

-- Record this migration
INSERT INTO schema_migrations (version, name) 
VALUES (1, 'Initial schema creation');

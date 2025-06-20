--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analysis_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    session_timestamp timestamp without time zone DEFAULT now(),
    file_type character varying(50),
    file_size_kb integer,
    participant_count integer,
    conversation_length_turns integer,
    processing_time_seconds double precision,
    analysis_version character varying(20) DEFAULT 'v1.0'::character varying,
    original_content_deleted_at timestamp without time zone
);


--
-- Name: collaboration_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaboration_analysis (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    complementarity_score double precision,
    innovation_potential character varying(20),
    conversation_type character varying(50),
    breakthrough_turns integer[],
    cognitive_roles jsonb,
    score text,
    potential text,
    created_at timestamp with time zone
);


--
-- Name: collaboration_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaboration_metrics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    score integer NOT NULL,
    potential character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: conversation_dna; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_dna (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    participant_label character varying(10),
    dna_sequence text,
    pattern_counts jsonb,
    complexity_score double precision,
    dominant_patterns text[]
);


--
-- Name: conversation_patterns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversation_patterns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    pattern_type character varying(100) NOT NULL,
    frequency double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    title character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    annotated_text text,
    pattern_annotations jsonb
);


--
-- Name: discovered_patterns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discovered_patterns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    session_id uuid,
    pattern_name character varying(100),
    pattern_code character varying(10),
    description text,
    frequency double precision,
    correlation_data jsonb,
    first_discovered_at timestamp without time zone DEFAULT now()
);


--
-- Name: dna_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dna_analysis (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    participant_a_dna character varying(50) NOT NULL,
    participant_b_dna character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: extended_patterns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.extended_patterns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    session_id uuid,
    pattern_type character varying(50),
    frequency double precision,
    confidence_score double precision,
    example_turn_positions integer[],
    contextual_markers jsonb
);


--
-- Name: ghost_conversation_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ghost_conversation_analysis (
    id integer NOT NULL,
    conversation_id uuid,
    ghost_partners jsonb,
    conversational_flow jsonb,
    conversation_dna jsonb,
    ecology_analysis jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ghost_conversation_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ghost_conversation_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ghost_conversation_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ghost_conversation_analysis_id_seq OWNED BY public.ghost_conversation_analysis.id;


--
-- Name: pattern_research_db; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pattern_research_db (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pattern_type character varying(50),
    frequency_distribution jsonb,
    correlation_matrix jsonb,
    sample_size integer,
    last_updated timestamp without time zone DEFAULT now()
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: temp_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.temp_content (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    session_id uuid,
    content_encrypted text,
    expires_at timestamp without time zone DEFAULT (now() + '48:00:00'::interval)
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    last_active timestamp without time zone DEFAULT now(),
    analysis_count integer DEFAULT 0,
    subscription_tier character varying(50) DEFAULT 'demo'::character varying
);


--
-- Name: ghost_conversation_analysis id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ghost_conversation_analysis ALTER COLUMN id SET DEFAULT nextval('public.ghost_conversation_analysis_id_seq'::regclass);


--
-- Name: analysis_sessions analysis_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_sessions
    ADD CONSTRAINT analysis_sessions_pkey PRIMARY KEY (id);


--
-- Name: collaboration_analysis collaboration_analysis_conversation_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_analysis
    ADD CONSTRAINT collaboration_analysis_conversation_id_key UNIQUE (conversation_id);


--
-- Name: collaboration_analysis collaboration_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_analysis
    ADD CONSTRAINT collaboration_analysis_pkey PRIMARY KEY (id);


--
-- Name: collaboration_metrics collaboration_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_metrics
    ADD CONSTRAINT collaboration_metrics_pkey PRIMARY KEY (id);


--
-- Name: conversation_dna conversation_dna_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_dna
    ADD CONSTRAINT conversation_dna_pkey PRIMARY KEY (id);


--
-- Name: conversation_patterns conversation_patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_patterns
    ADD CONSTRAINT conversation_patterns_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: discovered_patterns discovered_patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discovered_patterns
    ADD CONSTRAINT discovered_patterns_pkey PRIMARY KEY (id);


--
-- Name: dna_analysis dna_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dna_analysis
    ADD CONSTRAINT dna_analysis_pkey PRIMARY KEY (id);


--
-- Name: extended_patterns extended_patterns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_patterns
    ADD CONSTRAINT extended_patterns_pkey PRIMARY KEY (id);


--
-- Name: ghost_conversation_analysis ghost_conversation_analysis_conversation_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ghost_conversation_analysis
    ADD CONSTRAINT ghost_conversation_analysis_conversation_id_key UNIQUE (conversation_id);


--
-- Name: ghost_conversation_analysis ghost_conversation_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ghost_conversation_analysis
    ADD CONSTRAINT ghost_conversation_analysis_pkey PRIMARY KEY (id);


--
-- Name: pattern_research_db pattern_research_db_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pattern_research_db
    ADD CONSTRAINT pattern_research_db_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: temp_content temp_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_content
    ADD CONSTRAINT temp_content_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_collaboration_metrics_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collaboration_metrics_conversation_id ON public.collaboration_metrics USING btree (conversation_id);


--
-- Name: idx_collaboration_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_collaboration_session ON public.collaboration_analysis USING btree (conversation_id);


--
-- Name: idx_conversation_patterns_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_patterns_conversation_id ON public.conversation_patterns USING btree (conversation_id);


--
-- Name: idx_conversation_patterns_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversation_patterns_type ON public.conversation_patterns USING btree (pattern_type);


--
-- Name: idx_dna_analysis_conversation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dna_analysis_conversation_id ON public.dna_analysis USING btree (conversation_id);


--
-- Name: idx_dna_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_dna_session_id ON public.conversation_dna USING btree (conversation_id);


--
-- Name: idx_patterns_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_patterns_session_id ON public.extended_patterns USING btree (session_id);


--
-- Name: idx_patterns_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_patterns_type ON public.extended_patterns USING btree (pattern_type);


--
-- Name: idx_research_pattern_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_research_pattern_type ON public.pattern_research_db USING btree (pattern_type);


--
-- Name: idx_sessions_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_timestamp ON public.analysis_sessions USING btree (session_timestamp);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.analysis_sessions USING btree (user_id);


--
-- Name: idx_temp_content_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_temp_content_expires ON public.temp_content USING btree (expires_at);


--
-- Name: analysis_sessions analysis_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_sessions
    ADD CONSTRAINT analysis_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: collaboration_analysis collaboration_analysis_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_analysis
    ADD CONSTRAINT collaboration_analysis_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: collaboration_metrics collaboration_metrics_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_metrics
    ADD CONSTRAINT collaboration_metrics_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: conversation_dna conversation_dna_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_dna
    ADD CONSTRAINT conversation_dna_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: conversation_patterns conversation_patterns_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversation_patterns
    ADD CONSTRAINT conversation_patterns_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: discovered_patterns discovered_patterns_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discovered_patterns
    ADD CONSTRAINT discovered_patterns_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.analysis_sessions(id);


--
-- Name: dna_analysis dna_analysis_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dna_analysis
    ADD CONSTRAINT dna_analysis_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: extended_patterns extended_patterns_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_patterns
    ADD CONSTRAINT extended_patterns_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.analysis_sessions(id);


--
-- Name: ghost_conversation_analysis ghost_conversation_analysis_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ghost_conversation_analysis
    ADD CONSTRAINT ghost_conversation_analysis_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: temp_content temp_content_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_content
    ADD CONSTRAINT temp_content_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.analysis_sessions(id);


--
-- PostgreSQL database dump complete
--


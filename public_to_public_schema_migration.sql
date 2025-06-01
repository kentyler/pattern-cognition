-- Migration script to copy public schema to another schema
-- Usage: psql -v new_schema=your_schema_name -f this_file.sql

-- Set the target schema name (use -v new_schema=schema_name when running with psql)
\set target_schema :new_schema

-- Create the new schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS :"target_schema";

-- The following is the structure from the public schema, modified to use the target schema

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- Original: CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: authenticate_user(character varying, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION :"target_schema".authenticate_user(p_username_or_email character varying, p_password character varying) RETURNS TABLE(participant_id integer, client_id integer, username character varying, email character varying, role_name character varying, role_id integer, is_active boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS participant_id,
        cp.client_id,
        p.username,
        p.email,
        cpr.name AS role_name,
        cp.client_participant_role_id AS role_id,
        cp.is_active
    FROM 
        participants p
    JOIN 
        client_participants cp ON p.id = cp.participant_id
    JOIN 
        client_participant_roles cpr ON cp.client_participant_role_id = cpr.id
    WHERE 
        (p.username = p_username_or_email OR p.email = p_username_or_email)
        AND p.password_hash = crypt(p_password, p.password_hash)
        AND cp.is_active = TRUE;
END;
$$;


--
-- Name: create_missing_sequences(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION :"target_schema".create_missing_sequences() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    table_rec RECORD;
    column_rec RECORD;
    seq_name TEXT;
    max_val BIGINT;
BEGIN
    -- Loop through all tables in the public schema
    FOR table_rec IN 
        SELECT c.relname AS table_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'  -- only tables
        AND n.nspname = 'public'
    LOOP
        -- For each table, find the primary key column of type BIGINT
        FOR column_rec IN
            SELECT a.attname AS column_name
            FROM pg_attribute a
            JOIN pg_constraint c ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
            WHERE c.contype = 'p'  -- primary key
            AND a.attrelid = (SELECT oid FROM pg_class WHERE relname = table_rec.table_name)
            AND a.atttypid = 20  -- bigint type
        LOOP
            -- Create sequence name based on table and column
            seq_name := table_rec.table_name || '_' || column_rec.column_name || '_seq';
            
            -- Check if sequence already exists
            IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind = 'S' AND relname = seq_name) THEN
                -- Get max value from the table for the sequence start
                EXECUTE 'SELECT COALESCE(MAX(' || column_rec.column_name || '), 0) FROM ' || table_rec.table_name INTO max_val;
                
                -- Create the sequence
                EXECUTE 'CREATE SEQUENCE IF NOT EXISTS :"target_schema".' || seq_name ||
                        ' START WITH ' || (max_val + 1) ||
                        ' INCREMENT BY 1' ||
                        ' NO MINVALUE' ||
                        ' NO MAXVALUE' ||
                        ' CACHE 1';
                
                -- Set the default value for the column
                EXECUTE 'ALTER TABLE :"target_schema".' || table_rec.table_name || 
                        ' ALTER COLUMN ' || column_rec.column_name || 
                        ' SET DEFAULT nextval('':"target_schema".' || seq_name || ''')';
                
                -- Set the ownership of sequence to the column
                EXECUTE 'ALTER SEQUENCE :"target_schema".' || seq_name || 
                        ' OWNED BY :"target_schema".' || table_rec.table_name || '.' || column_rec.column_name;
                
                RAISE NOTICE 'Created sequence % for table %.%', 
                      seq_name, table_rec.table_name, column_rec.column_name;
            ELSE
                RAISE NOTICE 'Sequence % already exists', seq_name;
            END IF;
        END LOOP;
    END LOOP;
END;
$$;


--
-- Name: move_table_to_public(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION :"target_schema".move_table_to_public(table_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    column_def text;
    table_def text;
    seq_name text;
    seq_exists boolean;
    id_default text;
    has_id boolean;
    constraint_def text;
    constraint_rec record;
BEGIN
    RAISE NOTICE 'Moving table % from dev to public', table_name;
    
    -- Check if table exists in dev schema
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'dev' AND table_name = move_table_to_:"target_schema".table_name
    ) THEN
        RAISE EXCEPTION 'Table %.% does not exist', 'dev', move_table_to_:"target_schema".table_name;
    END IF;
    
    -- Drop table from public schema if it exists
    EXECUTE 'DROP TABLE IF EXISTS :"target_schema".' || table_name || ' CASCADE';
    
    -- Create table in public schema with the same structure
    EXECUTE 'CREATE TABLE :"target_schema".' || table_name || ' (LIKE dev.' || table_name || ' INCLUDING ALL)';
    
    -- Check if there's an ID column with a sequence
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'dev' AND table_name = move_table_to_:"target_schema".table_name
        AND column_name = 'id'
    ) INTO has_id;
    
    -- If there's an ID column, get its default value
    IF has_id THEN
        SELECT pg_get_expr(d.adbin, d.adrelid) INTO id_default
        FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        JOIN pg_attribute a ON c.oid = a.attrelid
        JOIN pg_attrdef d ON c.oid = d.adrelid AND a.attnum = d.adnum
        WHERE n.nspname = 'dev'
        AND c.relname = move_table_to_:"target_schema".table_name
        AND a.attname = 'id';
        
        -- If there's a sequence default, create or use a sequence in public schema
        IF id_default LIKE 'nextval%' THEN
            -- Extract sequence name from default value
            seq_name := regexp_replace(id_default, 'nextval\(''dev\.(.*)''.*', '\1');
            
            -- Check if sequence already exists in public schema
            SELECT EXISTS (
                SELECT 1 FROM pg_sequences 
                WHERE schemaname = 'public' AND sequencename = seq_name
            ) INTO seq_exists;
            
            -- Create sequence if it doesn't exist
            IF NOT seq_exists THEN
                EXECUTE 'CREATE SEQUENCE :"target_schema".' || seq_name;
                
                -- Get current sequence value and set the new sequence to that value
                EXECUTE 'SELECT setval('':"target_schema".' || seq_name || ''', (SELECT COALESCE(max(id), 0) FROM dev.' || table_name || '), true)';
            END IF;
            
            -- Set the sequence as default for the id column
            EXECUTE 'ALTER TABLE :"target_schema".' || table_name || ' ALTER COLUMN id SET DEFAULT nextval('':"target_schema".' || seq_name || ''')';
            
            -- Set sequence ownership
            EXECUTE 'ALTER SEQUENCE :"target_schema".' || seq_name || ' OWNED BY :"target_schema".' || table_name || '.id';
        END IF;
    END IF;
    
    -- Copy data from dev to public
    EXECUTE 'INSERT INTO :"target_schema".' || table_name || ' SELECT * FROM dev.' || table_name;
    
    -- Update foreign key constraints to point to public schema tables if needed
    FOR constraint_rec IN
        SELECT 
            conname AS constraint_name,
            pg_get_constraintdef(c.oid) AS constraint_def
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_namespace n ON t.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND t.relname = move_table_to_:"target_schema".table_name
        AND c.contype = 'f'
    LOOP
        -- If constraint references a dev schema table that we've moved to public, update it
        IF constraint_rec.constraint_def LIKE '%REFERENCES dev.event_types%' OR
           constraint_rec.constraint_def LIKE '%REFERENCES dev.file_types%' OR
           constraint_rec.constraint_def LIKE '%REFERENCES dev.avatar_event_types%' OR
           constraint_rec.constraint_def LIKE '%REFERENCES dev.avatar_scopes%' THEN
            
            -- Drop the constraint
            EXECUTE 'ALTER TABLE :"target_schema".' || table_name || ' DROP CONSTRAINT ' || constraint_rec.constraint_name;
            
            -- Create new constraint pointing to public schema
            constraint_def := replace(constraint_rec.constraint_def, 'REFERENCES dev.', 'REFERENCES :"target_schema".');
            EXECUTE 'ALTER TABLE :"target_schema".' || table_name || ' ADD CONSTRAINT ' || constraint_rec.constraint_name || ' ' || constraint_def;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Completed moving table % to public schema', table_name;
END;
$$;


--
-- Name: update_participant_roles_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION :"target_schema".update_participant_roles_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client_schema_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".client_schema_preferences (
    id integer NOT NULL,
    client_schema_id integer NOT NULL,
    preference_type_id integer NOT NULL,
    preference_value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: llm_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".llm_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    api_handler character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: TABLE llm_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE :"target_schema".llm_types IS 'Lookup table for different LLM API types';


--
-- Name: COLUMN llm_types.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".llm_types.name IS 'Unique name for this LLM type';


--
-- Name: COLUMN llm_types.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".llm_types.description IS 'Description of this LLM type and its capabilities';


--
-- Name: COLUMN llm_types.api_handler; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".llm_types.api_handler IS 'The function or method that handles API calls for this type';


--
-- Name: llms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".llms (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    model character varying(255) NOT NULL,
    api_key text NOT NULL,
    temperature double precision DEFAULT 0.7 NOT NULL,
    max_tokens integer DEFAULT 1000 NOT NULL,
    type_id integer,
    additional_config jsonb,
    subdomain character varying(255) DEFAULT 'public'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: preference_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".preference_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: TABLE preference_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE :"target_schema".preference_types IS 'Defines types of preferences that can be set at participant, group, or site level';


--
-- Name: COLUMN preference_types.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".preference_types.name IS 'Unique identifier for the preference type';


--
-- Name: COLUMN preference_types.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".preference_types.description IS 'Human-readable description of what this preference controls';


--
-- Name: avatar_event_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".avatar_event_types (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: avatar_event_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".avatar_event_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avatar_event_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".avatar_event_types_id_seq OWNED BY :"target_schema".avatar_event_types.id;


--
-- Name: avatar_scopes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".avatar_scopes (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: avatar_scopes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".avatar_scopes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avatar_scopes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".avatar_scopes_id_seq OWNED BY :"target_schema".avatar_scopes.id;


--
-- Name: avatars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".avatars (
    id bigint NOT NULL,
    name text NOT NULL,
    instruction_set text,
    created_at timestamp with time zone DEFAULT now(),
    avatar_scope_id integer DEFAULT 1 NOT NULL,
    llm_config jsonb,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: avatars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".avatars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: avatars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".avatars_id_seq OWNED BY :"target_schema".avatars.id;


--
-- Name: client_llms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".client_llms (
    id integer NOT NULL,
    client_id bigint NOT NULL,
    llm_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: client_llms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".client_llms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_llms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".client_llms_id_seq OWNED BY :"target_schema".client_llms.id;


--
-- Name: client_participant_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".client_participant_roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: client_participant_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".client_participant_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_participant_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".client_participant_roles_id_seq OWNED BY :"target_schema".client_participant_roles.id;


--
-- Name: client_participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".client_participants (
    id integer NOT NULL,
    client_id integer NOT NULL,
    participant_id integer NOT NULL,
    client_participant_role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: client_participants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".client_participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".client_participants_id_seq OWNED BY :"target_schema".client_participants.id;


--
-- Name: client_schema_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".client_schema_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_schema_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".client_schema_preferences_id_seq OWNED BY :"target_schema".client_schema_preferences.id;


--
-- Name: client_schemas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".client_schemas (
    id integer NOT NULL,
    client_id integer NOT NULL,
    schema_name character varying(63) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: client_schemas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".client_schemas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: client_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".client_schemas_id_seq OWNED BY :"target_schema".client_schemas.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".clients (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    current_llm_id bigint
);


--
-- Name: COLUMN clients.current_llm_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".clients.current_llm_id IS 'References the current default LLM configuration ID for this client';


--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".clients_id_seq OWNED BY :"target_schema".clients.id;


--
-- Name: event_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".event_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".file_types (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: file_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".file_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".file_types_id_seq OWNED BY :"target_schema".file_types.id;


--
-- Name: file_upload_vectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".file_upload_vectors (
    id integer NOT NULL,
    file_upload_id integer NOT NULL,
    chunk_index integer NOT NULL,
    content_text text NOT NULL,
    content_vector :"target_schema".vector(1536),
    created_at timestamp with time zone DEFAULT now(),
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: file_upload_vectors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".file_upload_vectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_upload_vectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".file_upload_vectors_id_seq OWNED BY :"target_schema".file_upload_vectors.id;


--
-- Name: file_uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".file_uploads (
    id integer NOT NULL,
    filename text NOT NULL,
    mime_type text,
    file_path text NOT NULL,
    file_size bigint,
    public_url text,
    bucket_name text,
    uploaded_at timestamp with time zone DEFAULT now(),
    description text,
    tags text[],
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: file_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".file_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".file_uploads_id_seq OWNED BY :"target_schema".file_uploads.id;


--
-- Name: group_conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".group_conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".group_preferences (
    id integer NOT NULL,
    group_id bigint NOT NULL,
    preference_type_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    value bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: group_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".group_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".group_preferences_id_seq OWNED BY :"target_schema".group_preferences.id;


--
-- Name: group_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".group_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: group_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".group_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".group_types_id_seq OWNED BY :"target_schema".group_types.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".groups_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".groups_id_seq1 OWNED BY :"target_schema".groups.id;


--
-- Name: grp_con_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".grp_con_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: grp_con_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".grp_con_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grp_con_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".grp_con_types_id_seq OWNED BY :"target_schema".grp_con_types.id;


--
-- Name: grp_template_topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".grp_template_topics (
    id integer NOT NULL,
    template_id integer NOT NULL,
    title text NOT NULL,
    content text,
    topic_index numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: TABLE grp_template_topics; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE :"target_schema".grp_template_topics IS 'Defines topics for templates';


--
-- Name: grp_template_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".grp_template_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grp_template_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".grp_template_topics_id_seq OWNED BY :"target_schema".grp_template_topics.id;


--
-- Name: grp_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".grp_templates (
    id integer NOT NULL,
    group_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_participant_id bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: TABLE grp_templates; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE :"target_schema".grp_templates IS 'Defines templates that belong to groups';


--
-- Name: grp_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".grp_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grp_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".grp_templates_id_seq OWNED BY :"target_schema".grp_templates.id;


--
-- Name: llm_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".llm_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: llm_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".llm_types_id_seq OWNED BY :"target_schema".llm_types.id;


--
-- Name: llms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".llms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: llms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".llms_id_seq OWNED BY :"target_schema".llms.id;


--
-- Name: message_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".message_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: message_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".message_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".message_types_id_seq OWNED BY :"target_schema".message_types.id;


--
-- Name: participant_avatars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_avatars (
    id bigint NOT NULL,
    participant_id bigint NOT NULL,
    avatar_id bigint NOT NULL,
    created_at date DEFAULT CURRENT_DATE,
    created_by_participant_id bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_avatars_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_avatars_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_avatars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_avatars_id_seq OWNED BY :"target_schema".participant_avatars.id;


--
-- Name: participant_event_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_event_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_event_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_event_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_event_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_event_categories_id_seq OWNED BY :"target_schema".participant_event_categories.id;


--
-- Name: participant_event_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_event_logs (
    id integer NOT NULL,
    schema_id integer,
    participant_id integer,
    event_type_id integer,
    description text,
    details jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_event_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_event_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_event_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_event_logs_id_seq OWNED BY :"target_schema".participant_event_logs.id;


--
-- Name: participant_event_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_event_types (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    participant_event_categories_id bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_event_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_event_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_event_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_event_types_id_seq OWNED BY :"target_schema".participant_event_types.id;


--
-- Name: participant_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_events (
    id integer NOT NULL,
    participant_id bigint NOT NULL,
    event_type_id integer NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: COLUMN participant_events.participant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".participant_events.participant_id IS 'The ID of the participant (can be null for events not associated with a specific participant, e.g., login attempts with non-existent emails)';


--
-- Name: participant_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_events_id_seq OWNED BY :"target_schema".participant_events.id;


--
-- Name: participant_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_groups (
    participant_id bigint NOT NULL,
    group_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    participant_role_id integer NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: COLUMN participant_groups.participant_role_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".participant_groups.participant_role_id IS 'Foreign key to :"target_schema".participant_roles defining the participant''s role in the group';


--
-- Name: participant_llms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_llms (
    id bigint NOT NULL,
    participant_id bigint NOT NULL,
    llm_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_llms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_llms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_llms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_llms_id_seq OWNED BY :"target_schema".participant_llms.id;


--
-- Name: participant_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_preferences (
    id integer NOT NULL,
    participant_id bigint NOT NULL,
    preference_type_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    value bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_preferences_id_seq OWNED BY :"target_schema".participant_preferences.id;


--
-- Name: participant_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_roles (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: TABLE participant_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE :"target_schema".participant_roles IS 'Lookup table for participant roles across all schemas';


--
-- Name: COLUMN participant_roles.role_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".participant_roles.role_id IS 'Unique identifier for the role';


--
-- Name: COLUMN participant_roles.role_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".participant_roles.role_name IS 'Name of the role (must be unique)';


--
-- Name: COLUMN participant_roles.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN :"target_schema".participant_roles.description IS 'Description of the role and its privileges';


--
-- Name: participant_roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_roles_role_id_seq OWNED BY :"target_schema".participant_roles.role_id;


--
-- Name: participant_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: participant_topic_turns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_topic_turns (
    id bigint NOT NULL,
    participant_id bigint NOT NULL,
    topic_id bigint NOT NULL,
    turn_index integer NOT NULL,
    content_text text,
    content_vector :"target_schema".vector(1536),
    turn_kind_id integer,
    message_type_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: participant_topic_turns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_topic_turns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_topic_turns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_topic_turns_id_seq OWNED BY :"target_schema".participant_topic_turns.id;


--
-- Name: participant_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participant_types (
    id integer NOT NULL,
    client_id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: participant_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".participant_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: participant_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".participant_types_id_seq OWNED BY :"target_schema".participant_types.id;


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".participants (
    id bigint NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    client_id integer DEFAULT 1 NOT NULL,
    llm_config jsonb,
    custom_instructions text
);


--
-- Name: preference_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".preference_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: preference_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".preference_types_id_seq OWNED BY :"target_schema".preference_types.id;


--
-- Name: turn_relationship_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".turn_relationship_types (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: relationship_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".relationship_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: relationship_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".relationship_types_id_seq OWNED BY :"target_schema".turn_relationship_types.id;


--
-- Name: schemas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".schemas (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(255) NOT NULL,
    owner_participant_id integer,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    metadata jsonb,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: schemas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".schemas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".schemas_id_seq OWNED BY :"target_schema".schemas.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: site_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".site_preferences (
    id integer NOT NULL,
    preference_type_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    value bigint,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: site_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".site_preferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".site_preferences_id_seq OWNED BY :"target_schema".site_preferences.id;


--
-- Name: topic_paths_numeric_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".topic_paths_numeric_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topic_paths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".topic_paths (
    path :"target_schema".ltree NOT NULL,
    created_by integer,
    created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    index text NOT NULL,
    id bigint DEFAULT nextval(':"target_schema".topic_paths_numeric_id_seq'::regclass) NOT NULL,
    client_id integer DEFAULT 1 NOT NULL,
    CONSTRAINT valid_path CHECK ((path IS NOT NULL))
);


--
-- Name: turn_kinds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE :"target_schema".turn_kinds (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    client_id integer DEFAULT 1 NOT NULL
);


--
-- Name: turn_kinds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".turn_kinds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: turn_kinds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".turn_kinds_id_seq OWNED BY :"target_schema".turn_kinds.id;


--
-- Name: turn_relationship_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE :"target_schema".turn_relationship_types_id_seq
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: turn_relationship_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE :"target_schema".turn_relationship_types_id_seq OWNED BY :"target_schema".turn_relationship_types.id;


--
-- Name: avatar_event_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_event_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".avatar_event_types_id_seq'::regclass);


--
-- Name: avatar_scopes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_scopes ALTER COLUMN id SET DEFAULT nextval(':"target_schema".avatar_scopes_id_seq'::regclass);


--
-- Name: avatars id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatars ALTER COLUMN id SET DEFAULT nextval(':"target_schema".avatars_id_seq'::regclass);


--
-- Name: client_llms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_llms ALTER COLUMN id SET DEFAULT nextval(':"target_schema".client_llms_id_seq'::regclass);


--
-- Name: client_participant_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participant_roles ALTER COLUMN id SET DEFAULT nextval(':"target_schema".client_participant_roles_id_seq'::regclass);


--
-- Name: client_participants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants ALTER COLUMN id SET DEFAULT nextval(':"target_schema".client_participants_id_seq'::regclass);


--
-- Name: client_schema_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences ALTER COLUMN id SET DEFAULT nextval(':"target_schema".client_schema_preferences_id_seq'::regclass);


--
-- Name: client_schemas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schemas ALTER COLUMN id SET DEFAULT nextval(':"target_schema".client_schemas_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".clients ALTER COLUMN id SET DEFAULT nextval(':"target_schema".clients_id_seq'::regclass);


--
-- Name: file_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".file_types_id_seq'::regclass);


--
-- Name: file_upload_vectors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_upload_vectors ALTER COLUMN id SET DEFAULT nextval(':"target_schema".file_upload_vectors_id_seq'::regclass);


--
-- Name: file_uploads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_uploads ALTER COLUMN id SET DEFAULT nextval(':"target_schema".file_uploads_id_seq'::regclass);


--
-- Name: group_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_preferences ALTER COLUMN id SET DEFAULT nextval(':"target_schema".group_preferences_id_seq'::regclass);


--
-- Name: group_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".group_types_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".groups ALTER COLUMN id SET DEFAULT nextval(':"target_schema".groups_id_seq1'::regclass);


--
-- Name: grp_con_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_con_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".grp_con_types_id_seq'::regclass);


--
-- Name: grp_template_topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_template_topics ALTER COLUMN id SET DEFAULT nextval(':"target_schema".grp_template_topics_id_seq'::regclass);


--
-- Name: grp_templates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_templates ALTER COLUMN id SET DEFAULT nextval(':"target_schema".grp_templates_id_seq'::regclass);


--
-- Name: llm_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llm_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".llm_types_id_seq'::regclass);


--
-- Name: llms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llms ALTER COLUMN id SET DEFAULT nextval(':"target_schema".llms_id_seq'::regclass);


--
-- Name: message_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".message_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".message_types_id_seq'::regclass);


--
-- Name: participant_avatars id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_avatars ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_avatars_id_seq'::regclass);


--
-- Name: participant_event_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_categories ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_event_categories_id_seq'::regclass);


--
-- Name: participant_event_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_event_logs_id_seq'::regclass);


--
-- Name: participant_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_events ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_events_id_seq'::regclass);


--
-- Name: participant_llms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_llms ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_llms_id_seq'::regclass);


--
-- Name: participant_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_preferences ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_preferences_id_seq'::regclass);


--
-- Name: participant_roles role_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_roles ALTER COLUMN role_id SET DEFAULT nextval(':"target_schema".participant_roles_role_id_seq'::regclass);


--
-- Name: participant_topic_turns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_topic_turns ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_topic_turns_id_seq'::regclass);


--
-- Name: participant_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".participant_types_id_seq'::regclass);


--
-- Name: preference_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".preference_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".preference_types_id_seq'::regclass);


--
-- Name: schemas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".schemas ALTER COLUMN id SET DEFAULT nextval(':"target_schema".schemas_id_seq'::regclass);


--
-- Name: site_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".site_preferences ALTER COLUMN id SET DEFAULT nextval(':"target_schema".site_preferences_id_seq'::regclass);


--
-- Name: turn_kinds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_kinds ALTER COLUMN id SET DEFAULT nextval(':"target_schema".turn_kinds_id_seq'::regclass);


--
-- Name: turn_relationship_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_relationship_types ALTER COLUMN id SET DEFAULT nextval(':"target_schema".turn_relationship_types_id_seq'::regclass);


--
-- Name: avatar_event_types avatar_event_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_event_types
    ADD CONSTRAINT avatar_event_types_name_key UNIQUE (name);


--
-- Name: avatar_event_types avatar_event_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_event_types
    ADD CONSTRAINT avatar_event_types_pkey PRIMARY KEY (id);


--
-- Name: avatar_scopes avatar_scopes_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_scopes
    ADD CONSTRAINT avatar_scopes_name_key UNIQUE (name);


--
-- Name: avatar_scopes avatar_scopes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_scopes
    ADD CONSTRAINT avatar_scopes_pkey PRIMARY KEY (id);


--
-- Name: avatars avatars_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatars
    ADD CONSTRAINT avatars_name_key UNIQUE (name);


--
-- Name: avatars avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatars
    ADD CONSTRAINT avatars_pkey PRIMARY KEY (id);


--
-- Name: client_llms client_llms_client_id_llm_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_llms
    ADD CONSTRAINT client_llms_client_id_llm_id_key UNIQUE (client_id, llm_id);


--
-- Name: client_llms client_llms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_llms
    ADD CONSTRAINT client_llms_pkey PRIMARY KEY (id);


--
-- Name: client_participant_roles client_participant_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participant_roles
    ADD CONSTRAINT client_participant_roles_pkey PRIMARY KEY (id);


--
-- Name: client_participants client_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants
    ADD CONSTRAINT client_participants_pkey PRIMARY KEY (id);


--
-- Name: client_schema_preferences client_schema_preferences_client_schema_id_preference_type__key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences
    ADD CONSTRAINT client_schema_preferences_client_schema_id_preference_type__key UNIQUE (client_schema_id, preference_type_id);


--
-- Name: client_schema_preferences client_schema_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences
    ADD CONSTRAINT client_schema_preferences_pkey PRIMARY KEY (id);


--
-- Name: client_schemas client_schemas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schemas
    ADD CONSTRAINT client_schemas_pkey PRIMARY KEY (id);


--
-- Name: client_schemas client_schemas_schema_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schemas
    ADD CONSTRAINT client_schemas_schema_name_key UNIQUE (schema_name);


--
-- Name: clients clients_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".clients
    ADD CONSTRAINT clients_name_key UNIQUE (name);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: file_types file_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_types
    ADD CONSTRAINT file_types_name_key UNIQUE (name);


--
-- Name: file_types file_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_types
    ADD CONSTRAINT file_types_pkey PRIMARY KEY (id);


--
-- Name: file_upload_vectors file_upload_vectors_file_upload_id_chunk_index_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_upload_vectors
    ADD CONSTRAINT file_upload_vectors_file_upload_id_chunk_index_key UNIQUE (file_upload_id, chunk_index);


--
-- Name: file_upload_vectors file_upload_vectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_upload_vectors
    ADD CONSTRAINT file_upload_vectors_pkey PRIMARY KEY (id);


--
-- Name: file_uploads file_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- Name: group_preferences group_preferences_group_id_preference_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_preferences
    ADD CONSTRAINT group_preferences_group_id_preference_type_id_key UNIQUE (group_id, preference_type_id);


--
-- Name: group_preferences group_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_preferences
    ADD CONSTRAINT group_preferences_pkey PRIMARY KEY (id);


--
-- Name: group_types group_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_types
    ADD CONSTRAINT group_types_name_key UNIQUE (name);


--
-- Name: group_types group_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_types
    ADD CONSTRAINT group_types_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: grp_con_types grp_con_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_con_types
    ADD CONSTRAINT grp_con_types_name_key UNIQUE (name);


--
-- Name: grp_con_types grp_con_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_con_types
    ADD CONSTRAINT grp_con_types_pkey PRIMARY KEY (id);


--
-- Name: grp_template_topics grp_template_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_template_topics
    ADD CONSTRAINT grp_template_topics_pkey PRIMARY KEY (id);


--
-- Name: grp_templates grp_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_templates
    ADD CONSTRAINT grp_templates_pkey PRIMARY KEY (id);


--
-- Name: llm_types llm_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llm_types
    ADD CONSTRAINT llm_types_name_key UNIQUE (name);


--
-- Name: llm_types llm_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llm_types
    ADD CONSTRAINT llm_types_pkey PRIMARY KEY (id);


--
-- Name: llms llms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llms
    ADD CONSTRAINT llms_pkey PRIMARY KEY (id);


--
-- Name: message_types message_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".message_types
    ADD CONSTRAINT message_types_name_key UNIQUE (name);


--
-- Name: message_types message_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".message_types
    ADD CONSTRAINT message_types_pkey PRIMARY KEY (id);


--
-- Name: participant_avatars participant_avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_avatars
    ADD CONSTRAINT participant_avatars_pkey PRIMARY KEY (id);


--
-- Name: participant_event_categories participant_event_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_categories
    ADD CONSTRAINT participant_event_categories_name_key UNIQUE (name);


--
-- Name: participant_event_categories participant_event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_categories
    ADD CONSTRAINT participant_event_categories_pkey PRIMARY KEY (id);


--
-- Name: participant_event_logs participant_event_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs
    ADD CONSTRAINT participant_event_logs_pkey PRIMARY KEY (id);


--
-- Name: participant_event_types participant_event_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_types
    ADD CONSTRAINT participant_event_types_pkey PRIMARY KEY (id);


--
-- Name: participant_events participant_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_events
    ADD CONSTRAINT participant_events_pkey PRIMARY KEY (id);


--
-- Name: participant_groups participant_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_groups
    ADD CONSTRAINT participant_groups_pkey PRIMARY KEY (participant_id, group_id);


--
-- Name: participant_llms participant_llms_participant_id_llm_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_llms
    ADD CONSTRAINT participant_llms_participant_id_llm_id_key UNIQUE (participant_id, llm_id);


--
-- Name: participant_llms participant_llms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_llms
    ADD CONSTRAINT participant_llms_pkey PRIMARY KEY (id);


--
-- Name: participant_preferences participant_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_preferences
    ADD CONSTRAINT participant_preferences_pkey PRIMARY KEY (id);


--
-- Name: participant_roles participant_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_roles
    ADD CONSTRAINT participant_roles_pkey PRIMARY KEY (role_id);


--
-- Name: participant_roles participant_roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_roles
    ADD CONSTRAINT participant_roles_role_name_key UNIQUE (role_name);


--
-- Name: participant_sessions participant_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_sessions
    ADD CONSTRAINT participant_sessions_pkey PRIMARY KEY (sid);


--
-- Name: participant_topic_turns participant_topic_turns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_topic_turns
    ADD CONSTRAINT participant_topic_turns_pkey PRIMARY KEY (id);


--
-- Name: participant_types participant_types_client_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_types
    ADD CONSTRAINT participant_types_client_id_name_key UNIQUE (client_id, name);


--
-- Name: participant_types participant_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_types
    ADD CONSTRAINT participant_types_pkey PRIMARY KEY (id);


--
-- Name: participants participants_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participants
    ADD CONSTRAINT participants_email_key UNIQUE (email);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: preference_types preference_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".preference_types
    ADD CONSTRAINT preference_types_name_key UNIQUE (name);


--
-- Name: preference_types preference_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".preference_types
    ADD CONSTRAINT preference_types_pkey PRIMARY KEY (id);


--
-- Name: turn_relationship_types relationship_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_relationship_types
    ADD CONSTRAINT relationship_types_name_key UNIQUE (name);


--
-- Name: turn_relationship_types relationship_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_relationship_types
    ADD CONSTRAINT relationship_types_pkey PRIMARY KEY (id);


--
-- Name: schemas schemas_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".schemas
    ADD CONSTRAINT schemas_name_key UNIQUE (name);


--
-- Name: schemas schemas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".schemas
    ADD CONSTRAINT schemas_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: site_preferences site_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".site_preferences
    ADD CONSTRAINT site_preferences_pkey PRIMARY KEY (id);


--
-- Name: site_preferences site_preferences_preference_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".site_preferences
    ADD CONSTRAINT site_preferences_preference_type_id_key UNIQUE (preference_type_id);


--
-- Name: topic_paths topic_paths_index_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".topic_paths
    ADD CONSTRAINT topic_paths_index_key UNIQUE (index);


--
-- Name: topic_paths topic_paths_path_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".topic_paths
    ADD CONSTRAINT topic_paths_path_key UNIQUE (path);


--
-- Name: topic_paths topic_paths_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".topic_paths
    ADD CONSTRAINT topic_paths_pkey PRIMARY KEY (id);


--
-- Name: turn_kinds turn_kinds_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_kinds
    ADD CONSTRAINT turn_kinds_name_key UNIQUE (name);


--
-- Name: turn_kinds turn_kinds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_kinds
    ADD CONSTRAINT turn_kinds_pkey PRIMARY KEY (id);


--
-- Name: client_participants uq_client_participant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants
    ADD CONSTRAINT uq_client_participant UNIQUE (client_id, participant_id);


--
-- Name: client_participant_roles uq_client_participant_role_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participant_roles
    ADD CONSTRAINT uq_client_participant_role_name UNIQUE (name);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON :"target_schema".session USING btree (expire);


--
-- Name: idx_avatar_event_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_avatar_event_types_client_id ON :"target_schema".avatar_event_types USING btree (client_id);


--
-- Name: idx_avatar_scopes_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_avatar_scopes_client_id ON :"target_schema".avatar_scopes USING btree (client_id);


--
-- Name: idx_avatars_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_avatars_client_id ON :"target_schema".avatars USING btree (client_id);


--
-- Name: idx_client_llms_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_llms_client_id ON :"target_schema".client_llms USING btree (client_id);


--
-- Name: idx_client_llms_llm_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_llms_llm_id ON :"target_schema".client_llms USING btree (llm_id);


--
-- Name: idx_client_participant_roles_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_participant_roles_client_id ON :"target_schema".client_participant_roles USING btree (client_id);


--
-- Name: idx_client_participants_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_participants_client_id ON :"target_schema".client_participants USING btree (client_id);


--
-- Name: idx_client_participants_participant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_participants_participant_id ON :"target_schema".client_participants USING btree (participant_id);


--
-- Name: idx_client_schema_preferences_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_schema_preferences_client_id ON :"target_schema".client_schema_preferences USING btree (client_id);


--
-- Name: idx_client_schemas_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_schemas_client_id ON :"target_schema".client_schemas USING btree (client_id);


--
-- Name: idx_file_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_types_client_id ON :"target_schema".file_types USING btree (client_id);


--
-- Name: idx_file_uploads_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_uploads_client_id ON :"target_schema".file_uploads USING btree (client_id);


--
-- Name: idx_group_preferences_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_preferences_client_id ON :"target_schema".group_preferences USING btree (client_id);


--
-- Name: idx_group_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_types_client_id ON :"target_schema".group_types USING btree (client_id);


--
-- Name: idx_groups_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_client_id ON :"target_schema".groups USING btree (client_id);


--
-- Name: idx_grp_con_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_con_types_client_id ON :"target_schema".grp_con_types USING btree (client_id);


--
-- Name: idx_grp_template_topics_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_template_topics_client_id ON :"target_schema".grp_template_topics USING btree (client_id);


--
-- Name: idx_grp_template_topics_template_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_template_topics_template_id ON :"target_schema".grp_template_topics USING btree (template_id);


--
-- Name: idx_grp_template_topics_topic_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_template_topics_topic_index ON :"target_schema".grp_template_topics USING btree (topic_index);


--
-- Name: idx_grp_templates_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_templates_client_id ON :"target_schema".grp_templates USING btree (client_id);


--
-- Name: idx_grp_templates_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_templates_group_id ON :"target_schema".grp_templates USING btree (group_id);


--
-- Name: idx_grp_templates_participant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grp_templates_participant_id ON :"target_schema".grp_templates USING btree (created_by_participant_id);


--
-- Name: idx_llm_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_llm_types_client_id ON :"target_schema".llm_types USING btree (client_id);


--
-- Name: idx_llms_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_llms_client_id ON :"target_schema".llms USING btree (client_id);


--
-- Name: idx_message_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_types_client_id ON :"target_schema".message_types USING btree (client_id);


--
-- Name: idx_participant_avatars_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_avatars_client_id ON :"target_schema".participant_avatars USING btree (client_id);


--
-- Name: idx_participant_event_categories_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_event_categories_client_id ON :"target_schema".participant_event_categories USING btree (client_id);


--
-- Name: idx_participant_event_logs_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_event_logs_client_id ON :"target_schema".participant_event_logs USING btree (client_id);


--
-- Name: idx_participant_event_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_event_types_client_id ON :"target_schema".participant_event_types USING btree (client_id);


--
-- Name: idx_participant_events_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_events_client_id ON :"target_schema".participant_events USING btree (client_id);


--
-- Name: idx_participant_groups_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_groups_client_id ON :"target_schema".participant_groups USING btree (client_id);


--
-- Name: idx_participant_llms_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_llms_client_id ON :"target_schema".participant_llms USING btree (client_id);


--
-- Name: idx_participant_preferences_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_preferences_client_id ON :"target_schema".participant_preferences USING btree (client_id);


--
-- Name: idx_participant_roles_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_roles_client_id ON :"target_schema".participant_roles USING btree (client_id);


--
-- Name: idx_participant_sessions_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_sessions_client_id ON :"target_schema".participant_sessions USING btree (client_id);


--
-- Name: idx_participant_sessions_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participant_sessions_expire ON :"target_schema".participant_sessions USING btree (expire);


--
-- Name: idx_participants_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_participants_client_id ON :"target_schema".participants USING btree (client_id);


--
-- Name: idx_preference_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_preference_types_client_id ON :"target_schema".preference_types USING btree (client_id);


--
-- Name: idx_schemas_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schemas_client_id ON :"target_schema".schemas USING btree (client_id);


--
-- Name: idx_schemas_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schemas_name ON :"target_schema".schemas USING btree (name);


--
-- Name: idx_schemas_owner; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schemas_owner ON :"target_schema".schemas USING btree (owner_participant_id);


--
-- Name: idx_session_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_client_id ON :"target_schema".session USING btree (client_id);


--
-- Name: idx_site_preferences_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_site_preferences_client_id ON :"target_schema".site_preferences USING btree (client_id);


--
-- Name: idx_topic_paths_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_topic_paths_client_id ON :"target_schema".topic_paths USING btree (client_id);


--
-- Name: idx_topic_paths_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_topic_paths_path ON :"target_schema".topic_paths USING btree (path);


--
-- Name: idx_turn_kinds_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_turn_kinds_client_id ON :"target_schema".turn_kinds USING btree (client_id);


--
-- Name: idx_turn_relationship_types_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_turn_relationship_types_client_id ON :"target_schema".turn_relationship_types USING btree (client_id);


--
-- Name: topic_paths_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX topic_paths_path_idx ON :"target_schema".topic_paths USING gist (path);


--
-- Name: participant_roles update_participant_roles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_participant_roles_updated_at BEFORE UPDATE ON :"target_schema".participant_roles FOR EACH ROW EXECUTE FUNCTION :"target_schema".update_participant_roles_updated_at();


--
-- Name: client_llms client_llms_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_llms
    ADD CONSTRAINT client_llms_client_id_fkey FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: client_llms client_llms_llm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_llms
    ADD CONSTRAINT client_llms_llm_id_fkey FOREIGN KEY (llm_id) REFERENCES :"target_schema".llms(id) ON DELETE CASCADE;


--
-- Name: client_schema_preferences client_schema_preferences_client_schema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences
    ADD CONSTRAINT client_schema_preferences_client_schema_id_fkey FOREIGN KEY (client_schema_id) REFERENCES :"target_schema".client_schemas(id) ON DELETE CASCADE;


--
-- Name: client_schema_preferences client_schema_preferences_preference_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences
    ADD CONSTRAINT client_schema_preferences_preference_type_id_fkey FOREIGN KEY (preference_type_id) REFERENCES :"target_schema".preference_types(id) ON DELETE CASCADE;


--
-- Name: client_schemas client_schemas_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schemas
    ADD CONSTRAINT client_schemas_client_id_fkey FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: file_upload_vectors file_upload_vectors_file_upload_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_upload_vectors
    ADD CONSTRAINT file_upload_vectors_file_upload_id_fkey FOREIGN KEY (file_upload_id) REFERENCES :"target_schema".file_uploads(id) ON DELETE CASCADE;


--
-- Name: avatar_event_types fk_avatar_event_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_event_types
    ADD CONSTRAINT fk_avatar_event_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: avatar_scopes fk_avatar_scopes_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatar_scopes
    ADD CONSTRAINT fk_avatar_scopes_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: avatars fk_avatars_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".avatars
    ADD CONSTRAINT fk_avatars_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: client_participants fk_client_participant_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants
    ADD CONSTRAINT fk_client_participant_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: client_participants fk_client_participant_participant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants
    ADD CONSTRAINT fk_client_participant_participant FOREIGN KEY (participant_id) REFERENCES :"target_schema".participants(id) ON DELETE CASCADE;


--
-- Name: client_participants fk_client_participant_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participants
    ADD CONSTRAINT fk_client_participant_role FOREIGN KEY (client_participant_role_id) REFERENCES :"target_schema".client_participant_roles(id) ON DELETE RESTRICT;


--
-- Name: client_participant_roles fk_client_participant_roles_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_participant_roles
    ADD CONSTRAINT fk_client_participant_roles_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: client_schema_preferences fk_client_schema_preferences_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schema_preferences
    ADD CONSTRAINT fk_client_schema_preferences_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: client_schemas fk_client_schemas_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".client_schemas
    ADD CONSTRAINT fk_client_schemas_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: file_types fk_file_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_types
    ADD CONSTRAINT fk_file_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: file_uploads fk_file_uploads_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".file_uploads
    ADD CONSTRAINT fk_file_uploads_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_templates fk_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_templates
    ADD CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES dev.groups(id) ON DELETE CASCADE;


--
-- Name: group_preferences fk_group_preferences_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_preferences
    ADD CONSTRAINT fk_group_preferences_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: group_types fk_group_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".group_types
    ADD CONSTRAINT fk_group_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: groups fk_groups_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".groups
    ADD CONSTRAINT fk_groups_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_con_types fk_grp_con_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_con_types
    ADD CONSTRAINT fk_grp_con_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_template_topics fk_grp_template_topics_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_template_topics
    ADD CONSTRAINT fk_grp_template_topics_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_templates fk_grp_templates_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_templates
    ADD CONSTRAINT fk_grp_templates_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: llm_types fk_llm_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llm_types
    ADD CONSTRAINT fk_llm_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: llms fk_llms_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llms
    ADD CONSTRAINT fk_llms_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: message_types fk_message_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".message_types
    ADD CONSTRAINT fk_message_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_templates fk_participant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_templates
    ADD CONSTRAINT fk_participant FOREIGN KEY (created_by_participant_id) REFERENCES :"target_schema".participants(id) ON DELETE SET NULL;


--
-- Name: participant_avatars fk_participant_avatars_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_avatars
    ADD CONSTRAINT fk_participant_avatars_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_event_categories fk_participant_event_categories_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_categories
    ADD CONSTRAINT fk_participant_event_categories_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_event_logs fk_participant_event_logs_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs
    ADD CONSTRAINT fk_participant_event_logs_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_event_types fk_participant_event_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_types
    ADD CONSTRAINT fk_participant_event_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_events fk_participant_events_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_events
    ADD CONSTRAINT fk_participant_events_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_groups fk_participant_groups_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_groups
    ADD CONSTRAINT fk_participant_groups_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_llms fk_participant_llms_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_llms
    ADD CONSTRAINT fk_participant_llms_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_preferences fk_participant_preferences_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_preferences
    ADD CONSTRAINT fk_participant_preferences_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_groups fk_participant_role; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_groups
    ADD CONSTRAINT fk_participant_role FOREIGN KEY (participant_role_id) REFERENCES :"target_schema".participant_roles(role_id);


--
-- Name: participant_roles fk_participant_roles_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_roles
    ADD CONSTRAINT fk_participant_roles_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participant_sessions fk_participant_sessions_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_sessions
    ADD CONSTRAINT fk_participant_sessions_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: participants fk_participants_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participants
    ADD CONSTRAINT fk_participants_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: preference_types fk_preference_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".preference_types
    ADD CONSTRAINT fk_preference_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: schemas fk_schemas_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".schemas
    ADD CONSTRAINT fk_schemas_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: session fk_session_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".session
    ADD CONSTRAINT fk_session_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: site_preferences fk_site_preferences_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".site_preferences
    ADD CONSTRAINT fk_site_preferences_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: grp_template_topics fk_template; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".grp_template_topics
    ADD CONSTRAINT fk_template FOREIGN KEY (template_id) REFERENCES :"target_schema".grp_templates(id) ON DELETE CASCADE;


--
-- Name: topic_paths fk_topic_paths_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".topic_paths
    ADD CONSTRAINT fk_topic_paths_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: turn_kinds fk_turn_kinds_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_kinds
    ADD CONSTRAINT fk_turn_kinds_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: turn_relationship_types fk_turn_relationship_types_client; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".turn_relationship_types
    ADD CONSTRAINT fk_turn_relationship_types_client FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: llms llms_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".llms
    ADD CONSTRAINT llms_type_id_fkey FOREIGN KEY (type_id) REFERENCES :"target_schema".llm_types(id);


--
-- Name: participant_event_logs participant_event_logs_event_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs
    ADD CONSTRAINT participant_event_logs_event_type_id_fkey FOREIGN KEY (event_type_id) REFERENCES :"target_schema".participant_event_types(id);


--
-- Name: participant_event_logs participant_event_logs_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs
    ADD CONSTRAINT participant_event_logs_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES :"target_schema".participants(id);


--
-- Name: participant_event_logs participant_event_logs_schema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_event_logs
    ADD CONSTRAINT participant_event_logs_schema_id_fkey FOREIGN KEY (schema_id) REFERENCES :"target_schema".schemas(id);


--
-- Name: participant_topic_turns participant_topic_turns_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_topic_turns
    ADD CONSTRAINT participant_topic_turns_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES :"target_schema".participants(id) ON DELETE CASCADE;


--
-- Name: participant_topic_turns participant_topic_turns_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_topic_turns
    ADD CONSTRAINT participant_topic_turns_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES :"target_schema".topic_paths(id) ON DELETE CASCADE;


--
-- Name: participant_types participant_types_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".participant_types
    ADD CONSTRAINT participant_types_client_id_fkey FOREIGN KEY (client_id) REFERENCES :"target_schema".clients(id) ON DELETE CASCADE;


--
-- Name: schemas schemas_owner_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".schemas
    ADD CONSTRAINT schemas_owner_participant_id_fkey FOREIGN KEY (owner_participant_id) REFERENCES :"target_schema".participants(id);


--
-- Name: topic_paths topic_paths_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY :"target_schema".topic_paths
    ADD CONSTRAINT topic_paths_created_by_fkey FOREIGN KEY (created_by) REFERENCES :"target_schema".participants(id);


--
-- PostgreSQL database dump complete
--



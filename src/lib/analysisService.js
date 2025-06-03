// src/lib/analysisService.js
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { query } from './database.js';
import { COMPREHENSIVE_ANALYSIS_PROMPT } from './analysisPrompt.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create Supabase client lazily (only when needed)
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required');
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function performConversationAnalysis(text, options = {}) {
  const sessionId = crypto.randomUUID();
  
  if (!text || typeof text !== 'string') {
    throw new Error('Text content is required');
  }

  if (text.length > 100000) {
    throw new Error('Text too large. Please use a smaller conversation or extract key portions.');
  }

  console.log('🔄 Starting analysis for session:', sessionId);

  const startTime = Date.now();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = options.filename || 'conversation.txt';
  
  const inputFilename = `${sessionId}_input_${filename}`;
  const outputFilename = `${sessionId}_analysis_${timestamp}.md`;
  const inputStoragePath = `inputs/${inputFilename}`;
  const outputStoragePath = `outputs/${outputFilename}`;

  console.log('📁 File paths created:', { inputStoragePath, outputStoragePath });

  // Create database record
  const insertQuery = `
    INSERT INTO conversation_analyses (
      session_id, input_filename, input_storage_path, original_filename, 
      input_size, output_filename, output_storage_path, analysis_status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  console.log('💾 Creating database record...');
  const { rows } = await query(insertQuery, [
    sessionId,
    inputFilename,
    inputStoragePath,
    filename,
    text.length,
    outputFilename,
    outputStoragePath,
    'processing'
  ]);
  console.log('✅ Database record created');

  try {
    console.log('🔌 Getting Supabase client...');
    const supabase = getSupabaseClient();  // <-- Lazy creation here
    console.log('✅ Supabase client created');

    // ... rest of the function stays the same
    console.log('📤 Uploading input file to Supabase...');
    const inputUploadResult = await supabase.storage
      .from('conversations')
      .upload(inputStoragePath, text, {
        contentType: 'text/plain',
        metadata: {
          sessionId,
          originalFilename: filename,
          uploadedAt: new Date().toISOString(),
          source: options.source || 'web'
        }
      });

    console.log('📤 Input upload result:', inputUploadResult);

    if (inputUploadResult.error) {
      throw new Error(`Input storage error: ${inputUploadResult.error.message}`);
    }
    console.log('✅ Input file uploaded successfully');

    console.log('🤖 Calling Claude API...');
    const response = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 8000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `${COMPREHENSIVE_ANALYSIS_PROMPT}\n\n${text}`
        }
      ]
    });

    const processingTime = Date.now() - startTime;
    const analysisReport = response.content[0].text;
    console.log('✅ Claude analysis completed, length:', analysisReport.length);

    console.log('📤 Uploading output file to Supabase...');
    const outputUploadResult = await supabase.storage
      .from('conversations')
      .upload(outputStoragePath, analysisReport, {
        contentType: 'text/markdown',
        metadata: {
          sessionId,
          linkedInputPath: inputStoragePath,
          processingTime: processingTime.toString(),
          generatedAt: new Date().toISOString(),
          source: options.source || 'web'
        }
      });

    console.log('📤 Output upload result:', outputUploadResult);

    if (outputUploadResult.error) {
      throw new Error(`Output storage error: ${outputUploadResult.error.message}`);
    }
    console.log('✅ Output file uploaded successfully');

    console.log('💾 Updating database record...');
    const updateQuery = `
      UPDATE conversation_analyses 
      SET output_size = $1, processing_time_ms = $2, analysis_status = $3, completed_at = NOW()
      WHERE session_id = $4
    `;
    
    await query(updateQuery, [
      analysisReport.length,
      processingTime,
      'completed',
      sessionId
    ]);
    console.log('✅ Database record updated');

    return {
      sessionId,
      analysisReport,
      processingTime,
      inputStoragePath,
      outputStoragePath
    };

  } catch (error) {
    console.error('❌ Error in analysis:', error);
    
    const errorQuery = `
      UPDATE conversation_analyses 
      SET analysis_status = $1, error_message = $2, completed_at = NOW()
      WHERE session_id = $3
    `;
    await query(errorQuery, ['failed', error.message, sessionId]);
    
    throw error;
  }
}
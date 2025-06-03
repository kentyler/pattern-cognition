// File: app/api/analysis/route.js

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { query } from '../../../lib/database.js';
import { COMPREHENSIVE_ANALYSIS_PROMPT } from '../../../lib/analysisPrompt.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Supabase client for storage only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export async function POST(request) {
  const sessionId = crypto.randomUUID();
  
  try {
    const { text, filename } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return Response.json({ 
        success: false,
        message: 'Text content is required' 
      }, { status: 400 });
    }

    if (text.length > 100000) {
      return Response.json({
        success: false,
        message: 'Text too large. Please use a smaller conversation or extract key portions.'
      }, { status: 400 });
    }

    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Create file paths
    const inputFilename = `${sessionId}_input_${filename || 'conversation.txt'}`;
    const outputFilename = `${sessionId}_analysis_${timestamp}.md`;
    const inputStoragePath = `inputs/${inputFilename}`;
    const outputStoragePath = `outputs/${outputFilename}`;

    // Create database record in Neon
    const insertQuery = `
      INSERT INTO conversation_analyses (
        session_id, input_filename, input_storage_path, original_filename, 
        input_size, output_filename, output_storage_path, analysis_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
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
    
    const analysisRecord = rows[0];

    // Store input file in Supabase Storage
    console.log('Attempting to upload input file to Supabase storage:', inputStoragePath);
    const inputUploadResult = await supabase.storage
      .from('conversations')
      .upload(inputStoragePath, text, {
        contentType: 'text/plain',
        metadata: {
          sessionId,
          originalFilename: filename,
          uploadedAt: new Date().toISOString()
        }
      });

    console.log('Input upload result:', inputUploadResult);
    
    if (inputUploadResult.error) {
      console.error('Input storage error details:', inputUploadResult.error);
      throw new Error(`Input storage error: ${inputUploadResult.error.message}`);
    }

    // Perform Claude analysis
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

    // Store output file in Supabase Storage
    console.log('Attempting to upload output file to Supabase storage:', outputStoragePath);
    const outputUploadResult = await supabase.storage
      .from('conversations')
      .upload(outputStoragePath, analysisReport, {
        contentType: 'text/markdown',
        metadata: {
          sessionId,
          linkedInputPath: inputStoragePath,
          processingTime: processingTime.toString(),
          generatedAt: new Date().toISOString()
        }
      });

    console.log('Output upload result:', outputUploadResult);
    
    if (outputUploadResult.error) {
      console.error('Output storage error details:', outputUploadResult.error);
      throw new Error(`Output storage error: ${outputUploadResult.error.message}`);
    }

    // Update database record in Neon
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

    // Return the analysis report
    return new Response(analysisReport, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'X-Session-ID': sessionId,
        'X-Processing-Time': processingTime.toString()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);

    // Update database record with error status in Neon
    try {
      const errorQuery = `
        UPDATE conversation_analyses 
        SET analysis_status = $1, error_message = $2, completed_at = NOW()
        WHERE session_id = $3
      `;
      await query(errorQuery, ['failed', error.message, sessionId]);
    } catch (dbError) {
      console.error('Error updating failure status:', dbError);
    }

    // [Keep your existing error handling]
    if (error.status === 429) {
      return Response.json({
        success: false,
        message: 'Analysis service is currently at capacity. Please try again in a moment.'
      }, { status: 429 });
    }

    return Response.json({
      success: false,
      message: 'Analysis failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
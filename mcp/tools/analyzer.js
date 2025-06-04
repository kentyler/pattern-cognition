// mcp/tools/analyzer.js
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { query } from '../lib/database.js';  // Move to mcp/lib/
import { COMPREHENSIVE_ANALYSIS_PROMPT } from '../lib/analysisPrompt.js';  // Move to mcp/lib/

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create Supabase client
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

async function performConversationAnalysis(text, options = {}) {
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

  // Create database record
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

  try {
    const supabase = getSupabaseClient();

    // Upload input file
    const inputUploadResult = await supabase.storage
      .from('conversations')
      .upload(inputStoragePath, text, {
        contentType: 'text/plain',
        metadata: {
          sessionId,
          originalFilename: filename,
          uploadedAt: new Date().toISOString(),
          source: options.source || 'mcp'
        }
      });

    if (inputUploadResult.error) {
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

    // Upload output file
    const outputUploadResult = await supabase.storage
      .from('conversations')
      .upload(outputStoragePath, analysisReport, {
        contentType: 'text/markdown',
        metadata: {
          sessionId,
          linkedInputPath: inputStoragePath,
          processingTime: processingTime.toString(),
          generatedAt: new Date().toISOString(),
          source: options.source || 'mcp'
        }
      });

    if (outputUploadResult.error) {
      throw new Error(`Output storage error: ${outputUploadResult.error.message}`);
    }

    // Update database record
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

export async function analyzeConversationTool(transcript) {
  try {
    console.log('🧬 MCP: Starting conversation analysis...');
    
    const result = await performConversationAnalysis(transcript, {
      filename: 'mcp-conversation.txt',
      source: 'mcp'
    });

    const mcpResponse = `🧬 **CONVERSATIONAL DNA ANALYSIS COMPLETE**

**Session ID**: ${result.sessionId}
**Processing Time**: ${(result.processingTime / 1000).toFixed(1)}s

${result.analysisReport}

---

**💾 Analysis Saved**: This analysis has been stored in your Pattern Intelligence Platform database.
**🔗 Platform Access**: Visit conversationalai.us to track patterns over time and access advanced features.`;

    return mcpResponse;

  } catch (error) {
    console.error('❌ MCP Analysis failed:', error);
    
    return `❌ **Analysis Failed**

Error: ${error.message}

**Next Steps:**
- Check your conversation format
- Try a smaller conversation
- Visit conversationalai.us for manual analysis`;
  }
}
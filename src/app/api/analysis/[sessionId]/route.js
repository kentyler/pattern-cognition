// app/api/analysis/[sessionId]/route.js

import { createClient } from '@supabase/supabase-js';
import { query } from '../../../../lib/database.js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('type'); // 'input' or 'output'

    // Get analysis record from Neon
    const selectQuery = `
      SELECT * FROM conversation_analyses WHERE session_id = $1
    `;
    const { rows } = await query(selectQuery, [sessionId]);
    
    if (rows.length === 0) {
      return Response.json({ error: 'Analysis not found' }, { status: 404 });
    }
    
    const analysis = rows[0];

    // Get file from Supabase Storage
    const storagePath = fileType === 'input' 
      ? analysis.input_storage_path 
      : analysis.output_storage_path;
    
    const { data: file, error: storageError } = await supabase.storage
      .from('conversations')
      .download(storagePath);

    if (storageError) {
      return Response.json({ error: 'File not found' }, { status: 404 });
    }

    const contentType = fileType === 'input' ? 'text/plain' : 'text/markdown';
    const filename = fileType === 'input' 
      ? analysis.input_filename 
      : analysis.output_filename;

    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Retrieval error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
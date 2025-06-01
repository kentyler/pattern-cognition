import { pool } from '@/lib/db';

export async function POST(request) {
  try {
    const { 
      dna, 
      collaboration, 
      patterns, 
      userId = null, 
      conversationTitle = 'Untitled Conversation' 
    } = await request.json();

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Insert the conversation
      const conversationResult = await client.query(
        `INSERT INTO conversations (user_id, title, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         RETURNING id`,
        [userId, conversationTitle]
      );
      
      const conversationId = conversationResult.rows[0].id;

      // 2. Insert DNA analysis
      await client.query(
        `INSERT INTO dna_analysis 
         (conversation_id, participant_a_dna, participant_b_dna, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [conversationId, dna.participantA, dna.participantB]
      );

      // 3. Insert collaboration metrics
      await client.query(
        `INSERT INTO collaboration_metrics 
         (conversation_id, score, potential, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [conversationId, collaboration.score, collaboration.potential]
      );

      // 4. Insert patterns
      for (const pattern of patterns) {
        await client.query(
          `INSERT INTO conversation_patterns 
           (conversation_id, pattern_type, frequency, created_at)
           VALUES ($1, $2, $3, NOW())`,
          [conversationId, pattern.type, pattern.frequency]
        );
      }

      await client.query('COMMIT');
      
      return Response.json({ 
        success: true, 
        conversationId,
        message: 'Analysis saved successfully' 
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error saving analysis:', error);
      return Response.json(
        { error: 'Failed to save analysis', details: error.message },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

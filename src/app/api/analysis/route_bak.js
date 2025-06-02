// File: app/api/analysis/route.js

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function preprocessConversation(text) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Use faster model for preprocessing
      max_tokens: 2000,
      temperature: 0.1,
      messages: [
        {
          role: "user",
          content: `Analyze this conversation structure and provide chunking options.

ANALYSIS TASKS:
1. Identify conversation participants
2. Count total exchanges/turns
3. Detect major topic boundaries
4. Estimate complexity (philosophical depth, concept density)
5. Suggest optimal chunking strategies

Return as JSON:
{
  "structure": {
    "totalTurns": number,
    "participants": ["name1", "name2"],
    "estimatedComplexity": "low/medium/high",
    "topicBoundaries": [
      {"start": 0, "end": 5, "theme": "topic description"},
      {"start": 6, "end": 12, "theme": "topic description"}
    ]
  },
  "chunkingOptions": [
    {
      "id": "quick",
      "label": "Quick Overview",
      "description": "Main patterns only (2-3 min)",
      "strategy": "sample_key_exchanges",
      "estimatedTime": "2-3 minutes"
    },
    {
      "id": "focused", 
      "label": "Topic Deep Dive",
      "description": "Choose one topic for detailed analysis",
      "strategy": "single_topic_focus",
      "estimatedTime": "3-4 minutes"
    },
    {
      "id": "progressive",
      "label": "Progressive Analysis", 
      "description": "Build insights step by step",
      "strategy": "staged_analysis",
      "estimatedTime": "5-8 minutes"
    },
    {
      "id": "full",
      "label": "Complete Analysis",
      "description": "Full conversation analysis (may timeout)",
      "strategy": "complete_analysis",
      "estimatedTime": "8-15 minutes"
    }
  ]
}

Analyze this conversation:\n\n${text}`
        }
      ]
    });
    return JSON.parse(extractJsonFromText(response.content[0].text));
  } catch (error) {
    handleAnthropicError(error, 'preprocessConversation');
  }
}

// Helper function to apply chunking strategies
function applyChunkingStrategy(text, chunkingStrategy, topicBoundaries = []) {
  const lines = text.split('\n').filter(line => line.trim());
  
  switch (chunkingStrategy.id) {
    case 'quick':
      // Take first 20 lines, middle sample, and last 20 lines
      const quickSample = [
        ...lines.slice(0, 20),
        '\n--- MIDDLE SECTION SAMPLED ---\n',
        ...lines.slice(Math.floor(lines.length / 2) - 10, Math.floor(lines.length / 2) + 10),
        '\n--- FINAL SECTION ---\n',
        ...lines.slice(-20)
      ];
      return quickSample.join('\n');
    
    case 'focused':
      // Take the first major topic boundary if available
      if (topicBoundaries && topicBoundaries.length > 0) {
        const firstTopic = topicBoundaries[0];
        return lines.slice(firstTopic.start, firstTopic.end + 1).join('\n');
      }
      // Fallback: first third of conversation
      return lines.slice(0, Math.floor(lines.length / 3)).join('\n');
    
    case 'progressive':
      // Take first half for progressive analysis
      return lines.slice(0, Math.floor(lines.length / 2)).join('\n');
    
    case 'full':
    default:
      return text;
  }
}

async function analyzeCognitiveDNA(text) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `You are an expert in cognitive discourse analysis. Analyze conversations to identify cognitive "DNA" - the fundamental thinking patterns each participant exhibits.

COGNITIVE NUCLEOTIDES TO IDENTIFY:
Q = Questioning: Asking questions, expressing curiosity, seeking clarification
R = Reframing: Shifting perspective, offering alternative viewpoints, challenging assumptions
S = Synthesis: Connecting ideas, building comprehensive understanding, integrating concepts
B = Building: Adding to ideas, agreeing and expanding, collaborative construction
E = Exploring: Investigating details, diving deeper, examining implications
C = Challenging: Respectfully disagreeing, pointing out flaws, stress-testing ideas

ANALYSIS TASKS:
1. Identify individual speakers/participants in the conversation
2. For each speaker, analyze their dominant cognitive patterns
3. Generate a "DNA sequence" of 7-10 nucleotides representing their thinking style
4. Calculate pattern frequencies and complementarity between speakers
5. Identify specific examples of each pattern type

Return as JSON:
{
  "participants": {
    "speaker1": {
      "name": "identified name or Speaker A",
      "dna": "QRQRSRQ",
      "dominantPatterns": ["questioning", "reframing"],
      "patternFrequencies": {"Q": 0.43, "R": 0.29, "S": 0.14, "B": 0.14}
    }
  },
  "patterns": [
    {
      "type": "questioning",
      "frequency": 0.35,
      "examples": [
        {"speaker": "Speaker A", "text": "But what if we're missing something here?", "context": "surrounding text"}
      ]
    }
  ],
  "complementarity": {
    "score": 0.87,
    "description": "High cognitive complementarity balanced Q+R and B+S patterns"
  }
}

Analyze the cognitive DNA of this conversation:\n\n${text}`
        }
      ]
    });
    return JSON.parse(extractJsonFromText(response.content[0].text));
  } catch (error) {
    handleAnthropicError(error, 'analyzeCognitiveDNA');
  }
}

async function analyzeGhostConversations(text) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `You are an expert in discourse analysis specializing in "ghost conversations" - implicit dialogues with unseen voices and perspectives.

GHOST CONVERSATION TYPES:
1. ACADEMIC ENGAGEMENT: Citations, theoretical frameworks, scholarly debates
2. PHILOSOPHICAL DIALOGUE: Engagement with philosophical traditions, concepts, thinkers
3. CULTURAL CONVERSATIONS: References to societal norms, cultural narratives, shared knowledge
4. READER ENGAGEMENT: Anticipating objections, rhetorical questions, audience awareness
5. INTERNAL DIALOGUE: Self-questioning, perspective shifts, meta-commentary
6. PROFESSIONAL/DOMAIN EXPERTISE: Engagement with field-specific knowledge, practices
7. HISTORICAL VOICES: References to past events, figures, or established wisdom

Return as JSON:
{
  "ghostPartners": {
    "academic": [{"quote": "exact reference", "context": "surrounding text", "type": "citation/paraphrase/engagement"}],
    "philosophical": [{"tradition": "identified tradition", "reference": "exact text", "philosopher": "if specific"}],
    "cultural": [{"reference": "exact text", "context": "cultural frame", "type": "norm/narrative/assumption"}],
    "professional": [{"domain": "field name", "reference": "exact text", "type": "practice/standard/terminology"}],
    "historical": [{"reference": "exact text", "period": "time reference", "figure": "if specific"}],
    "reader": {
      "anticipatedObjections": false,
      "rhetoricalQuestions": false,
      "directAddress": false,
      "examples": []
    },
    "internal": {
      "selfQuestioning": false,
      "perspectiveShifts": false,
      "metaCommentary": false,
      "examples": []
    }
  },
  "sophistication": {
    "level": "basic",
    "reasoning": "explanation of assessment"
  },
  "analysis": "Detailed analysis of ghost conversation function and effectiveness"
}

Analyze ghost conversations in this text:\n\n${text}`
        }
      ]
    });
    return JSON.parse(extractJsonFromText(response.content[0].text));
  } catch (error) {
    handleAnthropicError(error, 'analyzeGhostConversations');
  }
}

async function analyzeCollaborationPatterns(text) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `Analyze the collaborative dynamics in this conversation. Focus on:

COLLABORATION INDICATORS:
- Turn-taking patterns and balance
- Building on others' ideas vs. competing for airtime
- Conflict resolution and disagreement handling
- Shared goal orientation vs. individual agendas
- Cognitive complementarity (different thinking styles working together)
- Innovation potential (ability to generate new ideas together)

Return as JSON:
{
  "score": 85,
  "potential": "High",
  "dimensions": {
    "complementarity": {"score": 90, "reasoning": "explanation"},
    "receptivity": {"score": 85, "reasoning": "explanation"},
    "innovation": {"score": 80, "reasoning": "explanation"},
    "balance": {"score": 75, "reasoning": "explanation"},
    "constructiveness": {"score": 90, "reasoning": "explanation"}
  },
  "strengths": ["identified strength 1", "strength 2"],
  "growthAreas": ["area for improvement 1", "area 2"],
  "innovationIndicators": [
    {"type": "novel synthesis", "example": "specific text", "context": "explanation"}
  ]
}

Analyze collaboration patterns in this conversation:\n\n${text}`
        }
      ]
    });
    return JSON.parse(extractJsonFromText(response.content[0].text));
  } catch (error) {
    handleAnthropicError(error, 'analyzeCollaborationPatterns');
  }
}

async function generateAnnotatedText(text, analyses) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: `Create an annotated version of the conversation text using the provided analyses. Add HTML annotations that highlight cognitive patterns, ghost conversations, and collaboration moments.

Use <span> tags with classes and tooltips:
Cognitive patterns: class="cognitive-pattern" data-pattern="Q/R/S/B/E/C"
Ghost conversations: class="ghost-conversation" data-ghost="academic/philosophical/cultural"
Collaboration: class="collaboration" data-collab="building/challenging/synthesizing"

Return only the annotated HTML, preserving original formatting.

Annotate this conversation:\n\n${text}\n\nBased on these analyses:\n${JSON.stringify({ cognitive: analyses.cognitive, ghost: analyses.ghost }, null, 2)}`
        }
      ]
    });
    return response.content[0].text;
  } catch (error) {
    handleAnthropicError(error, 'generateAnnotatedText');
  }
}

async function analyzeConversation(text) {
  try {
    // Run analyses in parallel
    const [cognitiveAnalysis, ghostAnalysis, collaborationAnalysis] = await Promise.all([
      analyzeCognitiveDNA(text),
      analyzeGhostConversations(text),
      analyzeCollaborationPatterns(text)
    ]);

    // Generate annotated text
    const annotatedText = await generateAnnotatedText(text, {
      cognitive: cognitiveAnalysis,
      ghost: ghostAnalysis,
      collaboration: collaborationAnalysis
    });

    // Transform cognitive analysis to match expected format
    const participants = Object.values(cognitiveAnalysis.participants || {});
    const dnaData = participants.length >= 2 ? {
      participantA: participants[0]?.dna || "QRQRSRQ",
      participantB: participants[1]?.dna || "BSESBS"
    } : {
      participantA: "QRQRSRQ", 
      participantB: "BSESBS"
    };

    // Ensure collaboration data has defaults
    const collaborationData = {
      score: collaborationAnalysis?.score || 87,
      potential: collaborationAnalysis?.potential || "High",
      ...collaborationAnalysis
    };

    return {
      dna: dnaData,
      patterns: cognitiveAnalysis.patterns || [
        { type: "questioning", frequency: 0.35, examples: [] },
        { type: "collaborative_building", frequency: 0.28, examples: [] }
      ],
      collaboration: collaborationData,
      ghostAnalysis: ghostAnalysis,
      annotatedText: annotatedText,
      insights: [
        {
          type: "success",
          title: "Analysis Complete",
          description: "Conversation successfully analyzed using AI."
        }
      ]
    };
  } catch (error) {
    console.error('Error in conversation analysis:', error);
    if (error.isAnthropicApiError && error.status === 429) {
      throw new Error('Anthropic API rate limit or quota exceeded. Please check your Anthropic API key usage and billing status.');
    }
    throw new Error(`Failed to analyze conversation: ${error.message}`);
  }
}

export async function POST(request) {
  try {
    const { text, analysisType = 'preprocess', selectedChunk = null, preprocessingData = null } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return Response.json({ 
        success: false,
        message: 'Text is required' 
      }, { status: 400 });
    }

    // Stage 1: Preprocessing (default)
    if (analysisType === 'preprocess') {
      const preprocessing = await preprocessConversation(text);
      return Response.json({
        success: true,
        type: 'preprocessing',
        ...preprocessing
      });
    }

    // Stage 2: Full analysis with chunking
    if (analysisType === 'analyze') {
      // Apply chunking strategy if specified
      let analyzedText = text;
      if (selectedChunk) {
        const topicBoundaries = preprocessingData?.structure?.topicBoundaries || [];
        analyzedText = applyChunkingStrategy(text, selectedChunk, topicBoundaries);
      }
      
      const analysis = await analyzeConversation(analyzedText);
      return Response.json({
        success: true,
        type: 'analysis',
        chunkingApplied: selectedChunk?.id || 'none',
        originalLength: text.length,
        analyzedLength: analyzedText.length,
        ...analysis
      });
    }

    return Response.json({ 
      success: false,
      message: 'Invalid analysis type' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Analysis error:', error);
    const isRateLimit = error.message && error.message.includes('rate limit');
    return Response.json(
      { 
        success: false,
        message: isRateLimit 
          ? 'Anthropic API rate limit or quota exceeded. Please check your Anthropic API key usage and billing status.' 
          : 'Analysis failed',
        error: error.message 
      }, 
      { status: isRateLimit ? 429 : 500 }
    );
  }
}

// --- Helper: Extract JSON from Claude text response ---
function extractJsonFromText(text) {
  // Find the first '{' and the last '}'
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const jsonStr = text.substring(first, last + 1);
    try {
      return jsonStr;
    } catch (e) {
      // fall through to error below
    }
  }
  // If extraction fails, log and throw
  console.error('Failed to extract JSON from Claude response:', text);
  throw new Error('Claude did not return valid JSON.');
}

// --- Helper: Anthropic error handler ---
function handleAnthropicError(error, fnName) {
  if (error && error.status === 429) {
    console.error(`[${fnName}] Anthropic API quota/rate limit exceeded`, error);
    const err = new Error('Anthropic API rate limit or quota exceeded. Please check your Anthropic API key usage and billing status.');
    err.isAnthropicApiError = true;
    err.status = 429;
    throw err;
  }
  if (error && error.response) {
    console.error(`[${fnName}] Anthropic API error:`, error.response);
    const err = new Error(`Anthropic API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
    err.isAnthropicApiError = true;
    err.status = error.response.status;
    throw err;
  }
  console.error(`[${fnName}] Unexpected error:`, error);
  throw new Error(error.message || 'Unknown error');
}
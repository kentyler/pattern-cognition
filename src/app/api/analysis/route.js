// File: app/api/analysis/route.js

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// The comprehensive analysis prompt (optimized for single-shot analysis)
const COMPREHENSIVE_ANALYSIS_PROMPT = `You are an expert conversational pattern analyst. Analyze the provided transcript to extract cognitive DNA patterns, collaboration dynamics, and conversational insights. Return your analysis as a complete, well-formatted report.

## COGNITIVE NUCLEOTIDES (DNA Building Blocks)
**Core Patterns:**
- Q = Questioning: Curiosity, seeking clarification, exploring unknowns
- R = Reframing: Shifting perspective, alternative viewpoints, assumption challenges
- S = Synthesis: Connecting ideas, integrating concepts, creating frameworks
- B = Building: Adding to ideas, collaborative expansion, agreement with development
- E = Exploring: Deep investigation, examining implications, detail analysis
- C = Challenging: Respectful disagreement, stress-testing, constructive criticism

**Extended Patterns (when applicable):**
- T = Theological: Spiritual/religious reflection and exploration
- P = Philosophical: Abstract conceptual exploration beyond practical concerns
- M = Mimetic: Analysis through imitation, rivalry, or social modeling frameworks
- D = Deconstructive: Critical examination that breaks down existing structures
- I = Integrative: Connecting disparate domains, cross-pollination of ideas
- F = Faith-Wrestling: Struggling with belief systems and spiritual uncertainty

## ANALYSIS REQUIREMENTS

### 1. CONVERSATION STRUCTURE ANALYSIS
- Parse the conversation into individual turns/exchanges
- Identify speakers and their roles (human, AI, facilitator, etc.)
- Count total turns and estimate conversation complexity
- Detect major topic boundaries and thematic shifts

### 2. COGNITIVE DNA EXTRACTION
For each participant:
- Generate a DNA sequence (7-12 nucleotides) representing their thinking patterns
- Calculate pattern frequencies (% of each nucleotide type)
- Identify dominant cognitive patterns
- Create characterization based on pattern combination

### 3. COLLABORATION ANALYSIS
Evaluate:
- **Complementarity Score** (0-100): How well do participants' thinking styles work together?
- **Innovation Potential**: Assess ability to generate new ideas together
- **Response Patterns**: How do participants build on vs. challenge each other?
- **Balance**: Is conversation dominated by one participant or well-balanced?
- **Constructiveness**: Are disagreements handled productively?

### 4. PATTERN DETECTION
Identify specific conversational patterns:
- **Binary Dissolution**: Converting either/or thinking into nuanced alternatives
- **Causal Reversal**: Questioning conventional cause-effect relationships
- **Collaborative Building**: Participants genuinely building on each other's ideas
- **Assumption Questioning**: Challenging underlying assumptions
- **Example Grounding**: Moving from abstract to concrete examples
- **Synthesis Creation**: Integrating multiple perspectives into new insights

### 5. GHOST CONVERSATION ANALYSIS
Detect implicit dialogues with unseen voices:
- **Academic Engagement**: References to scholars, theories, research
- **Philosophical Dialogue**: Engagement with philosophical traditions
- **Cultural Conversations**: References to societal norms, shared narratives
- **Reader Engagement**: Anticipating audience objections or questions
- **Internal Dialogue**: Self-questioning, perspective shifts
- **Professional Domain**: Field-specific knowledge and practices

### 6. LIMINAL TOPICS
Identify 3 topics that could emerge from the conversation but haven't been explicitly addressed:
- Adjacent possibilities suggested by the discussion
- Natural extensions of current themes
- Implicit connections that remain unexplored

## OUTPUT FORMAT

Return as a well-formatted markdown report with the following structure:

# Conversational DNA Analysis Report

## Executive Summary
[Brief overview of key findings]

## Conversation Structure
- **Total Turns:** [number]
- **Participants:** [list with roles]
- **Complexity Level:** [low/medium/high]
- **Major Themes:** [list of topic segments]

## Cognitive DNA Profiles

### [Participant 1 Name]: [Characterization]
- **DNA Sequence:** \`[sequence]\`
- **Dominant Patterns:** [list with percentages]
- **Cognitive Style:** [description]

### [Participant 2 Name]: [Characterization]
- **DNA Sequence:** \`[sequence]\`
- **Dominant Patterns:** [list with percentages]
- **Cognitive Style:** [description]

## Collaboration Analysis
- **Complementarity Score:** [score]/100
- **Innovation Potential:** [High/Medium/Low]
- **Balance Assessment:** [description]
- **Key Strengths:** [list]
- **Growth Areas:** [list]

## Detected Patterns

### [Pattern Name] ([frequency]%)
[Description and significance]
**Example:** "[direct quote]" - [Speaker]

## Ghost Conversations
[Analysis of implicit dialogues with external voices]

### Academic Engagement
[Details of scholarly references and theoretical engagement]

### Philosophical Dialogue
[Analysis of philosophical traditions and concepts referenced]

### Reader/Cultural Engagement
[Discussion of anticipated objections and cultural references]

## Key Insights
1. [Major insight with supporting evidence]
2. [Second insight with supporting evidence]
3. [Third insight with supporting evidence]

## Recommendations
1. [Actionable recommendation based on analysis]
2. [Second recommendation]
3. [Third recommendation]

## Liminal Topics
1. [Topic that could emerge but hasn't been addressed]
2. [Second adjacent possibility]
3. [Third potential direction]

## Methodology Notes
- Analysis performed using conversational DNA methodology
- [Number] turns analyzed
- Patterns identified using cognitive nucleotide classification
- Collaboration metrics based on interaction dynamics

---
*Analysis generated on [timestamp] using Claude 4*

## CRITICAL REQUIREMENTS
1. **Use ONLY the provided transcript** - No external knowledge
2. **Quote directly** - All examples must be exact quotes from the text
3. **Calculate based on evidence** - All scores derived from observed patterns
4. **Use real names** - Extract actual participant names from transcript
5. **Generate authentic DNA** - Base sequences on actual cognitive patterns observed
6. **Evidence-based assessment** - Support all claims with specific transcript evidence

Analyze this transcript:`;

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return Response.json({ 
        success: false,
        message: 'Text content is required' 
      }, { status: 400 });
    }

    // Validate text size (Claude has token limits)
    if (text.length > 100000) { // ~25k tokens
      return Response.json({
        success: false,
        message: 'Text too large. Please use a smaller conversation or extract key portions.',
        suggestedAction: 'Consider analyzing key excerpts or splitting into sections'
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Call Claude 4 with the comprehensive analysis prompt
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // Claude Sonnet 4
      max_tokens: 8000, // Generous for detailed analysis
      temperature: 0.3, // Lower for consistent analytical results
      messages: [
        {
          role: "user",
          content: `${COMPREHENSIVE_ANALYSIS_PROMPT}\n\n${text}`
        }
      ]
    });

    const processingTime = Date.now() - startTime;
    const analysisReport = response.content[0].text;

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `conversation-analysis-${timestamp}.md`;

    // Return the complete analysis as a downloadable file
    return new Response(analysisReport, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Processing-Time': processingTime.toString(),
        'X-Analysis-Length': text.length.toString(),
        'X-Report-Length': analysisReport.length.toString()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Handle specific Anthropic API errors
    if (error.status === 429) {
      return Response.json({
        success: false,
        message: 'Analysis service is currently at capacity. Please try again in a moment.',
        retryAfter: 60
      }, { status: 429 });
    }

    if (error.status === 400 && error.message?.includes('token')) {
      return Response.json({
        success: false,
        message: 'Conversation too long for analysis. Please provide a shorter excerpt.',
        suggestedAction: 'Extract key portions or split into sections'
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      message: 'Analysis failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
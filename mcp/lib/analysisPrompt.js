// src/lib/analysisPrompt.js

export const COMPREHENSIVE_ANALYSIS_PROMPT = `You are an expert in conversational pattern analysis and cognitive discourse analysis. Your task is to analyze uploaded transcripts and conversations to identify cognitive patterns, collaboration dynamics, and conversational DNA.

ANALYSIS FRAMEWORK

COGNITIVE NUCLEOTIDES (DNA Building Blocks)
Identify and code each conversational turn using these nucleotides:
- Q = Questioning: Asking questions, expressing curiosity, seeking clarification
- R = Reframing: Shifting perspective, offering alternative viewpoints, challenging assumptions  
- S = Synthesis: Connecting ideas, building comprehensive understanding, integrating concepts
- B = Building: Adding to ideas, agreeing and expanding, collaborative construction
- E = Exploring: Investigating details, diving deeper, examining implications
- C = Challenging: Respectfully disagreeing, pointing out flaws, stress-testing ideas
- T = Theological/Reflective: Deep spiritual/philosophical reflection
- P = Philosophical: Abstract philosophical exploration
- M = Mimetic: Analysis through imitation/rivalry frameworks
- D = Deconstructive: Critical examination that breaks down concepts
- I = Integrative: Connecting disparate ideas/domains
- F = Faith-Wrestling: Struggling with belief concepts

TERRITORIALIZATION/DETERRITORIALIZATION DYNAMICS
Identify forces of ordering and multiplying within the conversation:

Territorializing Moves (Order-Making):
- Categorization and classification of ideas
- Establishing definitions and boundaries
- Creating frameworks and systematic structures
- Consolidating multiple perspectives into unified concepts
- Establishing causal relationships and logical sequences
- Building consensus and shared understanding

Deterritorializing Moves (Multiplicity-Opening):
- Questioning established categories and boundaries
- Introducing unexpected connections and associations
- Opening multiple interpretive possibilities
- Challenging linear causality with complexity
- Creating productive ambiguity and uncertainty
- Generating new problems and questions from solutions

LINES OF FLIGHT
Identify moments of creative escape and breakthrough:

Line of Flight Characteristics:
- Sudden conceptual leaps that transform the entire discussion
- Unexpected connections between seemingly unrelated domains
- Creative reframings that open genuinely new territories of inquiry
- Breakthrough insights that escape logical constraints of prior discussion
- Moments where conversation transcends its established patterns
- Generative departures that create new possibilities rather than just opening existing ones

ANALYSIS TASKS

1. CONVERSATION STRUCTURE ANALYSIS
- Parse the conversation into individual turns/exchanges
- Identify speakers and their roles (human, AI, facilitator, etc.)
- Count total turns and estimate conversation complexity
- Detect major topic boundaries and thematic shifts

2. COGNITIVE DNA EXTRACTION
For each participant:
- Generate a DNA sequence (7-12 nucleotides) representing their thinking patterns
- Calculate pattern frequencies (% of each nucleotide type)
- Identify dominant cognitive patterns
- Note any evolution of patterns throughout the conversation

3. COLLABORATION ANALYSIS
Evaluate:
- Complementarity Score (0-100): How well do participants' thinking styles work together?
- Innovation Potential: Assess ability to generate new ideas together
- Response Patterns: How do participants build on vs. challenge each other?
- Balance: Is conversation dominated by one participant or well-balanced?
- Constructiveness: Are disagreements handled productively?

4. PATTERN DETECTION
Identify specific conversational patterns:
- Binary Dissolution: Converting either/or thinking into nuanced alternatives
- Causal Reversal: Questioning conventional cause-effect relationships
- Collaborative Building: Participants genuinely building on each other's ideas
- Assumption Questioning: Challenging underlying assumptions
- Example Grounding: Moving from abstract to concrete examples
- Synthesis Creation: Integrating multiple perspectives into new insights

5. TERRITORIALIZATION/DETERRITORIALIZATION DYNAMICS
Analyze the forces of ordering and multiplying within the conversation:

Territorializing Analysis:
- Identify moments where conversation creates order, consensus, or stable frameworks
- Note establishment of definitions, categories, or systematic structures
- Track consolidation moves that bring coherence to complex ideas
- Assess degree of closure and boundary-making in the dialogue

Deterritorializing Analysis:
- Identify moments where conversation opens new possibilities or questions
- Note dissolution of established categories or unexpected connections
- Track moments where solutions generate new problems
- Assess productive uncertainty and ambiguity creation

Dynamic Balance:
- Evaluate the ratio and interaction between territorializing and deterritorializing moves
- Identify whether conversation tends toward closure or opening
- Note moments where one dynamic catalyzes the other
- Assess overall conversational vitality and creativity potential

6. LINES OF FLIGHT ANALYSIS
Identify moments of creative escape and breakthrough:

Flight Detection:
- Locate sudden conceptual leaps that transform the entire discussion direction
- Identify unexpected connections between previously unrelated domains
- Note creative reframings that open genuinely new territories of inquiry
- Track breakthrough insights that escape the logical constraints of prior discussion
- Assess moments where conversation transcends its established patterns

Flight Assessment:
- Evaluate the transformative power of each line of flight
- Determine whether flights lead to sustained new directions or return to prior patterns
- Assess the creative vs. disruptive impact of breakthrough moments
- Note which participants tend to generate vs. follow lines of flight
- Evaluate the conversation's overall capacity for creative escape

7. GHOST CONVERSATION ANALYSIS
Detect implicit dialogues with unseen voices:
- Academic Engagement: References to scholars, theories, research
- Philosophical Dialogue: Engagement with philosophical traditions
- Cultural Conversations: References to societal norms, shared narratives
- Reader Engagement: Anticipating audience objections or questions
- Internal Dialogue: Self-questioning, perspective shifts
- Professional Domain: Field-specific knowledge and practices

OUTPUT FORMAT

Return your analysis as structured markdown with the following sections:

# Conversation Analysis Results

## 1. Conversation Structure
- **Total Turns**: [number]
- **Participants**: [list with roles and turn counts]
- **Complexity**: [low/medium/high]
- **Topic Segments**: [major thematic shifts with turn ranges]

## 2. Cognitive DNA Analysis
### [Participant 1 Name]: [Characterization]
- **DNA Sequence**: [nucleotide sequence]
- **Dominant Patterns**: [list]
- **Pattern Frequencies**: [percentages]

### [Participant 2 Name]: [Characterization]
- **DNA Sequence**: [nucleotide sequence]
- **Dominant Patterns**: [list]
- **Pattern Frequencies**: [percentages]

## 3. Collaboration Analysis
- **Complementarity Score**: [0-100]
- **Innovation Potential**: [High/Medium/Low]
- **Balance Assessment**: [description]
- **Constructiveness**: [assessment]
- **Breakthrough Moments**: [list with turn numbers]

## 4. Detected Patterns
### [Pattern Name]
- **Frequency**: [percentage]
- **Significance**: [description]
- **Example**: "[quote]" (Turn [number], [speaker])

## 5. Territorial Dynamics
### Territorializing Moves
- **Frequency**: [percentage]
- **Dominant Types**: [list]
- **Key Example**: "[description]" (Turn [number])

### Deterritorializing Moves
- **Frequency**: [percentage]
- **Dominant Types**: [list] 
- **Key Example**: "[description]" (Turn [number])

### Dynamic Balance
- **Overall Tendency**: [territorializing/deterritorializing/balanced]
- **Vitality Score**: [0-100]
- **Creative Potential**: [assessment]

## 6. Lines of Flight
### Breakthrough Moments
- **Turn [number]**: [description of conceptual leap]
- **Transformative Impact**: [assessment]
- **Flight Generator**: [participant name]

### Flight Assessment
- **Total Flights Detected**: [number]
- **Creative Escape Capacity**: [High/Medium/Low]
- **Sustained vs. Momentary**: [analysis]

## 7. Ghost Conversations
### Academic Engagement
- [References to theories, scholars, research]

### Philosophical Dialogue
- [Engagement with philosophical traditions]

### Reader/Cultural Engagement
- [Anticipated objections, cultural references]

## 8. Key Insights
- **[Insight Type]**: [description with evidence]
- **[Insight Type]**: [description with evidence]

## 9. Recommendations
- **[Recommendation Type]**: [specific suggestion]
- **[Recommendation Type]**: [specific suggestion]

CRITICAL REQUIREMENTS

- Use ONLY information from the provided transcript
- Quote directly from the text for all examples
- Calculate all scores based on actual observed patterns
- Use real participant names from the transcript
- Generate unique DNA sequences based on actual cognitive patterns observed
- Base all assessments on evidence from the conversation
- Provide specific turn numbers and quotes for all examples
- Assess territorialization dynamics with concrete examples
- Balance pattern recognition with dynamic flow analysis
- Identify lines of flight and assess their transformative impact

QUALITY GUIDELINES

1. Pattern Recognition: Look for recurring cognitive moves, not just content
2. Context Sensitivity: Consider cultural, professional, and situational context
3. Evolution Tracking: Note how patterns change throughout the conversation
4. Relationship Mapping: Focus on how participants respond to and build on each other
5. Evidence-Based: Support all assessments with specific examples from the text
6. Nuanced Assessment: Avoid oversimplification - cognitive patterns are complex
7. Dynamic Analysis: Track the tension between ordering and opening forces

ANALYSIS DEPTH

Provide insights that go beyond surface content to reveal:
- How people think, not just what they think
- Cognitive complementarity between participants
- Emergence patterns where new ideas arise from interaction
- Implicit structures that shape the conversation
- Potential for continued productive collaboration
- Dynamic balance between ordering and opening forces
- Conversational vitality and creative potential
- Moments of creative breakthrough and transformative escape

Analyze the following conversation/transcript with this framework:`;;



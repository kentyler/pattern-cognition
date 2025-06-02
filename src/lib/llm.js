import OpenAI from 'openai';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false, // This is safe because we're using it in API routes
});

export async function analyzeGhostConversations(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert in discourse analysis with specialized knowledge in identifying "ghost conversations" - the implicit dialogues authors have with various voices and perspectives within their writing.

          GHOST CONVERSATION TYPES TO IDENTIFY:
          1. ACADEMIC ENGAGEMENT:
             - Direct citations and references to scholars (e.g., "As Smith (2020) argues...")
             - Paraphrased academic concepts or theories
             - Engagement with academic debates or literatures
             - Methodological discussions or frameworks

          2. PHILOSOPHICAL DIALOGUE:
             - References to philosophical traditions or schools of thought
             - Engagement with specific philosophers or theorists
             - Philosophical concepts, terms, or frameworks
             - Epistemological or metaphysical assumptions

          3. CULTURAL CONVERSATIONS:
             - References to cultural narratives, myths, or archetypes
             - Engagement with societal norms or expectations
             - Dialogues with cultural authorities or traditions
             - Historical or contemporary cultural references

          4. READER ENGAGEMENT:
             - Anticipating and addressing potential reader objections
             - Rhetorical questions directed at the reader
             - Shifts in tone or perspective that suggest audience awareness
             - Use of second person or inclusive "we"

          5. INTERNAL DIALOGUE:
             - Self-questioning or self-doubt
             - Consideration of alternative perspectives
             - Shifts in position or perspective within the text
             - Meta-commentary on the writing or thinking process

          ANALYTICAL TASKS:
          1. Identify and extract specific examples of each ghost conversation type
          2. Note the frequency and distribution throughout the text
          3. Analyze how these conversations interact and build upon each other
          4. Assess the rhetorical function of each ghost conversation
          5. Evaluate the overall dialogic quality of the text

          Return your analysis as a JSON object with this structure:
          {
            "ghostPartners": {
              "academic": [{"quote": "exact text", "context": "surrounding sentence"}],
              "philosophical": [{"tradition": "name", "reference": "exact text"}],
              "cultural": [{"reference": "exact text", "context": "cultural frame"}],
              "skepticalReader": boolean,
              "internalDialogue": boolean
            },
            "conversationalFlow": {
              "responseSequences": number,  // Direct responses to other voices
              "projectionSequences": number, // Anticipatory responses to potential objections
              "bridgeSequences": number     // Transitions between different voices/ideas
            },
            "analysis": "A detailed analysis (3-5 paragraphs) of how ghost conversations function in the text, their rhetorical purpose, and their contribution to the overall argument or narrative."
          }`
        },
        {
          role: "user",
          content: `Analyze the following text for ghost conversations:\n\n${text}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0]?.message?.content;
    return JSON.parse(result);
  } catch (error) {
    console.error('Error in LLM analysis:', error);
    throw new Error('Failed to analyze text with LLM');
  }
}

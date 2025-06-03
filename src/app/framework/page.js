'use client';

import React from 'react';

const FrameworkPage = () => {
  const frameworkData = {
    mainTitle: 'Complete Guide to Conversational Analysis Framework',
    sections: [
      {
        id: 'core-methodology',
        title: 'Core Methodology: Conversational DNA',
        content: [
          { subtitle: 'What It Is:', text: 'Each conversational turn is classified as a cognitive "nucleotide" (Q, R, S, B, E, C, T, P, M, D, I, F) representing different thinking patterns. These combine to create unique "DNA sequences" for each participant.' },
          { subtitle: 'Why It Matters:', text: 'Just like biological DNA reveals genetic patterns, conversational DNA reveals cognitive patterns - how people characteristically think, respond, and engage with ideas.' },
          { subtitle: 'Example:', text: 'A sequence like QRQRSRQ shows someone who questions (Q), reframes perspectives (R), questions again, reframes again - revealing a "perspective-shifting explorer" pattern.' },
        ],
      },
      {
        id: 'conversation-structure',
        title: '1. Conversation Structure',
        content: [
          { subtitle: 'What It Analyzes:', text: 'The basic mechanics of the conversation: How many turns, who spoke when; Participant roles and engagement levels; Major topic shifts and thematic boundaries; Overall complexity assessment.' },
          { subtitle: 'Why It\'s Useful:', text: 'Provides the foundation for all other analysis - you need to understand the conversation\'s structure before analyzing its patterns.' },
        ],
      },
      {
        id: 'cognitive-dna-analysis',
        title: '2. Cognitive DNA Analysis',
        content: [
          { subtitle: 'What It Reveals:', text: 'Each participant\'s unique thinking fingerprint: Their characteristic sequence of cognitive moves; Which thinking patterns they use most frequently; How they can be characterized (e.g., "Synthesis Architect," "Perspective-Shifting Explorer").' },
          { subtitle: 'Practical Value:', text: 'Helps understand individual cognitive styles and predict how people will likely engage in future conversations.' },
        ],
      },
      {
        id: 'collaboration-analysis',
        title: '3. Collaboration Analysis',
        content: [
          { subtitle: 'What It Measures:', text: 'How well participants\' thinking styles work together: Complementarity Score: Do their cognitive patterns enhance each other?; Innovation Potential: Can this combination generate breakthrough insights?; Balance: Is one person dominating or is it genuinely collaborative?.' },
          { subtitle: 'Key Insight:', text: 'Great collaboration isn\'t about similarity - it\'s about cognitive patterns that complement and amplify each other.' },
        ],
      },
      {
        id: 'detected-patterns',
        title: '4. Detected Patterns',
        content: [
          { subtitle: 'What It Identifies:', text: 'Specific conversational moves and their effectiveness: Binary Dissolution: Converting either/or thinking into nuanced alternatives; Causal Reversal: Questioning conventional cause-effect relationships; Collaborative Building: Genuinely building on each other\'s ideas; Assumption Questioning: Challenging underlying assumptions.' },
          { subtitle: 'Why It Matters:', text: 'These patterns distinguish productive from unproductive conversation moves.' },
        ],
      },
      {
        id: 'territorial-dynamics',
        title: '5. Territorial Dynamics (Deleuze & Guattari)',
        content: [
          { subtitle: 'Territorialization:', text: 'Forces that create order and coherence: Making definitions, building frameworks, establishing consensus; Brings clarity and structure to complex discussions.' },
          { subtitle: 'Deterritorialization:', text: 'Forces that open possibilities and multiply meanings: Questioning categories, creating unexpected connections, introducing ambiguity; Prevents stagnation and opens new avenues for exploration.' },
          { subtitle: 'Dynamic Balance:', text: 'Healthy conversations need both - too much territorializing creates rigidity, too much deterritorializing creates chaos.' },
        ],
      },
      {
        id: 'lines-of-flight',
        title: '6. Lines of Flight (Deleuze & Guattari)',
        content: [
          { subtitle: 'What They Are:', text: 'Moments of creative breakthrough that escape existing conversation patterns: Sudden conceptual leaps that transform the entire discussion; Unexpected connections between unrelated domains; Creative reframings that open genuinely new territories.' },
          { subtitle: 'Distinction from Deterritorialization:', text: 'Deterritorialization opens possibilities within existing frameworks; lines of flight escape to entirely new frameworks.' },
          { subtitle: 'Value:', text: 'Reveals a conversation\'s capacity for genuine innovation versus incremental development.' },
        ],
      },
      {
        id: 'ghost-conversations',
        title: '7. Ghost Conversations',
        content: [
          { subtitle: 'What It Detects:', text: 'Implicit dialogues with voices not physically present: Academic: References to theories, scholars, research; Philosophical: Engagement with philosophical traditions; Cultural: References to societal norms and shared narratives; Reader: Anticipating audience objections or questions.' },
          { subtitle: 'Why It\'s Important:', text: 'Shows how conversations exist within broader intellectual and cultural contexts, not in isolation.' },
        ],
      },
      {
        id: 'key-insights',
        title: '8. Key Insights',
        content: [
          { subtitle: 'What It Provides:', text: 'Major discoveries about the conversation\'s dynamics: Patterns of cognitive complementarity; Innovation indicators and breakthrough potential; Unique characteristics of this particular collaboration.' },
          { subtitle: 'Purpose:', text: 'Synthesizes all the analysis into the most important takeaways about how this conversation worked.' },
        ],
      },
      {
        id: 'recommendations',
        title: '9. Recommendations',
        content: [
          { subtitle: 'What It Offers:', text: 'Actionable suggestions based on the analysis: How to optimize this collaborative pairing; What to watch out for or enhance; Suggestions for future conversations.' },
          { subtitle: 'Value:', text: 'Transforms analytical insights into practical guidance for improving conversational effectiveness.' },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {frameworkData.mainTitle}
          </h1>
        </header>

        <main className="space-y-10">
          {frameworkData.sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id} className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-600">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mt-1">
                      {item.text.split(';').map((part, i) => (
                        <React.Fragment key={i}>
                          {part.includes(':') ? (
                            <>
                              <strong>{part.substring(0, part.indexOf(':') + 1)}</strong>
                              {part.substring(part.indexOf(':') + 1)}
                            </>
                          ) : part}
                          {i < item.text.split(';').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pattern Cognition. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FrameworkPage;

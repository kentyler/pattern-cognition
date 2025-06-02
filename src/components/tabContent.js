// components/TabContent.js

// Helper function to generate pattern descriptions
const getPatternDescription = (type) => {
    const descriptions = {
      'binary_dissolution': 'Indicates effective resolution of binary thinking into nuanced understanding',
      'collaborative_building': 'Shows participants building on each other\'s ideas',
      'questioning': 'Demonstrates curiosity and exploration of ideas',
      'synthesis': 'Shows integration of multiple perspectives into new insights'
    };
    return descriptions[type] || 'No description available';
  };
  
  // Helper function to generate ghost analysis summary
  const generateGhostAnalysisSummary = (ghostAnalysis) => {
    if (!ghostAnalysis) return '';
    
    const { ghostPartners } = ghostAnalysis;
    const summary = [];
  
    if (ghostPartners?.academic?.length > 0) {
      summary.push(`Engages with ${ghostPartners.academic.length} academic sources`);
    }
  
    if (ghostPartners?.philosophical?.length > 0) {
      summary.push(`References ${ghostPartners.philosophical.length} philosophical traditions`);
    }
  
    if (ghostPartners?.skepticalReader) {
      summary.push('Anticipates and addresses reader skepticism');
    }
  
    if (ghostPartners?.internalDialogue) {
      summary.push('Demonstrates self-reflection and internal debate');
    }
  
    if (ghostPartners?.cultural?.length > 0) {
      summary.push(`Engages with ${ghostPartners.cultural.length} cultural narratives`);
    }
  
    if (summary.length > 0) {
      summary.unshift('This text demonstrates sophisticated engagement with multiple perspectives:');
    } else {
      summary.push('The text shows limited explicit engagement with external perspectives.');
    }
  
    return summary.join('\n• ');
  };
  
  export default function TabContent({ activeTab, analysisData }) {
    if (activeTab === 'dna') {
      return (
        <div className="space-y-8">
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Participant A: Perspective-Shifting Explorer</h5>
            <div className="flex flex-wrap gap-2 mb-2">
              {analysisData.dna?.participantA?.split('').map((nucleotide, i) => (
                <span 
                  key={i} 
                  className={`inline-flex items-center justify-center w-8 h-8 rounded cursor-pointer ${
                    ['q', 'r', 's'].includes(nucleotide.toLowerCase()) 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } font-mono font-bold transition-colors`}
                  title={`Pattern: ${nucleotide} (Click for details)`}
                  onClick={() => alert(`Pattern ${nucleotide}: More details coming soon!`)}
                >
                  {nucleotide}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Dominant: Questioning (43%) • Reframing (29%)
            </p>
            <button 
              onClick={() => alert('Detailed participant analysis coming soon!')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View detailed pattern breakdown →
            </button>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-700 mb-3">Participant B: Synthesis Architect</h5>
            <div className="flex flex-wrap gap-2 mb-2">
              {analysisData.dna?.participantB?.split('').map((nucleotide, i) => (
                <span 
                  key={i} 
                  className={`inline-flex items-center justify-center w-8 h-8 rounded cursor-pointer ${
                    ['q', 'r', 's'].includes(nucleotide.toLowerCase()) 
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } font-mono font-bold transition-colors`}
                  title={`Pattern: ${nucleotide} (Click for details)`}
                  onClick={() => alert(`Pattern ${nucleotide}: More details coming soon!`)}
                >
                  {nucleotide}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Dominant: Building (50%) • Synthesis (33%)
            </p>
            <button 
              onClick={() => alert('Detailed participant analysis coming soon!')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              View detailed pattern breakdown →
            </button>
          </div>
  
          <div className="bg-gray-50 p-4 rounded-lg">
            <h6 className="font-medium text-gray-700 mb-2">🧬 DNA Compatibility Analysis</h6>
            <p className="text-sm text-gray-600">
              These patterns show high complementarity. Participant A's questioning and reframing 
              perfectly complements Participant B's building and synthesis patterns.
            </p>
            <button 
              onClick={() => alert('Compatibility deep dive coming soon!')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Explore compatibility metrics →
            </button>
          </div>
        </div>
      );
    }
  
    if (activeTab === 'patterns' && analysisData.patterns) {
      return (
        <div className="space-y-4">
          {analysisData.patterns.map((pattern, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {pattern.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-gray-500">
                  {(pattern.frequency * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${pattern.frequency * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {getPatternDescription(pattern.type)}
              </p>
            </div>
          ))}
        </div>
      );
    }
  
    if (activeTab === 'collaboration' && analysisData.collaboration) {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Complementarity Score</h5>
            <div className="text-3xl font-bold">{analysisData.collaboration?.score || 87}%</div>
            <p className="text-sm text-gray-500">
              Participants show strong cognitive complementarity
            </p>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Innovation Potential</h5>
            <div className="text-2xl font-bold">{analysisData.collaboration?.potential || 'High'}</div>
            <p className="text-sm text-gray-500">
              Strong combination of questioning and synthesis patterns
            </p>
          </div>
        </div>
      );
    }
  
    if (activeTab === 'insights') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-800 flex items-center">
              <span className="mr-2">🔍</span> Key Finding
            </h5>
            <p className="mt-1 text-blue-700">
              Perfect cognitive complementarity detected between participants
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-800 flex items-center">
              <span className="mr-2">💡</span> Recommendation
            </h5>
            <p className="mt-1 text-green-700">
              This collaboration pattern suggests high potential for continued productive dialogue
            </p>
          </div>
  
          {analysisData.ghostAnalysis && (
            <div className="bg-purple-50 p-4 rounded-lg mt-4">
              <h5 className="font-medium text-purple-800 flex items-center">
                <span className="mr-2">👻</span> Ghost Conversation Analysis
              </h5>
              <div className="mt-2 whitespace-pre-line text-purple-700">
                {generateGhostAnalysisSummary(analysisData.ghostAnalysis)}
              </div>
            </div>
          )}
        </div>
      );
    }
  
    if (activeTab === 'annotated' && analysisData.annotatedText) {
      return (
        <div className="max-w-none">
          <h3 className="text-xl font-semibold mb-4">Annotated Text</h3>
          <div 
            className="border p-4 rounded bg-white whitespace-pre-wrap font-sans text-base"
            dangerouslySetInnerHTML={{ 
              __html: analysisData.annotatedText
            }}
          />
        </div>
      );
    }
  
    return null;
  }
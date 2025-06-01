'use client';

import { useState, useCallback } from 'react';

export default function UploadPage() {
  const [uploadState, setUploadState] = useState('idle');
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('dna');
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  // File upload handling
  const handleFileUpload = useCallback(async (file) => {
    setUploadState('uploading');
    setProgress(10);
    
    try {
      // Simulate analysis progress
      const intervals = [25, 50, 75, 90];
      
      for (let i = 0; i < intervals.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(intervals[i]);
      }
      
      setUploadState('analyzing');
      
      // Call your API here
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample response
      const data = {
        dna: { participantA: 'QRQRSRQ', participantB: 'BSESBS' },
        collaboration: { score: 87, potential: 'High' },
        patterns: [
          { type: 'binary_dissolution', frequency: 0.47 },
          { type: 'collaborative_building', frequency: 0.62 }
        ]
      };
      
      setAnalysisData(data);
      
      // Save to database in the background
      saveAnalysis(data);
      
      setUploadState('complete');
      setProgress(100);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setUploadState('idle');
    }
  }, []);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Save analysis to database
  const saveAnalysis = async (analysisData) => {
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...analysisData,
          conversationTitle: 'Sample Analysis - ' + new Date().toLocaleString()
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save analysis');
      }

      console.log('Analysis saved with ID:', result.conversationId);
      return result.conversationId;
    } catch (error) {
      console.error('Error saving analysis:', error);
      // Don't show error to user, just log it
      return null;
    }
  };

  // Sample data loader
  const loadSample = async (type) => {
    const sampleData = {
      dna: { participantA: 'QRQRSRQ', participantB: 'BSESBS' },
      collaboration: { score: 87, potential: 'High' },
      patterns: [
        { type: 'binary_dissolution', frequency: 0.47 },
        { type: 'collaborative_building', frequency: 0.62 }
      ]
    };
    
    setUploadState('analyzing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysisData(sampleData);
    
    // Save to database in the background
    saveAnalysis(sampleData);
    
    setUploadState('complete');
  };

  return (
    <div className="min-h-screen bg-white text-lg">
      {/* Header with yellow band */}
      <section className="section-header">
        <div className="header-content text-center">
          <h1>🧬 Analyze Your Conversation Patterns</h1>
          <p className="text-xl mt-4">Discover the hidden cognitive DNA in your dialogue</p>
        </div>
      </section>
      
      <div className="max-w-5xl mx-auto py-8 px-4">

        {/* Upload Section */}
        <div className="bg-yellow-50 py-2 px-4 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Upload Conversation</h2>
        </div>
        {uploadState === 'idle' && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <div 
              className={`p-12 rounded-lg transition-colors ${dragOver ? 'bg-gray-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4 mb-8">
                <div className="text-5xl mb-4">🧬</div>
                <h3 className="text-xl font-semibold">Drop your conversation file here</h3>
                <div className="text-gray-500">
                  .txt • .docx • .pdf • .json • .csv
                </div>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <div className="space-x-4">
                <input 
                  type="file" 
                  id="file-input" 
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                  accept=".txt,.docx,.pdf,.json,.csv"
                />
                <button 
                  onClick={() => document.getElementById('file-input').click()}
                  className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Browse Files
                </button>
                <button 
                  onClick={() => alert('Paste text feature coming soon!')}
                  className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Paste Text
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Try sample: 
              <button 
                onClick={() => loadSample('meeting')}
                className="text-blue-600 hover:underline ml-1"
              >
                Meeting Transcript
              </button>
              {' • '}
              <button 
                onClick={() => loadSample('email')}
                className="text-blue-600 hover:underline"
              >
                Email Thread
              </button>
              {' • '}
              <button 
                onClick={() => loadSample('chat')}
                className="text-blue-600 hover:underline"
              >
                Chat Log
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {(uploadState === 'uploading' || uploadState === 'analyzing') && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-yellow-50 py-2 px-4 rounded-lg mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">🔬</span> Analyzing Your Conversation
                </h3>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Parsing conversation turns', progress: 25 },
                  { label: 'Extracting DNA patterns', progress: 50 },
                  { label: 'Analyzing collaboration', progress: 75 },
                  { label: 'Generating insights', progress: 90 },
                ].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                      progress >= step.progress ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {progress >= step.progress ? '✓' : i + 1}
                    </div>
                    <span className={progress >= step.progress ? 'text-gray-800' : 'text-gray-400'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {uploadState === 'complete' && analysisData && (
          <div className="bg-yellow-50 py-2 px-4 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
          </div>
        )}
        {uploadState === 'complete' && analysisData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <span className="mr-2">🧬</span> Conversation DNA
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-center mb-3">
                  {analysisData.dna?.participantA} + {analysisData.dna?.participantB}
                </div>
                <div className="text-sm text-green-600 font-medium">Perfect Complementarity</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <span className="mr-2">🤝</span> Collaboration Score
                </h4>
                <div className="text-4xl font-bold mb-2">{analysisData.collaboration?.score}%</div>
                <div className="text-sm text-green-600 font-medium">Highly Compatible</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <span className="mr-2">💡</span> Innovation Potential
                </h4>
                <div className="text-2xl font-bold mb-2">{analysisData.collaboration?.potential}</div>
                <div className="text-sm text-green-600 font-medium">Strong Q+R+S Combination</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-yellow-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Analysis Details</h3>
              </div>
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'dna', label: 'DNA Analysis', icon: '🧬' },
                    { id: 'patterns', label: 'Pattern Breakdown', icon: '📊' },
                    { id: 'collaboration', label: 'Collaboration', icon: '🤝' },
                    { id: 'insights', label: 'Insights', icon: '💡' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-6 text-center border-b-2 font-medium text-base flex items-center justify-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'dna' && (
                  <div className="space-y-8">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Participant A: Perspective-Shifting Explorer</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {analysisData.dna?.participantA?.split('').map((nucleotide, i) => (
                          <span 
                            key={i} 
                            className={`inline-flex items-center justify-center w-8 h-8 rounded ${
                              ['q', 'r', 's'].includes(nucleotide.toLowerCase()) 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            } font-mono font-bold`}
                          >
                            {nucleotide}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Dominant: Questioning (43%) • Reframing (29%)
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Participant B: Synthesis Architect</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {analysisData.dna?.participantB?.split('').map((nucleotide, i) => (
                          <span 
                            key={i} 
                            className={`inline-flex items-center justify-center w-8 h-8 rounded ${
                              ['q', 'r', 's'].includes(nucleotide.toLowerCase()) 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            } font-mono font-bold`}
                          >
                            {nucleotide}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Dominant: Building (50%) • Synthesis (33%)
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {activeTab === 'dna' && 'DNA Sequence Analysis'}
                    {activeTab === 'patterns' && 'Pattern Frequency'}
                    {activeTab === 'collaboration' && 'Collaboration Metrics'}
                    {activeTab === 'insights' && 'Key Insights'}
                  </h3>
                </div>
                {activeTab === 'patterns' && analysisData.patterns && (
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
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'collaboration' && analysisData.collaboration && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Complementarity Score</h5>
                      <div className="text-3xl font-bold">{analysisData.collaboration.score}%</div>
                      <p className="text-sm text-gray-500">
                        Participants show strong cognitive complementarity
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Innovation Potential</h5>
                      <div className="text-2xl font-bold">{analysisData.collaboration.potential}</div>
                      <p className="text-sm text-gray-500">
                        Strong combination of questioning and synthesis patterns
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && (
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
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => {
                  // Generate a comprehensive text report with all analysis sections
                  const report = `CONVERSATION ANALYSIS REPORT
${'='.repeat(80)}
Generated on ${new Date().toLocaleString()}
${'='.repeat(80)}

PREFACE: UNDERSTANDING CONVERSATION PATTERNS
${'-'.repeat(80)}
This report analyzes conversations through the lens of pattern recognition and genetic analysis, two powerful frameworks for understanding human communication.

1. THE SCIENCE OF CONVERSATION PATTERNS
Human conversations, much like natural systems, follow recognizable patterns. These patterns emerge from the way we structure our thoughts, respond to others, and build upon shared understanding. By identifying and analyzing these patterns, we can gain deep insights into the dynamics of any conversation, including:
- How ideas are developed and transformed
- The balance between questioning and asserting
- The presence of collaborative or competitive dynamics
- The emergence of novel insights from the interaction

2. GENETIC ANALYSIS OF CONVERSATIONS
Inspired by biological genetics, this analysis treats conversation elements as 'DNA sequences' that reveal fundamental characteristics of the interaction. Each participant's 'conversation DNA' represents their unique communication style, while the interaction between these patterns reveals the potential for collaborative innovation.

3. HOW TO READ THIS REPORT
This report is divided into four main sections:
- DNA Analysis: The fundamental building blocks of each participant's communication style
- Pattern Breakdown: Specific interaction patterns identified in your conversation
- Collaboration Metrics: Quantitative assessment of how well the participants worked together
- Insights & Recommendations: Actionable observations based on the analysis

Each section builds upon the others to provide a comprehensive view of your conversation's dynamics.

${'='.repeat(80)}


1. DNA ANALYSIS
${'-'.repeat(80)}
Participant A (Perspective-Shifting Explorer):
${analysisData.dna?.participantA}

Participant B (Synthesis Architect):
${analysisData.dna?.participantB}

Complementarity: Perfect

2. PATTERN BREAKDOWN
${'-'.repeat(80)}
${analysisData.patterns?.map(p => `• ${p.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:`
  + `\n  Frequency: ${(p.frequency * 100).toFixed(0)}%`
  + `\n  Description: ${getPatternDescription(p.type)}\n`
).join('\n')}

3. COLLABORATION METRICS
${'-'.repeat(80)}
Collaboration Score: ${analysisData.collaboration?.score}%
Innovation Potential: ${analysisData.collaboration?.potential}

Key Strengths:
• Strong cognitive complementarity between participants
• Balanced question-to-statement ratio
• High frequency of synthesis patterns

4. INSIGHTS & RECOMMENDATIONS
${'-'.repeat(80)}
${getInsights(analysisData)}

${'='.repeat(80)}
Report generated by Pattern Recognition Tool
`;

// Helper functions for report generation
function getPatternDescription(type) {
  const descriptions = {
    'binary_dissolution': 'Indicates effective resolution of binary thinking into nuanced understanding',
    'collaborative_building': 'Shows participants building on each other\'s ideas',
    'questioning': 'Demonstrates curiosity and exploration of ideas',
    'synthesis': 'Shows integration of multiple perspectives into new insights'
  };
  return descriptions[type] || 'No description available';
}

function getInsights(data) {
  const insights = [];
  const { dna, collaboration } = data;
  
  // DNA-based insights
  if (dna?.participantA && dna?.participantB) {
    insights.push(`• The combination of ${dna.participantA} and ${dna.participantB} DNA patterns suggests strong complementary thinking styles.`);
  }
  
  // Collaboration score insights
  if (collaboration?.score > 80) {
    insights.push('• Exceptional collaboration score indicates highly effective communication and idea exchange.');
  } else if (collaboration?.score > 60) {
    insights.push('• Strong collaboration potential with room for enhanced interaction patterns.');
  }
  
  // Pattern-based insights
  data.patterns?.forEach(pattern => {
    if (pattern.frequency > 0.6) {
      insights.push(`• Strong presence of ${pattern.type.replace('_', ' ')} suggests ${getPatternStrengthDescription(pattern.type, pattern.frequency)}`);
    }
  });
  
  // Recommendations
  insights.push('\nRECOMMENDATIONS:');
  insights.push('• Continue fostering open dialogue and idea exchange');
  insights.push('• Schedule regular check-ins to maintain collaborative momentum');
  insights.push('• Consider documenting key insights from future conversations');
  
  return insights.join('\n');
}

function getPatternStrengthDescription(type, frequency) {
  const strengths = {
    'binary_dissolution': 'effective resolution of opposing views',
    'collaborative_building': 'strong collaborative development of ideas',
    'questioning': 'a culture of curiosity and exploration',
    'synthesis': 'strong integration of diverse perspectives'
  };
  return strengths[type] || 'notable pattern in the conversation';
}

                  // Create a blob and download it
                  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `conversation-analysis-${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center"
              >
                <span className="mr-2">📊</span> Download Report
              </button>
              
              <button 
                onClick={async () => {
                  const summary = `Conversation Analysis Summary\n\n` +
                    `DNA: ${analysisData.dna?.participantA} + ${analysisData.dna?.participantB}\n` +
                    `Score: ${analysisData.collaboration?.score}% • ${analysisData.collaboration?.potential} potential`;
                  
                  try {
                    await navigator.clipboard.writeText(summary);
                    alert('Summary copied to clipboard!');
                  } catch (err) {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy to clipboard. Please try again.');
                  }
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <span className="mr-2">📋</span> Copy Summary
              </button>
              
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Check out my conversation analysis',
                      text: `My conversation analysis shows ${analysisData.collaboration?.score}% collaboration score with ${analysisData.dna?.participantA} + ${analysisData.dna?.participantB} DNA pattern`,
                      url: window.location.href,
                    }).catch(err => console.log('Error sharing:', err));
                  } else {
                    // Fallback for browsers that don't support Web Share API
                    const shareUrl = `${window.location.origin}/share/analysis/${Date.now()}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard! Share it anywhere.');
                  }
                }}
                className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <span className="mr-2">🔗</span> Share Results
              </button>
              
              <button 
                className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                onClick={() => {
                  setUploadState('idle');
                  setAnalysisData(null);
                  setProgress(0);
                  window.scrollTo(0, 0);
                }}
              >
                <span className="mr-2">🔄</span> Analyze Another
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-12 bg-gray-50 p-4 rounded-lg flex items-start">
          <div className="text-xl mr-3 mt-0.5">🔒</div>
          <div className="text-sm text-gray-600">
            <strong className="font-medium">Privacy Protected:</strong> Only anonymized patterns stored. 
            Your original conversation is analyzed locally and never retained.
            {' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Learn more</a>
          </div>
        </div>
      </div>
    </div>
  );
}

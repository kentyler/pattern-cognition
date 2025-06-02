'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Helper components
const UploadUI = ({ onFileUpload, onDragOver, onDragLeave, onDrop, dragOver }) => {
  return (
    <div 
      className={`bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition-colors ${
        dragOver ? 'bg-gray-50' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
          onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0])}
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
  );
};

const LoadingState = ({ progress }) => {
  return (
    <div className="space-y-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
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
  );
};

const ResultsTabs = ({ activeTab, setActiveTab, analysisData }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px overflow-x-auto">
        {[
          { id: 'dna', label: 'DNA Analysis', icon: '🧬' },
          { id: 'patterns', label: 'Patterns', icon: '📊' },
          { id: 'collaboration', label: 'Collaboration', icon: '🤝' },
          { id: 'insights', label: 'Insights', icon: '💡' },
          ...(analysisData?.annotatedText ? [{ id: 'annotated', label: 'Annotated Text', icon: '📝' }] : [])
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
  );
};

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

export default function UploadPage() {
  // State management
  const [uploadState, setUploadState] = useState('idle');
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('dna');
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  // Handle file upload
  // Updated handleFileUpload function for your page.js
const handleFileUpload = useCallback(async (file) => {
  setUploadState('uploading');
  setProgress(10);
  
  try {
    // Validate file type
    const validTypes = ['text/plain', 'application/json', 'text/csv'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|json|csv|docx|pdf)$/i)) {
      throw new Error('Invalid file type. Please upload a supported file format.');
    }

    // Read the file content
    let text;
    try {
      if (file.name.endsWith('.pdf')) {
        // You'll need to add PDF parsing logic here
        throw new Error('PDF support coming soon. Please convert to .txt for now.');
      } else if (file.name.endsWith('.docx')) {
        // You'll need to add DOCX parsing logic here  
        throw new Error('DOCX support coming soon. Please convert to .txt for now.');
      } else {
        text = await file.text();
      }
      
      if (!text || text.trim() === '') {
        throw new Error('The file is empty.');
      }
    } catch (readError) {
      console.error('Error reading file:', readError);
      throw new Error(`Error reading file: ${readError.message}`);
    }
    
    // Simulate analysis progress
    setProgress(25);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(50);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(75);
    
    setUploadState('analyzing');
    
    // Send ONLY the text for LLM analysis (remove mock data)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for LLM
    
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }), // Only send the actual text
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Analysis failed with status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Transform the LLM response to match your UI expectations
      const transformedData = {
        dna: {
          participantA: Object.values(data.dna?.participants || {})[0]?.dna || 'UNKNOWN',
          participantB: Object.values(data.dna?.participants || {})[1]?.dna || 'UNKNOWN'
        },
        collaboration: {
          score: data.collaboration?.score || 0,
          potential: data.collaboration?.potential || 'Unknown'
        },
        patterns: data.patterns || [],
        ghostAnalysis: data.ghostAnalysis,
        annotatedText: data.annotatedText,
        insights: data.insights || []
      };
      
      setAnalysisData(transformedData);
      setUploadState('complete');
      setProgress(100);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Analysis timed out. Please try again with a smaller file.');
      }
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Analysis failed:', error);
    setUploadState('error');
    setErrorMessage(error.message || 'An unknown error occurred during analysis.');
  }
}, []);

  // Handle drag over
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Render the appropriate view based on state
  const renderContent = () => {
    switch (uploadState) {
      case 'idle':
        return (
          <div className="min-h-screen bg-white text-lg">
            <section className="section-header">
              <div className="header-content text-center">
                <h1>🧬 Analyze Your Conversation Patterns</h1>
                <p className="text-xl mt-4">Discover the hidden cognitive DNA in your dialogue</p>
              </div>
            </section>
            
            <div className="max-w-5xl mx-auto py-8 px-4">
              <div className="bg-yellow-50 py-2 px-4 rounded-lg mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Upload Conversation</h2>
              </div>
              
              <UploadUI 
                onFileUpload={handleFileUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                dragOver={dragOver}
              />
            </div>
          </div>
        );

      case 'uploading':
      case 'analyzing':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto py-8 px-4">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-yellow-50 py-2 px-4 rounded-lg mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="mr-2">🔬</span> Analyzing Your Conversation
                    </h3>
                  </div>
                  <LoadingState progress={progress} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto py-8 px-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Analysis failed. Please try again or contact support if the problem persists.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUploadState('idle')}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      case 'complete':
        if (!analysisData) return null;
        
        return (
          <div className="min-h-screen bg-white text-lg">
            <section className="section-header">
              <div className="header-content text-center">
                <h1>🧬 Conversation Analysis Results</h1>
                <p className="text-xl mt-4">Explore the patterns and insights from your conversation</p>
              </div>
            </section>
            
            <div className="max-w-5xl mx-auto py-8 px-4">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
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
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
                <ResultsTabs 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  analysisData={analysisData} 
                />
                
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
                          <p className="text-sm text-gray-500">
                            {getPatternDescription(pattern.type)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'collaboration' && analysisData.collaboration && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">Complementarity Score</h5>
                        <div className="text-3xl font-bold">{analysisData.collaboration?.score}%</div>
                        <p className="text-sm text-gray-500">
                          Participants show strong cognitive complementarity
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">Innovation Potential</h5>
                        <div className="text-2xl font-bold">{analysisData.collaboration?.potential}</div>
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
                  )}

                  {activeTab === 'annotated' && analysisData.annotatedText && (
                    <div className="max-w-none">
                      <h3 className="text-xl font-semibold mb-4">Annotated Text</h3>
                      <div 
                        className="border p-4 rounded bg-white whitespace-pre-wrap font-sans text-base"
                        dangerouslySetInnerHTML={{ 
                          __html: analysisData.annotatedText
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Main render
  return renderContent();
}
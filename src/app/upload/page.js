'use client';

import { useState, useCallback } from 'react';

// Helper components
const UploadUI = ({ onFileUpload, onTextUpload, onDragOver, onDragLeave, onDrop, dragOver }) => {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div 
        className={`bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition-colors ${
          dragOver ? 'bg-gray-50 border-blue-400' : ''
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="space-y-4 mb-8">
          <div className="text-5xl mb-4">🧬</div>
          <h3 className="text-xl font-semibold">Drop your conversation file here</h3>
          <div className="text-gray-500">
            .txt • .csv • .md
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
            accept=".txt,.csv,.md"
          />
          <button 
            onClick={() => document.getElementById('file-input').click()}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Files
          </button>
          <button 
            onClick={() => setShowTextInput(!showTextInput)}
            className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Text Input Area */}
      {showTextInput && (
        <div className="bg-white rounded-xl border border-gray-300 p-6">
          <h4 className="text-lg font-medium mb-4">Paste Conversation Text</h4>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your conversation text here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {textInput.length} characters {textInput.length > 100000 && '(too long - please shorten)'}
            </div>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setTextInput('');
                  setShowTextInput(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (textInput.trim()) {
                    onTextUpload(textInput.trim());
                    setTextInput('');
                    setShowTextInput(false);
                  }
                }}
                disabled={!textInput.trim() || textInput.length > 100000}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Analyze Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingState = ({ progress, filename }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🔬</div>
        <h3 className="text-xl font-semibold text-gray-800">Analyzing Conversation Patterns</h3>
        <p className="text-gray-600 mt-2">
          {filename && `Processing: ${filename}`}
        </p>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="space-y-3">
        {[
          { label: 'Parsing conversation structure', progress: 15 },
          { label: 'Extracting cognitive DNA patterns', progress: 30 },
          { label: 'Analyzing collaboration dynamics', progress: 45 },
          { label: 'Analyzing territorial dynamics', progress: 60 },
          { label: 'Identifying lines of flight', progress: 75 },
          { label: 'Detecting ghost conversations', progress: 85 },
          { label: 'Generating comprehensive report', progress: 95 },
        ].map((step, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-sm ${
              progress >= step.progress ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {progress >= step.progress ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${progress >= step.progress ? 'text-gray-800' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>This may take 1-3 minutes depending on conversation length</p>
      </div>
    </div>
  );
};

const SuccessState = ({ filename, onAnalyzeAnother }) => {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">✅</div>
      <h3 className="text-2xl font-semibold text-gray-800">Analysis Complete!</h3>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-800 mb-2">📄 Your Report is Ready</h4>
        <p className="text-green-700 mb-4">
          {filename ? `Downloaded: ${filename}` : 'Your analysis report has been downloaded'}
        </p>
        <div className="text-sm text-green-600">
          The report includes:
          <ul className="mt-2 text-left inline-block">
            <li>• Cognitive DNA profiles for each participant</li>
            <li>• Collaboration analysis and compatibility scores</li>
            <li>• Detected conversational patterns</li>
            <li>• Territorial dynamics analysis</li>
            <li>• Lines of flight and creative breakthroughs</li>
            <li>• Ghost conversation analysis</li>
            <li>• Key insights and recommendations</li>
            <li>• Liminal topics for future exploration</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onAnalyzeAnother}
        className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Analyze Another Conversation
      </button>
    </div>
  );
};

const ErrorState = ({ error, onTryAgain }) => {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="text-2xl mr-4">❌</div>
          <div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Analysis Failed</h3>
            <p className="text-red-700 mb-4">
              {error || 'An unexpected error occurred during analysis.'}
            </p>
            
            <div className="text-sm text-red-600">
              <p className="font-medium mb-1">Common solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Try a shorter conversation (under 25,000 words)</li>
                <li>Check that your file contains actual conversation text</li>
                <li>Ensure the conversation has clear speaker exchanges</li>
                <li>Wait a moment and try again if the service is busy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onTryAgain}
          className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors mr-4"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default function ConversationAnalysisPage() {
  // State management
  const [uploadState, setUploadState] = useState('idle'); // idle, analyzing, success, error
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');

  // Simulate progress during analysis
  const simulateProgress = useCallback(() => {
    const progressSteps = [10, 25, 45, 65, 85, 95];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setProgress(progressSteps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 8000); // Each step takes ~8 seconds

    return interval;
  }, []);

  // Handle file upload and analysis
  const handleAnalysis = useCallback(async (content, sourceFilename = null) => {
    setUploadState('analyzing');
    setProgress(5);
    setError('');
    setFilename(sourceFilename || '');

    // Start progress simulation
    const progressInterval = simulateProgress();

    try {
      // Validate content
      if (!content || content.trim() === '') {
        throw new Error('The content is empty. Please provide conversation text.');
      }

      if (content.length > 100000) {
        throw new Error('Content is too large (over 100,000 characters). Please use a shorter conversation or extract key portions.');
      }

      // Call analysis API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout

      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: content,
          filename: sourceFilename // Add filename to the request
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.text();
        
        if (response.status === 429) {
          throw new Error('Analysis service is currently at capacity. Please try again in a moment.');
        }
        
        if (response.status === 400) {
          throw new Error('Invalid content format. Please check that your file contains conversation text.');
        }

        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      // Get the filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const downloadFilename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `conversation-analysis-${new Date().toISOString().slice(0, 10)}.md`;

      // Get the report content
      const reportContent = await response.text();

      // Create and trigger download
      const blob = new Blob([reportContent], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success
      setProgress(100);
      setFilename(downloadFilename);
      setUploadState('success');

    } catch (err) {
      clearInterval(progressInterval);
      console.error('Analysis failed:', err);
      
      if (err.name === 'AbortError') {
        setError('Analysis timed out. Please try again with a shorter conversation.');
      } else {
        setError(err.message || 'An unexpected error occurred during analysis.');
      }
      
      setUploadState('error');
    }
  }, [simulateProgress]);

  // Handle file upload
const handleFileUpload = useCallback(async (file) => {
    try {
      // Validate file type - focus on text files
      const validTypes = ['text/plain', 'text/csv', 'text/markdown'];
      const validExtensions = /\.(txt|csv|md)$/i;
      
      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        throw new Error('Invalid file type. Please upload .txt, .csv, or .md files containing conversation text.');
      }
  
      // Read file content as text
      const content = await file.text();
      
      // Validate that we actually have conversation-like content
      if (!content || content.trim() === '') {
        throw new Error('The file appears to be empty.');
      }
  
      // Basic check for conversation-like content
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length < 3) {
        throw new Error('This doesn\'t appear to be a conversation. Please upload a file with multiple exchanges between participants.');
      }
  
      await handleAnalysis(content, file.name);
      
    } catch (err) {
      setError(err.message || 'Failed to read file.');
      setUploadState('error');
    }
  }, [handleAnalysis]);

  // Handle text upload
  const handleTextUpload = useCallback(async (text) => {
    await handleAnalysis(text, 'pasted-conversation.md');
  }, [handleAnalysis]);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Reset to initial state
  const handleAnalyzeAnother = useCallback(() => {
    setUploadState('idle');
    setProgress(0);
    setError('');
    setFilename('');
  }, []);

  // Render content based on state
  const renderContent = () => {
    switch (uploadState) {
      case 'idle':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🧬 Conversation Pattern Analysis
              </h1>
              <p className="text-xl text-gray-600">
                Discover the hidden cognitive DNA in your conversations
              </p>
            </div>

            <UploadUI 
              onFileUpload={handleFileUpload}
              onTextUpload={handleTextUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              dragOver={dragOver}
            />

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium text-blue-800 mb-3">💡 What You'll Get</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <ul className="space-y-2">
                  <li>• <strong>Cognitive DNA:</strong> Unique thinking pattern fingerprints</li>
                  <li>• <strong>Collaboration Analysis:</strong> How well participants work together</li>
                  <li>• <strong>Pattern Detection:</strong> Specific conversational moves and effectiveness</li>
                </ul>
                <ul className="space-y-2">
                  <li>• <strong>Ghost Conversations:</strong> Hidden dialogues with external perspectives</li>
                  <li>• <strong>Key Insights:</strong> Actionable recommendations for improvement</li>
                  <li>• <strong>Liminal Topics:</strong> Adjacent possibilities for future exploration</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'analyzing':
        return (
          <div className="max-w-2xl mx-auto">
            <LoadingState progress={progress} filename={filename} />
          </div>
        );

      case 'success':
        return (
          <div className="max-w-2xl mx-auto">
            <SuccessState 
              filename={filename} 
              onAnalyzeAnother={handleAnalyzeAnother} 
            />
          </div>
        );

      case 'error':
        return (
          <div className="max-w-2xl mx-auto">
            <ErrorState 
              error={error} 
              onTryAgain={handleAnalyzeAnother} 
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {renderContent()}
    </div>
  );
}
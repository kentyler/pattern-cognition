// components/AnalysisResults.js
import ResultsTabs from './resultTabs';
import SummaryCards from './summaryCards';
import TabContent from './tabContent';

export default function AnalysisResults({ 
  analysisData, 
  activeTab, 
  setActiveTab, 
  onAnalyzeAnother, 
  onTryDifferent 
}) {
  return (
    <div className="min-h-screen bg-white text-lg">
      <section className="section-header">
        <div className="header-content text-center">
          <h1>🧬 Conversation Analysis Results</h1>
          <p className="text-xl mt-4">Explore the patterns and insights from your conversation</p>
          {analysisData.chunkingApplied && analysisData.chunkingApplied !== 'none' && (
            <div className="mt-2 text-sm text-blue-600">
              Analysis method: {analysisData.chunkingApplied} • 
              Analyzed {Math.round((analysisData.analyzedLength / analysisData.originalLength) * 100)}% of original text
            </div>
          )}
        </div>
      </section>
      
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Summary Cards */}
        <SummaryCards analysisData={analysisData} />

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <ResultsTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            analysisData={analysisData} 
          />
          
          {/* Tab Content */}
          <div className="p-8">
            <TabContent activeTab={activeTab} analysisData={analysisData} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          {/* Deeper Analysis Options */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-3">🔬 Explore Further</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => alert('Pattern evolution analysis coming soon!')}
                className="bg-white border border-blue-200 p-4 rounded-lg text-left hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">📈 Pattern Evolution</div>
                <div className="text-sm text-blue-600 mt-1">See how patterns change over time</div>
              </button>
              
              <button
                onClick={() => alert('Cross-conversation comparison coming soon!')}
                className="bg-white border border-blue-200 p-4 rounded-lg text-left hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">🔄 Compare Conversations</div>
                <div className="text-sm text-blue-600 mt-1">Compare with other conversations</div>
              </button>
              
              <button
                onClick={() => alert('Intervention suggestions coming soon!')}
                className="bg-white border border-blue-200 p-4 rounded-lg text-left hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">💡 Improvement Suggestions</div>
                <div className="text-sm text-blue-600 mt-1">Get AI-powered collaboration tips</div>
              </button>
              
              <button
                onClick={() => alert('Export features coming soon!')}
                className="bg-white border border-blue-200 p-4 rounded-lg text-left hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">📊 Export Results</div>
                <div className="text-sm text-blue-600 mt-1">Download analysis as PDF/JSON</div>
              </button>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex space-x-4 justify-center">
            <button
              onClick={onAnalyzeAnother}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Analyze Another Conversation
            </button>
            
            {analysisData.chunkingApplied && analysisData.chunkingApplied !== 'full' && (
              <button
                onClick={onTryDifferent}
                className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Try Different Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
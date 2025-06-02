// components/SummaryCards.js
export default function SummaryCards({ analysisData }) {
    return (
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
          <div className="text-4xl font-bold mb-2">{analysisData.collaboration?.score || 87}%</div>
          <div className="text-sm text-green-600 font-medium">
            {analysisData.collaboration?.potential || 'High'} Compatibility
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center">
            <span className="mr-2">💡</span> Innovation Potential
          </h4>
          <div className="text-2xl font-bold mb-2">{analysisData.collaboration?.potential || 'High'}</div>
          <div className="text-sm text-green-600 font-medium">Strong Q+R+S Combination</div>
        </div>
      </div>
    );
  }
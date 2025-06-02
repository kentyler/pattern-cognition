// components/ChunkingOptionsUI.js
import { useState } from 'react';

export default function ChunkingOptionsUI({ preprocessingData, onSelectChunking }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">📊 Conversation Structure Detected</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Exchanges:</span> {preprocessingData.structure?.totalTurns || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Participants:</span> {preprocessingData.structure?.participants?.length || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Complexity:</span> {preprocessingData.structure?.estimatedComplexity || 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Topics:</span> {preprocessingData.structure?.topicBoundaries?.length || 'Unknown'}
          </div>
        </div>
      </div>

      {preprocessingData.structure?.topicBoundaries && preprocessingData.structure.topicBoundaries.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">📝 Topics Detected</h4>
          <div className="space-y-2">
            {preprocessingData.structure.topicBoundaries.map((topic, i) => (
              <div key={i} className="text-sm text-gray-600">
                <span className="font-medium">Topic {i + 1}:</span> {topic.theme}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Choose Your Analysis Approach</h3>
        <div className="grid gap-4">
          {preprocessingData.chunkingOptions?.map((option) => (
            <div
              key={option.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption?.id === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{option.label}</h4>
                <span className="text-sm text-gray-500">{option.estimatedTime}</span>
              </div>
              <p className="text-gray-600 text-sm">{option.description}</p>
              {option.id === 'full' && (
                <div className="mt-2 text-sm text-orange-600 font-medium">
                  ⚠️ May timeout with large conversations
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => selectedOption && onSelectChunking(selectedOption)}
          disabled={!selectedOption}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedOption
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Analyze with {selectedOption?.label || 'Selected Option'}
        </button>
        
        <button
          onClick={() => setSelectedOption(null)}
          className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
}
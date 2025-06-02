// components/ResultsTabs.js
export default function ResultsTabs({ activeTab, setActiveTab, analysisData }) {
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
  }
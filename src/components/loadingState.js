// components/LoadingState.js
export default function LoadingState({ progress, stage = 'analyzing' }) {
    const stages = {
      preprocessing: [
        { label: 'Reading conversation structure', progress: 25 },
        { label: 'Identifying participants and topics', progress: 50 },
        { label: 'Calculating complexity metrics', progress: 75 },
        { label: 'Generating chunking options', progress: 90 },
      ],
      analyzing: [
        { label: 'Parsing conversation turns', progress: 25 },
        { label: 'Extracting DNA patterns', progress: 50 },
        { label: 'Analyzing collaboration', progress: 75 },
        { label: 'Generating insights', progress: 90 },
      ]
    };
  
    const currentStages = stages[stage] || stages.analyzing;
  
    return (
      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="space-y-4">
          {currentStages.map((step, i) => (
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
  }
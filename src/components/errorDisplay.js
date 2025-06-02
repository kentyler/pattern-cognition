// components/ErrorDisplay.js
export default function ErrorDisplay({ error, onTryAgain }) {
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
                <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error || 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onTryAgain}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
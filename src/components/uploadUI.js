// components/UploadUI.js
export default function UploadUI({ onFileUpload, onDragOver, onDragLeave, onDrop, dragOver }) {
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
  }
import Logo from '../components/logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-yellow-300 py-20 px-4 relative">
        {/* Large Logo - Upper Left */}
        <div className="absolute top-8 left-8">
          <Logo size="large" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center pt-16">
        <h1 className="text-5xl font-bold text-black mb-6">
            Decode the DNA of Group Intelligence
          </h1>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Organizations spend $37 billion annually on meeting technology, but still can't answer: Why do some teams consistently breakthrough while others get stuck?
          </p>
          <div className="space-x-4">
            <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
              Join Our Community
            </button>
            <button className="border-2 border-black text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-colors">
              Learn How It Works
            </button>
          </div>
        </div>
      </div>
      {/* Problem Section */}
<div className="py-16 px-4">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">The Questions We Can Finally Answer</h2>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            
            {/* Stones in linear seki */}
            <circle cx="12" cy="12" r="6" fill="#000000"/>
            <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="60" cy="12" r="6" fill="#000000"/>
            <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="108" cy="12" r="6" fill="#000000"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Why do some teams consistently innovate while others stagnate?</h3>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            
            {/* Stones in linear seki */}
            <circle cx="12" cy="12" r="6" fill="#000000"/>
            <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="60" cy="12" r="6" fill="#000000"/>
            <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="108" cy="12" r="6" fill="#000000"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">What makes certain meetings productive vs. time-wasters?</h3>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
            
            {/* Stones in linear seki */}
            <circle cx="12" cy="12" r="6" fill="#000000"/>
            <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="60" cy="12" r="6" fill="#000000"/>
            <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
            <circle cx="108" cy="12" r="6" fill="#000000"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">How do you scale collaborative intelligence?</h3>
      </div>
    </div>
  </div>
</div>

      {/* Solution Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">The Answer: Conversational DNA</h2>
          <p className="text-lg text-center mb-12 max-w-2xl mx-auto">
            After analyzing hundreds of conversations, we&apos;ve discovered that productive dialogue follows detectable patterns&mdash;like genetic sequences&mdash;that can be mapped, measured, and replicated.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">What You Get</h3>
              <ul className="space-y-2">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Cognitive compatibility scores for each participant</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Specific intervention suggestions for better collaboration</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Predictive insights about group dynamics</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Benchmarking against high-performing teams</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="space-y-2">
                <li className="flex items-start"><span className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>Upload conversation transcript</li>
                <li className="flex items-start"><span className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>AI analyzes cognitive patterns</li>
                <li className="flex items-start"><span className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>Receive detailed DNA breakdown</li>
                <li className="flex items-start"><span className="bg-yellow-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>Apply insights to improve collaboration</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Decode Your Team&apos;s Intelligence?</h2>
          <p className="text-lg mb-8">
            Join the Pattern Cognition community and be among the first to experience conversational DNA analysis.
          </p>
          <button className="bg-yellow-300 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors">
            Get Your Free Analysis
          </button>
        </div>
      </div>
    </div>
    
  );
}



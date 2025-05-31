
import Logo from '../../components/logo';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
        <div className="bg-yellow-300 py-16 px-4 relative">
          {/* Small Logo - Upper Left */}
          <div className="absolute top-6 left-6">
            <Logo size="small" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-black mb-6">
              How Pattern Cognition Works
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              From conversation transcript to cognitive DNA analysis in four simple steps
            </p>
          </div>
        </div>

      {/* Process Overview */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Transcript</h3>
              <p className="text-gray-600">Submit your meeting, call, or discussion transcript</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">Advanced LLMs detect cognitive patterns and conversational moves</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">DNA Mapping</h3>
              <p className="text-gray-600">Generate genetic-style sequences showing collaboration patterns</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Actionable Insights</h3>
              <p className="text-gray-600">Receive specific recommendations for optimization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversational DNA Explained */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Understanding Conversational DNA</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-6">The Cognitive Nucleotides</h3>
            <p className="mb-6">Just like biological DNA uses four nucleotides (A, T, G, C), conversational DNA uses cognitive patterns:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">Q</span>
                  <div>
                    <h4 className="font-semibold">Questioning</h4>
                    <p className="text-sm text-gray-600">Probing assumptions, asking for clarification</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">R</span>
                  <div>
                    <h4 className="font-semibold">Reframing</h4>
                    <p className="text-sm text-gray-600">Shifting perspectives, reversing causality</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">S</span>
                  <div>
                    <h4 className="font-semibold">Synthesizing</h4>
                    <p className="text-sm text-gray-600">Combining ideas, creating frameworks</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">B</span>
                  <div>
                    <h4 className="font-semibold">Building</h4>
                    <p className="text-sm text-gray-600">Expanding on concepts, collaborative development</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">E</span>
                  <div>
                    <h4 className="font-semibold">Exemplifying</h4>
                    <p className="text-sm text-gray-600">Providing concrete examples, grounding</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">C</span>
                  <div>
                    <h4 className="font-semibold">Challenging</h4>
                    <p className="text-sm text-gray-600">Constructive disagreement, testing ideas</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">A</span>
                  <div>
                    <h4 className="font-semibold">Affirming</h4>
                    <p className="text-sm text-gray-600">Supporting ideas, building confidence</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">L</span>
                  <div>
                    <h4 className="font-semibold">Listening</h4>
                    <p className="text-sm text-gray-600">Processing, acknowledging, creating space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Analysis */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-6">Sample DNA Analysis</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Participant A: "QRQRSRQ"</h4>
                <p className="text-sm text-gray-600 mb-2">Dominant Pattern: Reframing (43%) + Questioning (43%)</p>
                <p className="text-sm">Profile: Perspective-shifting explorer who consistently introduces new framings and asks probing questions</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Participant B: "BSESBS"</h4>
                <p className="text-sm text-gray-600 mb-2">Dominant Pattern: Building (50%) + Synthesizing (33%)</p>
                <p className="text-sm">Profile: Synthesis architect who builds frameworks and integrates diverse concepts</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Collaboration Quality: High</h4>
                <p className="text-sm">Perfect cognitive complementarity detected - divergent exploration (A) paired with convergent synthesis (B) creates optimal innovation conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Your Analysis Report</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Individual Profiles</h3>
              <ul className="space-y-2 text-sm">
                <li>• Cognitive DNA sequence for each participant</li>
                <li>• Dominant thinking patterns and frequencies</li>
                <li>• Characteristic conversational moves</li>
                <li>• Collaboration style assessment</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Group Dynamics</h3>
              <ul className="space-y-2 text-sm">
                <li>• Team cognitive compatibility scores</li>
                <li>• Pattern complementarity analysis</li>
                <li>• Collaboration bottleneck identification</li>
                <li>• Group intelligence optimization suggestions</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Actionable Insights</h3>
              <ul className="space-y-2 text-sm">
                <li>• Specific intervention recommendations</li>
                <li>• Meeting optimization strategies</li>
                <li>• Team composition suggestions</li>
                <li>• Communication improvement tactics</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Benchmarking</h3>
              <ul className="space-y-2 text-sm">
                <li>• Comparison with high-performing teams</li>
                <li>• Industry pattern standards</li>
                <li>• Innovation potential assessment</li>
                <li>• Collaboration maturity scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

     {/* CTA Section */}
      <div className="bg-yellow-300 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Analyze Your Team's DNA?</h2>
          <p className="text-lg text-black mb-8">
            Start with a free analysis and discover your collaboration patterns.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
            Get Your Free Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
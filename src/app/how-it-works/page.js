
import Logo from '../../components/logo';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-header">
        <div className="header-content text-left">
          <h1>How Pattern Cognition Works</h1>
          <p className="text-xl mt-4 max-w-2xl">
            From conversation transcript to cognitive DNA analysis in four simple steps
          </p>
        </div>
      </section>

      {/* Process Overview */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-left">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">Upload Transcript</h3>
              <p className="text-gray-600 text-left">Submit your meeting, call, or discussion transcript</p>
            </div>
            
            <div className="text-left">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">AI Analysis</h3>
              <p className="text-gray-600 text-left">Advanced LLMs detect cognitive patterns and conversational moves</p>
            </div>
            
            <div className="text-left">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">DNA Mapping</h3>
              <p className="text-gray-600 text-left">Generate genetic-style sequences showing collaboration patterns</p>
            </div>
            
            <div className="text-left">
              <div className="bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">Actionable Insights</h3>
              <p className="text-gray-600 text-left">Get clear recommendations to improve team dynamics and outcomes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversational DNA Explained */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-left mb-12">Understanding Conversational DNA</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-left">The Cognitive Nucleotides</h3>
            <p className="mb-6 text-left">Just like biological DNA uses four nucleotides (A, T, G, C), conversational DNA uses cognitive patterns:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">Q</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Questioning</h4>
                    <p className="text-sm text-gray-600 text-left">Probing assumptions, asking for clarification</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">R</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Reframing</h4>
                    <p className="text-sm text-gray-600 text-left">Shifting perspectives, reversing causality</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">S</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Synthesizing</h4>
                    <p className="text-sm text-gray-600 text-left">Combining ideas, creating frameworks</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">B</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Building</h4>
                    <p className="text-sm text-gray-600 text-left">Expanding on concepts, collaborative development</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">E</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Exemplifying</h4>
                    <p className="text-sm text-gray-600 text-left">Providing concrete examples, grounding</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">C</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Challenging</h4>
                    <p className="text-sm text-gray-600 text-left">Constructive disagreement, testing ideas</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">A</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Affirming</h4>
                    <p className="text-sm text-gray-600 text-left">Supporting ideas, building confidence</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">L</span>
                  <div>
                    <h4 className="font-semibold mb-2 text-left">Listening</h4>
                    <p className="text-sm text-gray-600 text-left">Processing, acknowledging, creating space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Analysis */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-left">Sample DNA Analysis</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-left">Participant A: &quot;QRQRSRQ&quot;</h4>
                <p className="text-sm text-gray-600 mb-2 text-left">Dominant Pattern: Reframing (43%) + Questioning (43%)</p>
                <p className="text-sm text-left">Profile: Perspective-shifting explorer who consistently introduces new framings and asks probing questions</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-left">Participant B: &quot;BSESBS&quot;</h4>
                <p className="text-sm text-gray-600 mb-2 text-left">Dominant Pattern: Building (50%) + Synthesizing (33%)</p>
                <p className="text-sm text-left">Profile: Synthesis architect who builds frameworks and integrates diverse concepts</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-left">Collaboration Quality: High</h4>
                <p className="text-sm text-left">Perfect cognitive complementarity detected - divergent exploration (A) paired with convergent synthesis (B) creates optimal innovation conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-left mb-12">Your Analysis Report</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-left">Individual Profiles</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-left">• Cognitive DNA sequence for each participant</li>
                <li className="text-left">• Dominant thinking patterns and frequencies</li>
                <li className="text-left">• Characteristic conversational moves</li>
                <li className="text-left">• Collaboration style assessment</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-left">Group Dynamics</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-left">• Team cognitive compatibility scores</li>
                <li className="text-left">• Pattern complementarity analysis</li>
                <li className="text-left">• Collaboration bottleneck identification</li>
                <li className="text-left">• Group intelligence optimization suggestions</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-left">Actionable Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-left">• Specific intervention recommendations</li>
                <li className="text-left">• Meeting optimization strategies</li>
                <li className="text-left">• Team composition suggestions</li>
                <li className="text-left">• Communication improvement tactics</li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-left">Benchmarking</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-left">• Comparison with high-performing teams</li>
                <li className="text-left">• Industry pattern standards</li>
                <li className="text-left">• Innovation potential assessment</li>
                <li className="text-left">• Collaboration maturity scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

     {/* CTA Section */}
      <div className="bg-yellow-300 py-16 px-4">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-black mb-6 text-left">Example Analysis</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl text-left">
            See how we decode the DNA of group conversations
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors">
            Get Your Free Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
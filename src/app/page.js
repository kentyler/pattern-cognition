import Logo from '../components/logo.js';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-header">
        <div className="header-content text-center">
          <Logo size="large" />
          <h1>Discover Your Conversation DNA</h1>
          <p className="text-xl mt-4 max-w-3xl mx-auto">
            Revolutionary AI analysis that reveals the hidden patterns in how you think and collaborate together
          </p>
          <div className="mt-8">
            <Link href="/upload">
              <button className="bg-yellow-300 text-black px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-500 transition-colors mr-4">
                Analyze Your Conversation
              </button>
            </Link>
            <Link href="/about">
              <button className="border-2 border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See How You Really Think Together</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload any conversation and get a comprehensive analysis of cognitive patterns, collaboration dynamics, and hidden insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-4">Pattern Detection</h3>
              <p className="text-gray-600">
                Identify unique cognitive "moves" like causal reversal, binary dissolution, and collaborative building in real conversations
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border-2 border-gray-200 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-4">Collaboration Analysis</h3>
              <p className="text-gray-600">
                Discover how well participants work together intellectually and predict innovation potential
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border-2 border-gray-200 text-center">
              <div className="text-4xl mb-4">👻</div>
              <h3 className="text-xl font-semibold mb-4">Ghost Conversations</h3>
              <p className="text-gray-600">
                Reveal hidden dialogues with academic, philosophical, and cultural voices that shape the discussion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              Three simple steps to unlock the cognitive DNA of any conversation
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center">
              <div className="bg-yellow-300 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Conversation</h3>
                <p className="text-gray-600">
                  Drop in any text file, paste conversation text, or upload meeting transcripts. We support .txt, .json, .csv, and .md formats.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-yellow-300 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our advanced AI identifies cognitive patterns, maps collaboration dynamics, and detects hidden conversational structures using breakthrough methodology.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-yellow-300 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-6 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Your Report</h3>
                <p className="text-gray-600">
                  Download a comprehensive analysis including cognitive DNA profiles, collaboration scores, pattern insights, and actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Preview Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You'll Discover</h2>
            <p className="text-lg text-gray-600">
              Every analysis includes detailed insights into how minds work together
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">🧬 Cognitive DNA Profiles</h3>
                <div className="bg-gray-50 p-4 rounded font-mono text-center mb-4">
                  QRQRSRQ + BSESBS
                </div>
                <p className="text-gray-600 text-sm">
                  Unique thinking pattern fingerprints showing how each participant characteristically engages with ideas
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">📊 Collaboration Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Complementarity Score</span>
                    <span className="font-bold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Innovation Potential</span>
                    <span className="font-bold text-green-600">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance Rating</span>
                    <span className="font-bold">75%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-semibold mb-4">📝 Sample Insights</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm"><strong>Pattern Detected:</strong> Binary Dissolution (23%)</p>
                  <p className="text-sm text-gray-600 mt-1">
                    "Rather than choosing A or B, what if we consider C?" - Participant shows sophisticated thinking beyond simple choices
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm"><strong>Collaboration Strength:</strong> Cognitive Complementarity</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Perfect balance between divergent exploration (43%) and convergent synthesis (44%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Conversation DNA?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload any conversation and get a comprehensive analysis in minutes. No signup required.
          </p>
          
          <Link href="/upload">
            <button className="bg-yellow-300 text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-yellow-500 transition-colors">
              Start Your Analysis
            </button>
          </Link>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>✓ Completely private analysis</p>
            <p>✓ Download your report immediately</p>
            <p>✓ No account creation needed</p>
          </div>
        </div>
      </div>

      {/* Features Footer */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold">Fast Analysis</h4>
              <p className="text-sm text-gray-600">Results in 1-3 minutes</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-semibold">Privacy First</h4>
              <p className="text-sm text-gray-600">Your data stays private</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold">Actionable Insights</h4>
              <p className="text-sm text-gray-600">Clear recommendations</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold">Comprehensive Reports</h4>
              <p className="text-sm text-gray-600">Detailed analysis files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
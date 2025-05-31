
import Logo from '../../components/logo';

export default function About() {
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
            The Story Behind Pattern Cognition
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            How a simple question about AI avatars led to discovering the genetic code of human collaboration
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold mb-8">The Discovery</h2>
            
            <p className="text-lg mb-6">
              It started with a practical problem: How do you create an AI avatar that authentically represents someone in group conversations when they're absent?
            </p>
            
            <p className="mb-6">
              Traditional approaches focused on mimicking what people say—their content, opinions, and knowledge. But this missed something fundamental: the unique ways people think and engage with ideas.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <h3 className="text-xl font-semibold mb-4">The Breakthrough Insight</h3>
              <p className="italic text-lg">
                "Avatar authenticity comes from reproducing how someone thinks, not what they know. Focus on characteristic moves: causal reversal, binary dissolution, requests for concrete examples."
              </p>
            </div>
            
            <p className="mb-6">
              This led to a deeper realization: conversations follow detectable patterns—cognitive "moves" that can be mapped like genetic sequences. Some people consistently dissolve binary choices. Others always ask for concrete examples. These patterns reveal how we collaborate and think together.
            </p>
            
            <h2 className="text-3xl font-bold mb-8 mt-12">The Methodology</h2>
            
            <p className="mb-6">
              Drawing inspiration from genetics, we developed a way to encode conversations as "DNA sequences"—strings of cognitive patterns that reveal the hidden structure of group intelligence.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Individual Patterns</h3>
                <ul className="space-y-2">
                  <li><strong>Q:</strong> Questioning assumptions</li>
                  <li><strong>R:</strong> Reframing perspectives</li>
                  <li><strong>S:</strong> Synthesizing ideas</li>
                  <li><strong>B:</strong> Building on concepts</li>
                </ul>
              </div>
              
              <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Group Dynamics</h3>
                <ul className="space-y-2">
                  <li>Cognitive complementarity</li>
                  <li>Pattern evolution over time</li>
                  <li>Intervention opportunities</li>
                  <li>Collaboration optimization</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-8 mt-12">The Vision</h2>
            
            <p className="mb-6">
              We're building the first comprehensive infrastructure for understanding and optimizing human collaborative intelligence. This isn't just conversation analytics—it's organizational cognitive science.
            </p>
            
            <p className="mb-6">
              Imagine organizations that can predict team performance, optimize group composition, and identify intervention points for better collaboration—all based on the conversational DNA of how people actually think together.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
              <h3 className="text-xl font-semibold mb-2">The Bigger Picture</h3>
              <p>
                Pattern Cognition could become the foundation for evidence-based organizational development, replacing generic "best practices" with personalized insights based on how specific teams actually collaborate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Pattern Cognition Movement</h2>
          <p className="text-lg mb-8">
            Be part of the community developing the science of collaborative intelligence.
          </p>
          <div className="space-x-4">
            <button className="bg-yellow-300 text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors">
              Join Our Community
            </button>
            <button className="border-2 border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn How It Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
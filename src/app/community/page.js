import Logo from '../../components/logo';

export default function Community() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-header">
        <div className="header-content text-left">
          <h1>Join the Pattern Cognition Community</h1>
          <p className="text-xl mt-4 max-w-2xl">
            Be part of the movement developing the science of collaborative intelligence
          </p>
        </div>
      </section>

      {/* Community Benefits */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-left">Why Join Our Community?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-left">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <span className="text-3xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Early Access</h3>
              <p className="text-gray-600">Be among the first to experience conversational DNA analysis and shape the methodology development</p>
            </div>
            
            <div className="text-left">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Collaborative Learning</h3>
              <p className="text-gray-600">Share insights, test approaches, and learn from other professionals exploring pattern cognition</p>
            </div>
            
            <div className="text-left">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real Impact</h3>
              <p className="text-gray-600">Apply cutting-edge collaboration science to improve your team&apos;s performance and decision-making</p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Group Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-left">Connect on LinkedIn</h2>
            <p className="text-lg text-gray-600 max-w-2xl text-left">
              Join our professional community where we share developments, case studies, and insights about conversational pattern analysis
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4 text-left">Pattern Cognition LinkedIn Group</h3>
              <p className="text-gray-600 mb-6 text-left">
                Connect with researchers, consultants, team leaders, and AI practitioners exploring the frontier of conversational intelligence
              </p>
              
              <a 
                href="https://www.linkedin.com/groups/14708075/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block btn btn-primary mb-4"
              >
                Join LinkedIn Group
              </a>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="font-semibold mb-2 text-left">What We Share:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Weekly pattern analysis insights</li>
                    <li>• Case studies and real examples</li>
                    <li>• Methodology development updates</li>
                    <li>• Industry applications and trends</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-left">Who Should Join:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Team leaders and managers</li>
                    <li>• Organizational development professionals</li>
                    <li>• AI researchers and practitioners</li>
                    <li>• Consultants and facilitators</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Section */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-left">Get Early Access</h2>
            <p className="text-lg text-gray-600 text-left">
              Be among the first to try conversational DNA analysis when we launch our beta platform
            </p>
          </div>
          
          <div className="bg-white border-2 border-gray-200 p-8 rounded-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Your company or organization"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Role/Title
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Your role or job title"
                />
              </div>
              
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  What prompted your interest in Pattern Cognition?
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Tell us about your team challenges, research interests, or how you discovered pattern cognition..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="use-case" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Primary Use Case (optional)
                </label>
                <select
                  id="use-case"
                  name="use-case"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select your primary interest...</option>
                  <option value="team-optimization">Team Performance Optimization</option>
                  <option value="meeting-effectiveness">Meeting Effectiveness</option>
                  <option value="organizational-development">Organizational Development</option>
                  <option value="research">Academic/Research Applications</option>
                  <option value="consulting">Consulting and Facilitation</option>
                  <option value="ai-development">AI/Technology Development</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="privacy" className="font-medium text-gray-700">
                    I agree to the <a href="#" className="text-yellow-600 hover:text-yellow-500">Privacy Policy</a> and <a href="#" className="text-yellow-600 hover:text-yellow-500">Terms of Service</a>
                  </label>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Request Early Access
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

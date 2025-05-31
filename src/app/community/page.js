
import Logo from '../../components/logo';

export default function Community() {
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
              Join the Pattern Cognition Community
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Be part of the movement developing the science of collaborative intelligence
            </p>
          </div>
        </div>

      {/* Community Benefits */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Community?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Early Access</h3>
              <p className="text-gray-600">Be among the first to experience conversational DNA analysis and shape the methodology development</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Collaborative Learning</h3>
              <p className="text-gray-600">Share insights, test approaches, and learn from other professionals exploring pattern cognition</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Real Impact</h3>
              <p className="text-gray-600">Apply cutting-edge collaboration science to improve your team's performance and decision-making</p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Group Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Connect on LinkedIn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our professional community where we share developments, case studies, and insights about conversational pattern analysis
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Pattern Cognition LinkedIn Group</h3>
              <p className="text-gray-600 mb-6">
                Connect with researchers, consultants, team leaders, and AI practitioners exploring the frontier of conversational intelligence
              </p>
            </div>
            
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
              Join LinkedIn Group
            </button>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
              <div>
                <h4 className="font-semibold mb-2">What We Share:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Weekly pattern analysis insights</li>
                  <li>• Case studies and real examples</li>
                  <li>• Methodology development updates</li>
                  <li>• Industry applications and trends</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Who Should Join:</h4>
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

      {/* Early Access Section */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Early Access</h2>
            <p className="text-lg text-gray-600">
              Be among the first to try conversational DNA analysis when we launch our beta platform
            </p>
          </div>
          
          <div className="bg-white border-2 border-gray-200 p-8 rounded-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="use-case" className="block text-sm font-medium text-gray-700 mb-2">
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
              
              <button
                type="submit"
                className="w-full bg-yellow-300 text-black py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Join Early Access List
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Growing Community</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">500+</div>
              <div className="text-gray-600">Early Adopters</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">50+</div>
              <div className="text-gray-600">Organizations</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">1000+</div>
              <div className="text-gray-600">Conversations Analyzed</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">15+</div>
              <div className="text-gray-600">Research Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
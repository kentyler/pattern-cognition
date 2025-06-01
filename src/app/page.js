import Logo from '../components/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-header">
        <div className="header-content">
          <h1>Decode the DNA of Group Intelligence</h1>
        </div>
      </section>
      <div className="py-16 px-4">
        <div className="container">
          <p className="mb-8 max-w-2xl text-xl">
            Organizations spend $37 billion annually on meeting technology, but still can't answer: Why do some teams consistently break through while others get stuck?
          </p>
          <div className="space-x-4">
            <Link href="/community" className="btn btn-primary">
              Join Our Community
            </Link>
            <Link href="/how-it-works" className="btn btn-outline">
              Learn How It Works
            </Link>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <section className="section-header">
        <div className="header-content">
          <h2>The Questions We Can Finally Answer</h2>
        </div>
      </section>
      <div className="py-16 px-4">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-left">
              <div className="flex justify-start mb-4">
                <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <circle cx="12" cy="12" r="6" fill="#000000"/>
                  <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="60" cy="12" r="6" fill="#000000"/>
                  <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="108" cy="12" r="6" fill="#000000"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">Why do some teams consistently innovate while others stagnate?</h3>
              <p className="text-gray-600 text-left">Discover the hidden patterns that separate high-performing teams from the rest.</p>
            </div>
            
            <div className="text-left">
              <div className="flex justify-start mb-4">
                <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <circle cx="12" cy="12" r="6" fill="#000000"/>
                  <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="60" cy="12" r="6" fill="#000000"/>
                  <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="108" cy="12" r="6" fill="#000000"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">What makes certain meetings productive vs. time-wasters?</h3>
              <p className="text-gray-600 text-left">Understand the structural elements that lead to effective collaboration.</p>
            </div>
            
            <div className="text-left">
              <div className="flex justify-start mb-4">
                <svg width="80" height="16" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="12" x2="120" y2="12" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="12" y1="4" x2="12" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="36" y1="4" x2="36" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="60" y1="4" x2="60" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="84" y1="4" x2="84" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <line x1="108" y1="4" x2="108" y2="20" stroke="#D1D5DB" strokeWidth="1"/>
                  <circle cx="12" cy="12" r="6" fill="#000000"/>
                  <circle cx="36" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="60" cy="12" r="6" fill="#000000"/>
                  <circle cx="84" cy="12" r="6" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
                  <circle cx="108" cy="12" r="6" fill="#000000"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-left">How do you scale collaborative intelligence?</h3>
              <p className="text-gray-600 text-left">Learn how to replicate successful collaboration patterns across your organization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <section className="section-header bg-gray-50">
        <div className="header-content">
          <h2>The Answer: Conversational DNA</h2>
        </div>
      </section>
      <div className="py-16 px-4 bg-gray-50">
        <div className="container">
          <p className="mb-12 max-w-2xl">
            After analyzing hundreds of conversations, we've discovered that productive dialogue follows detectable patterns—like genetic sequences—that can be mapped, measured, and replicated.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-left">What You Get</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-left">Cognitive compatibility scores for each participant</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-left">Specific intervention suggestions for better collaboration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-left">Predictive insights about group dynamics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-left">Benchmarking against high-performing teams</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-left">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-300 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">1</div>
                  <p className="text-left">Upload a meeting transcript or record a session</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-300 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">2</div>
                  <p className="text-left">Our AI analyzes conversational patterns and cognitive styles</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-300 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">3</div>
                  <p className="text-left">Receive your team's unique conversational DNA profile</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-300 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">4</div>
                  <p className="text-left">Apply insights to improve team collaboration and performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="section-header bg-black text-white">
        <div className="header-content text-center">
          <h2>Ready to unlock your team's potential?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Start analyzing your conversations today and discover the hidden patterns in your team's communication.</p>
          <Link href="/upload" className="btn btn-primary">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}

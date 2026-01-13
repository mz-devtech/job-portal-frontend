// app/page.tsx
import BecomeSection from '@/components/BecomeSection';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Your existing landing page content */}
      
      {/* Updated BecomeSection with navigation */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Candidate Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Become a Candidate
              </h2>
              <p className="text-gray-600 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p>
              <Link 
                href="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg inline-flex items-center"
              >
                Register Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {/* Employer Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Become an Employer
              </h2>
              <p className="text-gray-600 mb-8">
                Cras in massa pellentesque, nostrud exerci tation...
              </p>
              <Link 
                href="/register" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg inline-flex items-center"
              >
                Register Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of your landing page */}
    </main>
  );
}
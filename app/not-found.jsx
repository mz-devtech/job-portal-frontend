"use client"

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
   
   <>
   <Navbar/>
    <div className="min-h-screen bg-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Opps! Page not found
          </h1>

          <p className="text-gray-500 max-w-md mb-8">
            Something went wrong. It's look like the link is broken or
            the page is removed.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              Home →
            </Link>

            <button
              onClick={() => window.history.back()}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-50 transition"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">
          <Image
            src="/assets/not-found.png"
            alt="404 Robot Illustration"
            width={500}
            height={500}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
   </>
  );
}

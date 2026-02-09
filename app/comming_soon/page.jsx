import Link from "next/link";
import {
  Briefcase,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Cpu,
  Wrench,
  Sparkles,
} from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Header */}
      <header className="px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
        >
          <Briefcase className="text-blue-600" size={22} />
          Jobpilot
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-24 gap-20">
        {/* Left */}
        <div className="max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our website is under <br /> construction
          </h1>

          <p className="text-gray-500 mb-8 leading-relaxed">
            In ac turpis mi. Donec quis semper neque. Nulla cursus gravida
            interdum. Curabitur luctus sapien.
          </p>

          {/* Subscribe */}
          <div className="flex max-w-md">
            <div className="flex items-center gap-2 border border-gray-300 rounded-l-md px-4 w-full">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="py-3 outline-none w-full text-sm"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 rounded-r-md font-medium">
              Subscribe →
            </button>
          </div>
        </div>

        {/* Right Illustration (Lucide only) */}
        <div className="relative w-[320px] h-[320px] flex items-center justify-center">
          <Cpu size={64} className="absolute top-6 left-8 text-blue-600" />
          <Wrench size={56} className="absolute bottom-10 right-10 text-gray-500" />
          <Sparkles size={40} className="absolute top-10 right-12 text-blue-400" />

          <Cpu size={120} className="text-gray-700" />
        </div>
      </main>

      {/* Footer */}
      <footer className="px-10 py-6 flex flex-col lg:flex-row justify-between items-center text-sm text-gray-400">
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <span>Follow us</span>
          <div className="flex gap-3">
            <Facebook size={18} className="hover:text-blue-600 cursor-pointer" />
            <Twitter size={18} className="hover:text-blue-400 cursor-pointer" />
            <Instagram size={18} className="hover:text-pink-500 cursor-pointer" />
            <Youtube size={18} className="hover:text-red-500 cursor-pointer" />
          </div>
        </div>

        <div>© 2021 Jendo - Job Board. All rights reserved</div>
      </footer>
    </div>
  );
}

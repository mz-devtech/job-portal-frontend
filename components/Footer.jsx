

"use client"
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { 
  BriefcaseBusiness, 
  Home, 
  User, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Phone, 
  Users, 
  Search, 
  Shield, 
  FileCheck,
  MapPin,
  Mail,
  ChevronRight,
  Sparkles
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0b0f19] to-[#0f1525] text-[#9ca3af] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #4b5563 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Logo + Info */}
          <div className="space-y-5 animate-fadeInLeft" style={{ animationDelay: '0ms' }}>
            <Link href="/" className="group inline-flex items-center gap-3 hover:opacity-90 transition-all duration-300">
              <div className="relative">
                <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BriefcaseBusiness className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              </div>
              <span className="text-white text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                JobPortal
              </span>
            </Link>

            <div className="space-y-3">
              <p className="text-sm flex items-center gap-2 group hover:text-white transition-colors duration-300">
                <Phone className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                Call now:{" "}
                <span className="text-white font-medium">(319) 555-0115</span>
              </p>

              <p className="text-sm flex items-start gap-2 group hover:text-white transition-colors duration-300">
                <MapPin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  6391 Elgin St. Celina, Delaware 10299, New York, United States of America
                </span>
              </p>
            </div>

            {/* Floating badge */}
            <div className="relative inline-block">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Trusted by 10k+ companies
              </span>
            </div>
          </div>

          {/* Quick Link */}
          <FooterColumn 
            title="Quick Link" 
            items={[
              { href: "/about_us", icon: User, label: "About Us" },
              { href: "/contact", icon: Phone, label: "Contact" },
              { href: "/blogs", icon: BookOpen, label: "Blogs" },
              { href: "/candidates", icon: Users, label: "Candidates" },
            ]}
            delay={100}
          />

          {/* Candidate */}
          <FooterColumn 
            title="Candidate" 
            items={[
              { href: "/jobs", icon: Search, label: "Find Jobs" },
              { href: "/find-employers", icon: BriefcaseBusiness, label: "Find Employers" },
              { href: "/overview", icon: Home, label: "Candidate Dashboard" },
              { href: "/saved-jobs", icon: FileText, label: "Saved Jobs" },
            ]}
            delay={200}
          />

          {/* Employers */}
          <FooterColumn 
            title="Employers" 
            items={[
              { href: "/post_job", icon: BriefcaseBusiness, label: "Post a Job" },
              { href: "/candidates", icon: Users, label: "Browse Candidates" },
              { href: "/home", icon: Home, label: "Employer Dashboard" },
              { href: "/applications", icon: FileCheck, label: "Applications" },
            ]}
            delay={300}
          />

          {/* Support */}
          <FooterColumn 
            title="Support" 
            items={[
              { href: "/faq", icon: HelpCircle, label: "FAQs" },
              { href: "/terms", icon: Shield, label: "Terms & Conditions" },
              { href: "/comming_soon", icon: BookOpen, label: "Privacy Policy" },
            ]}
            delay={400}
          />

        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-[#1f2937]/50 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute -inset-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              </div>
              <div>
                <h5 className="text-white text-sm font-medium">Subscribe to Newsletter</h5>
                <p className="text-xs text-[#9ca3af]">Get the latest jobs and updates</p>
              </div>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-[#1f2937] border border-[#374151] rounded-l-lg text-sm text-white placeholder-[#9ca3af] focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 border-t border-[#1f2937]" />

      {/* Bottom Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9ca3af] hover:text-white transition-colors duration-300 flex items-center gap-2">
            <span>© {currentYear}</span>
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
            <span>JobPortal - Job Portal.</span>
            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
            <span>All rights reserved.</span>
          </p>

          <div className="flex items-center gap-4">
            <SocialLink href="https://facebook.com" icon={FaFacebookF} label="Facebook" />
            <SocialLink href="https://instagram.com" icon={FaInstagram} label="Instagram" />
            <SocialLink href="https://twitter.com" icon={FaTwitter} label="Twitter" />
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </footer>
  );
};

// Footer Column Component
const FooterColumn = ({ title, items, delay }) => {
  return (
    <div className="animate-fadeInLeft" style={{ animationDelay: `${delay}ms` }}>
      <h4 className="text-white font-medium mb-5 relative inline-block">
        {title}
        <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></span>
      </h4>
      <ul className="space-y-3 text-sm">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className="group flex items-center gap-2 hover:text-white transition-all duration-300 hover:translate-x-1"
              >
                <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
                <span>{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Social Link Component
const SocialLink = ({ href, icon: Icon, label }) => {
  return (
    <Link 
      href={href} 
      target="_blank" 
      className="group relative"
      aria-label={label}
    >
      <div className="relative w-8 h-8 bg-[#1f2937] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-110 hover:rotate-6">
        <Icon className="text-sm text-[#9ca3af] group-hover:text-white transition-colors duration-300" />
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
    </Link>
  );
};

export default Footer;
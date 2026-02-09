import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { BriefcaseBusiness, Home, User, FileText, HelpCircle, BookOpen, Phone, Users, Search, Shield, FileCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] text-[#9ca3af]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Logo + Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <BriefcaseBusiness className="w-8 h-8 text-blue-500" />
              </div>
              <span className="text-white text-xl font-semibold">
                JobPortal
              </span>
            </Link>

            <p className="text-sm">
              Call now:{" "}
              <span className="text-white">(319) 555-0115</span>
            </p>

            <p className="text-sm leading-relaxed max-w-xs">
              6391 Elgin St. Celina, Delaware 10299, New York, United States of America
            </p>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="text-white font-medium mb-5">Quick Link</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about_us" className="flex items-center gap-2 hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="flex items-center gap-2 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                  Candidates
                </Link>
              </li>
            </ul>
          </div>

          {/* Candidate */}
          <div>
            <h4 className="text-white font-medium mb-5">Candidate</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/jobs" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/find-employers" className="flex items-center gap-2 hover:text-white transition-colors">
                  <BriefcaseBusiness className="w-4 h-4" />
                  Find Employers
                </Link>
              </li>
              <li>
                <Link href="/overview" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                  Saved Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-white font-medium mb-5">Employers</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/post_job" className="flex items-center gap-2 hover:text-white transition-colors">
                  <BriefcaseBusiness className="w-4 h-4" />
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                  Browse Candidates
                </Link>
              </li>
              <li>
                <Link href="/home" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/applications" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FileCheck className="w-4 h-4" />
                  Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="flex items-center gap-2 hover:text-white transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Shield className="w-4 h-4" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/comming_soon" className="flex items-center gap-2 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1f2937]" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs">
          © {new Date().getFullYear()} JobPortal - Job Portal. All rights reserved.
        </p>

        <div className="flex items-center gap-5 mt-4 md:mt-0">
          <Link href="https://facebook.com" target="_blank" className="hover:text-white transition-colors">
            <FaFacebookF className="text-sm" />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-white transition-colors">
            <FaInstagram className="text-sm" />
          </Link>
          <Link href="https://twitter.com" target="_blank" className="hover:text-white transition-colors">
            <FaTwitter className="text-sm" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
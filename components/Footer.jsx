import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] text-[#9ca3af]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Logo + Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Jobpilot Logo"
                width={32}
                height={32}
              />
              <span className="text-white text-xl font-semibold">
                Jobpilot
              </span>
            </div>

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
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* Candidate */}
          <div>
            <h4 className="text-white font-medium mb-5">Candidate</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Browse Jobs</li>
              <li className="hover:text-white cursor-pointer">Browse Employers</li>
              <li className="hover:text-white cursor-pointer">Candidate Dashboard</li>
              <li className="hover:text-white cursor-pointer">Saved Jobs</li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-white font-medium mb-5">Employers</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Post a Job</li>
              <li className="hover:text-white cursor-pointer">Browse Candidates</li>
              <li className="hover:text-white cursor-pointer">Employers Dashboard</li>
              <li className="hover:text-white cursor-pointer">Applications</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">FAQs</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#1f2937]" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-xs">
          © 2021 Jobpilot - Job Portal. All rights reserved.
        </p>

        <div className="flex items-center gap-5 mt-4 md:mt-0">
          <FaFacebookF className="text-sm hover:text-white cursor-pointer" />
          <FaInstagram className="text-sm hover:text-white cursor-pointer" />
          <FaTwitter className="text-sm hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;

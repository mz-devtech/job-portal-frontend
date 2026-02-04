"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Globe, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";

const employersData = {
  1: {
    id: 1,
    name: "Twitter",
    logo: "T",
    tagline: "Information Technology (IT)",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    description: `Fusce et erat at nibh maximus fermentum. Mauris ac justo nibh. Praesent nec lorem lorem. Donec ullamcorper lacus mollis tortor pretium malesuada. In quis porta nisl, quis fringilla orci. Donec porttitor, odio a efficitur blandit, orci nisl porta elit, eget vulputate quam nibh ut tellus. Sed ut posuere risus, vitae commodo velit. Nullam in lorem dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla tincidunt ac quam quis vehicula. Quisque sagittis ullamcorper magna. Vivamus elementum eu leo et gravida. Sed dignissim placerat diam, ac laoreet eros rutrum sit amet. Donec imperdiet in leo et imperdiet. In hac habitasse platea dictumst. Sed quis nisi molestie diam ullamcorper condimentum. Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu, quis suscipit mauris turpis in neque. Vestibulum id vestibulum odio. Sed dolor felis, iaculis eget turpis eu, lobortis imperdiet massa.`,
    benefits: [
      "In hac habitasse platea dictumst.",
      "Sed aliquet, arcu eget pretium bibendum, odio enim rutrum arcu.",
      "Vestibulum id vestibulum odio.",
      "Etiam libero ante accumsan id tellus venenatis rhoncus vulputate velit.",
      "Nam condimentum sit amet ipsum id malesuada."
    ],
    vision: `Praesent ultricies mauris at nisl euismod, ut venenatis augue blandit. Etiam massa risus, accumsan nec tempus nec, venenatis in nisl. Maecenas nulla ex, blandit in magna id, pellentesque facilisis sapien. In feugiat auctor mi, eget commodo lectus convallis ac.`,
    website: "www.estherhoward.com",
    phone: "+1-202-555-0141",
    email: "esther.howard@gmail.com",
    founded: "14 June, 2021",
    organizationType: "Private Company",
    teamSize: "120–300 Candidates",
    industryTypes: "Technology",
    openPositions: 3
  },
  2: {
    id: 2,
    name: "Dribbble",
    logo: "D",
    tagline: "Design & Creative Platform",
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    description: "Dribbble is where designers gain inspiration, feedback, community, and jobs.",
    benefits: [
      "Creative work environment",
      "Remote-first culture",
      "Design tools allowance",
      "Conference budgets"
    ],
    vision: "To build the best platform for designers worldwide.",
    website: "www.dribbble.com",
    phone: "+1-123-456-7890",
    email: "hello@dribbble.com",
    founded: "2009",
    organizationType: "Private Company",
    teamSize: "50-200",
    industryTypes: "Design Technology",
    openPositions: 3
  }
};

export default function SingleEmployer() {
  const params = useParams();
  const id = params?.id;
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const foundEmployer = employersData[id] || employersData[1];
        setEmployer(foundEmployer);
        setLoading(false);
      }, 300);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link> /{" "}
          <Link href="/find-employers" className="hover:text-blue-600">Find Employers</Link> /{" "}
          <span className="text-gray-800 font-medium">Single Employers</span>
        </div>
      </div>

      {/* Instagram-like header */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {employer.logo}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{employer.name}</h1>
            <p className="text-gray-600">{employer.tagline}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {employer.description}
              </p>
            </div>

            {/* Company Benefits */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Benefits</h2>
              <div className="text-gray-600 mb-3">
                Donec dignissim nunc eu tellus malesuada fermentum. Sed blandit in magna at accumsan. Etiam imperdiet massa aliquam, consectetur leo in, auctor neque.
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {employer.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Company Vision */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                {employer.vision}
              </p>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Founded in</span>
                  <span className="font-medium">{employer.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Organization Type</span>
                  <span className="font-medium">{employer.organizationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Size</span>
                  <span className="font-medium">{employer.teamSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry Types</span>
                  <span className="font-medium">{employer.industryTypes}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={`https://${employer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {employer.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{employer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <a 
                      href={`mailto:${employer.email}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {employer.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Follow us on:</h3>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Facebook size={18} />
                  <span className="text-sm font-medium">Facebook</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                  <Twitter size={18} />
                  <span className="text-sm font-medium">Twitter</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  <span className="text-sm font-medium">Pinterest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
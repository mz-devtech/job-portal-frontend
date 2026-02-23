"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Robert Fox",
    role: "UI/UX Designer",
    image: "https://i.pravatar.cc/40?img=1",
    text:
      "Ul ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
  },
  {
    name: "Bessie Cooper",
    role: "Creative Director",
    image: "https://i.pravatar.cc/40?img=2",
    text:
      "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut dui vulputate augue condimentum ornare.",
  },
  {
    name: "Jane Cooper",
    role: "Photographer",
    image: "https://i.pravatar.cc/40?img=3",
    text:
      "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  },
];

export default function ClientsTestimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="mx-auto max-w-6xl px-4 relative z-10">
        {/* Title */}
        <div className="relative mb-12 text-center animate-fadeInDown">
          <h2 className="text-2xl font-semibold inline-block relative text-gray-900">
            Clients Testimonial
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></span>
          </h2>
          
          {/* Floating stars */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex gap-1 opacity-20">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prev}
          className="absolute left-6 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white md:block group z-20"
        >
          <ChevronLeft className="w-5 h-5 group-hover:animate-pulse" />
        </button>
        <button 
          onClick={next}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 rounded-full bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white md:block group z-20"
        >
          <ChevronRight className="w-5 h-5 group-hover:animate-pulse" />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideInUp border border-gray-100"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Stars */}
              <div className="relative z-10 mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" 
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="relative z-10 mb-6 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 italic">
                “{item.text}”
              </p>

              {/* Footer */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute bottom-6 right-6 text-5xl text-gray-200 group-hover:text-blue-200 transition-colors duration-300">
                <Quote className="w-8 h-8" />
              </div>

              {/* Decorative corner */}
              <div className="absolute top-3 right-3 w-12 h-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full transform translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 ${
                i === currentIndex 
                  ? 'w-8 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full' 
                  : 'w-2 h-2 bg-blue-200 rounded-full hover:bg-blue-400'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </section>
  );
}
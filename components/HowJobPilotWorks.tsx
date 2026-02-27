"use client"
import {
  UserPlus,
  UploadCloud,
  Search,
  BadgeCheck,
} from "lucide-react";

/* ================================
   DESIGN TOKENS (FIGMA MATCH)
================================ */
const TOKENS = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  textPrimary: "#111827",
  textMuted: "#9CA3AF",
  blue: "#2563EB",
  blueSoft: "#BFDBFE",
  iconBg: "#EFF6FF",
  shadow: "0px 10px 30px rgba(17,24,39,0.08)",
};

/* ================================
   CMS-DRIVEN DATA (INLINE)
================================ */
const STEPS = [
  {
    id: 1,
    title: "Create account",
    description:
      "Aliquam facilisis egestas sapien, nec tempor tortor tristique at.",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Upload CV/Resume",
    description:
      "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.",
    icon: UploadCloud,
  },
  {
    id: 3,
    title: "Find suitable job",
    description:
      "Phasellus quis eleifend ex. Morbi nec fringilla nibh.",
    icon: Search,
  },
  {
    id: 4,
    title: "Apply job",
    description:
      "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales purus.",
    icon: BadgeCheck,
  },
];

export default function HowJobPilotWorks() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden relative"
      style={{ backgroundColor: TOKENS.bg }}
    >
      {/* Decorative background elements - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob hidden sm:block"></div>
        <div className="absolute -bottom-40 -left-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 hidden sm:block"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Title with animation */}
        <div className="relative mb-12 sm:mb-16 md:mb-20 text-center animate-fadeInDown">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold inline-block relative px-4"
            style={{ color: TOKENS.textPrimary }}
          >
            How jobpilot work
            <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
          </h2>
          
          {/* Floating particles - hidden on mobile */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 -top-10 w-20 h-20">
            <div className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-float animation-delay-1000" style={{ top: '20%', left: '30%' }}></div>
            <div className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-300 rounded-full animate-float animation-delay-2000" style={{ top: '60%', left: '70%' }}></div>
          </div>
        </div>

        {/* Curved dotted arrows with CSS animation - fixed SVG */}
        <svg
          className="absolute left-0 top-[140px] sm:top-[150px] md:top-[155px] hidden lg:block"
          height="140"
          width="100%"
          viewBox="0 0 1200 140"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <polygon points="0 0, 10 5, 0 10" fill={TOKENS.blue} />
            </marker>
          </defs>
          <path
            d="M150 70 C300 0, 450 140, 600 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
            className="animate-dash"
            style={{ 
              strokeDashoffset: '0',
              animation: 'dashMove 30s linear infinite'
            }}
          />
          <path
            d="M600 70 C750 0, 900 140, 1050 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
            className="animate-dash-reverse"
            style={{ 
              strokeDashoffset: '0',
              animation: 'dashMoveReverse 30s linear infinite'
            }}
          />
          
          {/* Arrow heads with CSS animation */}
          <circle 
            cx="600" 
            cy="70" 
            r="4" 
            fill={TOKENS.blue} 
            className="animate-pulse"
            style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <circle 
            cx="1050" 
            cy="70" 
            r="4" 
            fill={TOKENS.blue} 
            className="animate-pulse"
            style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </svg>

        {/* Steps - Responsive Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {STEPS.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} totalSteps={STEPS.length} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(3px); }
          50% { transform: translateY(-8px) translateX(-3px); }
          75% { transform: translateY(-3px) translateX(5px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 1000;
          }
        }
        
        @keyframes dashMoveReverse {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            r: 4;
            opacity: 1;
          }
          50% {
            r: 6;
            opacity: 0.8;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 1s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-dash {
          animation: dashMove 30s linear infinite;
        }
        
        .animate-dash-reverse {
          animation: dashMoveReverse 30s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        @media (min-width: 640px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-8px) translateX(5px); }
            50% { transform: translateY(-12px) translateX(-5px); }
            75% { transform: translateY(-5px) translateX(8px); }
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(25px, -35px) scale(1.1); }
            66% { transform: translate(-18px, 18px) scale(0.9); }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
        
        @media (min-width: 1024px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(8px); }
            50% { transform: translateY(-15px) translateX(-8px); }
            75% { transform: translateY(-8px) translateX(10px); }
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -40px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
        }
      `}</style>
    </section>
  );
}

/* ================================
   STEP CARD - Fully Responsive
================================ */
function StepCard({ step, index, totalSteps }: any) {
  const Icon = step.icon;

  return (
    <div 
      className="group relative flex flex-col items-center text-center animate-slideInUp"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Step number badge */}
      <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white rounded-full shadow-md flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600 border border-blue-200 group-hover:border-blue-400 transition-all duration-300">
            {step.id}
          </div>
          <div className="absolute -inset-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Icon with enhanced animation */}
      <div className="relative mb-4 sm:mb-5 md:mb-6">
        {/* Background pulse effect */}
        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 animate-ping group-hover:animate-none"></div>
        
        {/* Icon container */}
        <div
          className="relative flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl"
          style={{ backgroundColor: TOKENS.iconBg }}
        >
          <div className="text-blue-600 group-hover:text-white transition-all duration-300">
            <div className="rounded-full p-2 sm:p-2.5 md:p-3 transition-all duration-500 group-hover:bg-blue-600 group-hover:scale-110">
              <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
        </div>

        {/* Floating glow effect */}
        <div className="absolute -inset-1 sm:-inset-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-lg sm:blur-xl transition-opacity duration-500"></div>
      </div>

      {/* Card */}
      <div
        className="relative rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0px_20px_40px_rgba(17,24,39,0.12)] group-hover:-translate-y-2 w-full"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        <h3
          className="mb-1 sm:mb-2 text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 group-hover:text-blue-600"
          style={{ color: TOKENS.textPrimary }}
        >
          {step.title}
        </h3>
        <p
          className="text-[10px] sm:text-xs md:text-sm leading-relaxed transition-all duration-300 group-hover:text-gray-600 px-0 sm:px-1"
          style={{ color: TOKENS.textMuted }}
        >
          {step.description}
        </p>

        {/* Decorative corner line - hidden on mobile */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
          <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-0.5 h-3 sm:h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
        </div>
      </div>

      {/* Connection line for mobile/tablet */}
      {index < totalSteps - 1 && (
        <div className="block lg:hidden w-0.5 h-6 sm:h-8 bg-gradient-to-b from-blue-200 to-blue-400 my-2 animate-pulse"></div>
      )}
    </div>
  );
}
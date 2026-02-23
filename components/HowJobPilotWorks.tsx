
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
      className="py-24 overflow-hidden relative"
      style={{ backgroundColor: TOKENS.bg }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Title with animation */}
        <div className="relative mb-20 text-center animate-fadeInDown">
          <h2
            className="text-3xl font-semibold inline-block relative"
            style={{ color: TOKENS.textPrimary }}
          >
            How jobpilot work
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
          </h2>
          
          {/* Floating particles */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-20 h-20">
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-float animation-delay-1000" style={{ top: '20%', left: '30%' }}></div>
            <div className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full animate-float animation-delay-2000" style={{ top: '60%', left: '70%' }}></div>
          </div>
        </div>

        {/* Curved dotted arrows with animation */}
        <svg
          className="absolute left-0 top-[155px] hidden w-full md:block animate-draw"
          height="140"
          viewBox="0 0 1200 140"
        >
          <path
            d="M150 70 C300 0, 450 140, 600 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            className="animate-dash"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;1000"
              dur="30s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M600 70 C750 0, 900 140, 1050 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            className="animate-dash"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="1000;0"
              dur="30s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Arrow heads */}
          <circle cx="600" cy="70" r="4" fill={TOKENS.blue} className="animate-pulse">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="1050" cy="70" r="4" fill={TOKENS.blue} className="animate-pulse">
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* Steps */}
        <div className="relative z-10 grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-15px) translateX(-5px); }
          75% { transform: translateY(-5px) translateX(10px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
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
        
        @keyframes draw {
          from {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
        
        .animate-draw {
          animation: draw 2s ease-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </section>
  );
}

/* ================================
   STEP CARD
================================ */
function StepCard({ step, index }: any) {
  const Icon = step.icon;

  return (
    <div 
      className="group relative flex flex-col items-center text-center animate-slideInUp"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      {/* Step number badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative">
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-sm font-semibold text-blue-600 border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-300">
            {step.id}
          </div>
          <div className="absolute -inset-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Icon with enhanced animation */}
      <div className="relative mb-6">
        {/* Background pulse effect */}
        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 animate-ping group-hover:animate-none"></div>
        
        {/* Icon container */}
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl"
          style={{ backgroundColor: TOKENS.iconBg }}
        >
          <div className="text-blue-600 group-hover:text-white transition-all duration-300">
            <div className="rounded-full p-3 transition-all duration-500 group-hover:bg-blue-600 group-hover:scale-110">
              <Icon size={22} className="transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
        </div>

        {/* Floating glow effect */}
        <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
      </div>

      {/* Card */}
      <div
        className="relative rounded-xl px-6 py-6 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0px_20px_40px_rgba(17,24,39,0.12)] group-hover:-translate-y-2 w-full"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>

        <h3
          className="mb-2 text-base font-semibold transition-all duration-300 group-hover:text-blue-600"
          style={{ color: TOKENS.textPrimary }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm transition-all duration-300 group-hover:text-gray-600"
          style={{ color: TOKENS.textMuted }}
        >
          {step.description}
        </p>

        {/* Decorative corner line */}
        <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
        </div>
      </div>

      {/* Connection line for mobile (hidden on desktop) */}
      {index < STEPS.length - 1 && (
        <div className="block md:hidden w-0.5 h-8 bg-gradient-to-b from-blue-200 to-blue-400 my-2 animate-pulse"></div>
      )}
    </div>
  );
}
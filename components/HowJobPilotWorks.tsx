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
      className="py-24"
      style={{ backgroundColor: TOKENS.bg }}
    >
      <div className="relative mx-auto max-w-6xl px-4">
        {/* Title */}
        <h2
          className="mb-20 text-center text-3xl font-semibold"
          style={{ color: TOKENS.textPrimary }}
        >
          How jobpilot work
        </h2>

        {/* Curved dotted arrows */}
        <svg
          className="absolute left-0 top-[155px] hidden w-full md:block"
          height="140"
          viewBox="0 0 1200 140"
        >
          <path
            d="M150 70 C300 0, 450 140, 600 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />
          <path
            d="M600 70 C750 0, 900 140, 1050 70"
            stroke={TOKENS.blueSoft}
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />
        </svg>

        {/* Steps */}
        <div className="relative z-10 grid grid-cols-1 gap-20 md:grid-cols-4">
          {STEPS.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================
   STEP CARD
================================ */
function StepCard({ step }: any) {
  const Icon = step.icon;

  return (
    <div className="group flex flex-col items-center text-center">
      {/* Icon */}
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300"
        style={{ backgroundColor: TOKENS.iconBg }}
      >
        <div className="text-[#2563EB] group-hover:text-white">
          <div className="group-hover:bg-[#2563EB] rounded-full p-3 transition-all duration-300">
            <Icon size={22} />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-xl px-6 py-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-[0px_10px_30px_rgba(17,24,39,0.08)]"
      >
        <h3
          className="mb-2 text-base font-semibold"
          style={{ color: TOKENS.textPrimary }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm"
          style={{ color: TOKENS.textMuted }}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

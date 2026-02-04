import Image from "next/image";

const jobs = [
  { title: "Technical Support Specialist", type: "PART-TIME" },
  { title: "Senior UX Designer", type: "FULL-TIME" },
  { title: "Marketing Officer", type: "INTERNSHIP" },
  { title: "Junior Graphic Designer", type: "INTERNSHIP" },
  { title: "Interaction Designer", type: "PART-TIME" },
  { title: "Project Manager", type: "FULL-TIME" },
  { title: "Software Engineer", type: "FULL-TIME" },
  { title: "Visual Designer", type: "FULL-TIME" },
  { title: "Project Manager", type: "FULL-TIME" },
  { title: "Front End Developer", type: "PART-TIME" },
  { title: "Senior UX Designer", type: "FULL-TIME" },
  { title: "Marketing Manager", type: "INTERNSHIP" },
];

const typeColor = {
  "PART-TIME": "bg-green-100 text-green-700",
  "FULL-TIME": "bg-blue-100 text-blue-700",
  "INTERNSHIP": "bg-yellow-100 text-yellow-700",
};

export default function FeaturedJobs() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Featured job
        </h2>
        <span className="text-sm text-blue-600 cursor-pointer">
          View All →
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="
              group relative rounded-xl border border-gray-200
              bg-white p-5 transition-all duration-300
              hover:bg-gradient-to-br
              hover:from-[#FFF7E6]
              hover:to-[#FFFDF8]
              hover:border-[#F5D58A]
            "
          >
            {/* Bookmark */}
            <div className="absolute top-5 right-5 text-gray-400 group-hover:text-gray-600">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>

            {/* Job type + salary */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor[job.type]}`}
              >
                {job.type}
              </span>
              <span>Salary: $20,000 - $25,000</span>
            </div>

            {/* Company */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                <Image
                  src="/google.png"
                  alt="Google"
                  width={22}
                  height={22}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Google Inc.
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                  Dhaka, Bangladesh
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

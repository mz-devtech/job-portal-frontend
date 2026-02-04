"use client";

const companies = Array.from({ length: 6 }, () => ({
  name: "Dribbble",
  location: "Dhaka, Bangladesh",
  positions: 3,
  featured: true,
}));

export default function TopCompanies() {
  return (
    <section className="w-full bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">
          Top companies
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500 text-white">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15 15 0 0 1 0 20" />
                  </svg>
                </div>

                {/* Company Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {company.name}
                    </h3>

                    {company.featured && (
                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    📍 {company.location}
                  </p>
                </div>
              </div>

              {/* Button */}
              <button className="mt-6 w-full rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                Open Position ({company.positions})
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

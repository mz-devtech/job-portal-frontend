import { X } from "lucide-react";

export default function FilterSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white z-50 shadow-lg transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 overflow-y-auto h-[calc(100%-64px)]">

          {/* Active Filters */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Search: UI/UX",
                "Prague, Czech",
                "Design",
                "Fulltime",
                "$70,000 - $120,000",
              ].map((item) => (
                <span
                  key={item}
                  className="text-xs bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {item}
                  <X className="w-3 h-3 cursor-pointer" />
                </span>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <p className="text-sm font-semibold mb-3">Industry</p>
            <ul className="space-y-2 text-sm">
              {[
                "All Category",
                "Developments",
                "Business",
                "Finance & Accounting",
                "IT & Software",
                "Office Productivity",
                "Personal Development",
                "Design",
                "Marketing",
                "Photography & Video",
              ].map((item, index) => (
                <li
                  key={item}
                  className={`px-3 py-2 rounded cursor-pointer ${
                    index === 2
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Job Type */}
          <div>
            <p className="text-sm font-semibold mb-3">Job Type</p>
            <div className="space-y-2 text-sm">
              {["Full Time", "Part-Time", "Internship", "Temporary", "Contract Base"].map(
                (item, index) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      defaultChecked={index === 0}
                      className="accent-blue-600"
                    />
                    {item}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Salary */}
          <div>
            <p className="text-sm font-semibold mb-2">Salary (yearly)</p>

            <div className="text-xs text-gray-500 flex justify-between mb-2">
              <span>Min: $70,000</span>
              <span>Max: $120,000</span>
            </div>

            <input
              type="range"
              min="70000"
              max="120000"
              className="w-full accent-blue-600 mb-3"
            />

            <div className="space-y-2 text-sm">
              {[
                "$10 - $100",
                "$100 - $1,000",
                "$1,000 - $10,000",
                "$10,000 - $100,000",
                "$100,000 Up",
                "Custom",
              ].map((item, index) => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="salary"
                    defaultChecked={index === 5}
                    className="accent-blue-600"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Remote Job */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Remote Job</span>
            <input type="checkbox" className="accent-blue-600" />
          </div>

          {/* Apply Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Apply Filter
          </button>
        </div>
      </div>
    </>
  );
}

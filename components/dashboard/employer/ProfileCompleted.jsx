export default function ProfileCompleted() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-10 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7V6a2 2 0 00-2-2H10a2 2 0 00-2 2v1M4 7h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
              />
            </svg>
          </div>
          <span className="font-semibold text-gray-800 text-lg">
            Jobpilot
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Setup Progress</span>
          <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600"></div>
          </div>
          <span className="text-blue-600 font-medium">
            100% Completed
          </span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-lg">
          {/* Check Icon */}
          <div className="mx-auto w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center mb-8">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🎉 Congratulations, You profile is 100% complete!
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Donec hendrerit, ante mattis pellentesque eleifend, tortor
            urna malesuada ante, eget aliquam nulla augue hendrerit
            ligula. Nunc mauris arcu, mattis sed sem vitae.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-2.5 text-sm rounded-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition">
              View Dashboard
            </button>

            <button className="px-6 py-2.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2">
              Post Job
              <span className="text-base">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

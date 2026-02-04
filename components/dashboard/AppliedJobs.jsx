"use client";

import Image from "next/image";

const jobs = [
  {
    id: 1,
    title: "Networking Engineer",
    company: "Upwork",
    location: "Washington",
    salary: "$50k-80k/month",
    type: "Remote",
    date: "Feb 2, 2019 19:28",
    active: true,
    logoBg: "bg-green-500",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Dribbble",
    location: "Dhaka",
    salary: "$50k-80k/month",
    type: "Full Time",
    date: "Dec 7, 2019 23:26",
    active: true,
    logoBg: "bg-pink-500",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    company: "Apple",
    location: "Brazil",
    salary: "$50k-80k/month",
    type: "Temporary",
    date: "Feb 2, 2019 19:28",
    active: true,
    logoBg: "bg-black",
  },
  {
    id: 4,
    title: "Visual Designer",
    company: "Microsoft",
    location: "Wisconsin",
    salary: "$50k-80k/month",
    type: "Contract Base",
    date: "Dec 7, 2019 23:26",
    active: true,
    highlighted: true,
    logoBg: "bg-blue-500",
  },
];

export default function AppliedJobs() {
  return (
    <main
      className="
        mt-28 w-full min-h-screen bg-gray-50
        px-4 py-4 sm:px-6 sm:py-6
        md:ml-[260px] md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)] md:overflow-y-auto
      "
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-900">
        Applied Jobs <span className="text-gray-400">(589)</span>
      </h2>

      {/* Table */}
      <div className="mt-6 rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Jobs</th>
                <th className="px-6 py-3 text-left">Date Applied</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className={`border-t ${
                    job.highlighted
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Job Info */}
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded ${job.logoBg} text-white font-bold`}
                      >
                        {job.company[0]}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {job.title}
                          <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                            {job.type}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {job.location} • {job.salary}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500">
                    {job.date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Active
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button className="rounded bg-blue-600 px-4 py-1.5 text-xs text-white hover:bg-blue-700">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 border-t py-4 text-sm">
          <button className="h-8 w-8 rounded-full border text-gray-400">
            ‹
          </button>
          <button className="h-8 w-8 rounded-full bg-blue-600 text-white">
            1
          </button>
          <button className="h-8 w-8 rounded-full border">2</button>
          <button className="h-8 w-8 rounded-full border">3</button>
          <button className="h-8 w-8 rounded-full border">4</button>
          <button className="h-8 w-8 rounded-full border text-gray-400">
            ›
          </button>
        </div>
      </div>
    </main>
  );
}

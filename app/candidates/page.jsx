"use client";

import { useState } from "react";
import  Navbar  from '@/components/Navbar';
import Footer from "@/components/Footer";
import SecondNavbar from "@/components/SecondNavbar";
import DynamicNavbar from "@/components/DynamicNavbar";

export default function Page() {
  const profiles = [
    { name: "Cody Fisher", role: "Marketing Officer" },
    { name: "Darrell Steward", role: "Interaction Designer" },
    { name: "Guy Hawkins", role: "Junior Graphic Designer" },
    { name: "Jane Cooper", role: "Senior UX Designer" },
    { name: "Theresa Webb", role: "Front End Developer" },
    { name: "Kathryn Murphy", role: "Technical Support Specialist" },
    { name: "Marvin McKinney", role: "UI/UX Designer" },
    { name: "Jenny Wilson", role: "Marketing Manager" },
    { name: "Leslie Alexander", role: "Project Manager" }
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
  <DynamicNavbar/>
  <SecondNavbar/>

    <main className="bg-gray-50 min-h-screen">
        {/* Search Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Job title, Keyword..."
              className="flex-1 border rounded-md px-4 py-2 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              className="w-64 border rounded-md px-4 py-2 focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Find Job
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
          {/* Filters */}
          <aside className="col-span-3">
            <div className="bg-white p-4 rounded-lg border space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>Location Radius</span>
                  <span className="text-blue-600">32 miles</span>
                </div>
                <input type="range" className="w-full" />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Gender</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" />
                    All
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" defaultChecked />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" />
                    Female
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="gender" />
                    Others
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Profiles */}
          <section className="col-span-9 space-y-4">
            {profiles.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelected(item);
                  setOpen(true);
                }}
                className="
                  cursor-pointer group flex items-center justify-between p-4 rounded-lg bg-white
                  border border-gray-200
                  hover:border-blue-600 hover:ring-1 hover:ring-blue-600
                  transition
                "
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                    <p className="text-xs text-gray-400">
                      New York · 3 Years experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 group-hover:text-blue-600"
                  >
                    🔖
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(item);
                      setOpen(true);
                    }}
                    className="
                      px-4 py-2 rounded-md text-sm border border-blue-600 text-blue-600
                      group-hover:bg-blue-600 group-hover:text-white
                      transition
                    "
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

  <Footer/>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-white w-[1100px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg flex">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* Left */}
            <div className="w-2/3 p-8 border-r">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200" />
                <div>
                  <h2 className="text-xl font-semibold">
                    {selected?.name}
                  </h2>
                  <p className="text-gray-500">{selected?.role}</p>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Biography</h3>
              <p className="text-sm text-gray-600 mb-6">
                Experienced professional with strong skills in design,
                collaboration, and problem-solving. Passionate about building
                impactful digital products.
              </p>

              <h3 className="font-semibold mb-2">Cover Letter</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dear Sir,<br /><br />
                I am excited to apply for this role. I bring hands-on experience
                working with teams to deliver high-quality solutions.
                <br /><br />
                Sincerely,<br />
                {selected?.name}
              </p>
            </div>

            {/* Right */}
            <div className="w-1/3 p-6 space-y-6">
              <div className="flex gap-2">
                <button className="flex-1 border rounded-md py-2 text-sm">
                  Save
                </button>
                <button className="flex-1 bg-blue-600 text-white rounded-md py-2 text-sm">
                  Send Mail
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Date of Birth" value="14 June, 2021" />
                <Info label="Nationality" value="Bangladesh" />
                <Info label="Marital Status" value="Single" />
                <Info label="Gender" value="Male" />
                <Info label="Experience" value="7 Years" />
                <Info label="Education" value="Master Degree" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm text-gray-600">
                  📍 New York, USA<br />
                  📞 +1 234 567 890<br />
                  ✉️ example@email.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Small helper inside same file */
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

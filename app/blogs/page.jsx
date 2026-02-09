"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";

export default function BlogsPage() {
  return (
 <>
 <Navbar/>
 <SecondNavbar/>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between text-sm text-gray-500">
          <h1 className="font-medium text-gray-700">Blog</h1>
          <span>Home / Blog</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Search */}
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Search</h3>
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Category</h3>
            <ul className="space-y-3 text-sm">
              {[
                "Graphics & Design",
                "Code & Programming",
                "Digital Marketing",
                "Video & Animation",
                "Music & Audio",
                "Finance & Accounting",
                "Health & Care",
                "Data Science",
              ].map((cat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={cat === "Code & Programming"}
                  />
                  <span
                    className={
                      cat === "Code & Programming"
                        ? "text-blue-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Post */}
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Recent Post</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <img
                    src="/blog/thumb.jpg"
                    className="w-16 h-14 rounded object-cover"
                    alt=""
                  />
                  <div className="text-sm">
                    <p className="text-gray-800 leading-snug">
                      Integer volutpat fringilla ipsum.
                    </p>
                    <span className="text-xs text-gray-400">
                      Nov 12, 2021 · 25 Comments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tag */}
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Popular Tag</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {["Design", "Programming", "Health & Care", "Photography"].map(
                (tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded border ${
                      tag === "Programming"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </aside>

        {/* Blog List */}
        <section className="lg:col-span-3 space-y-8">
          {[1, 2, 3, 4, 5].map((id) => (
            <Link
              key={id}
              href={`/blogs/${id}`}
              className="block border rounded-lg p-5 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src="/blog/post.jpg"
                  className="w-full md:w-64 h-48 rounded object-cover"
                  alt=""
                />

                <div>
                  <div className="text-xs text-gray-400 mb-2 flex gap-4">
                    <span>📅 Nov 12, 2021</span>
                    <span>💬 25 Comments</span>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Integer volutpat fringilla ipsum, nec tempor risus
                    facilisis eget.
                  </h2>

                  <p className="text-sm text-gray-600">
                    Integer imperdiet mauris eget nisl ultrices, quis hendrerit
                    est consequat.
                  </p>

                  <span className="inline-block mt-3 text-sm font-medium text-blue-600">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
    <Footer/>
 
 </>
  );
}

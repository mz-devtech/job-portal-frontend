"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Link from "next/link";

export default function BlogDetailPage({ params }) {
  return (
   <>
   <Navbar/>
   <SecondNavbar/>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between text-sm text-gray-500">
          <h1 className="font-medium text-gray-700">Blog Single</h1>
          <span>
            <Link href="/blogs" className="hover:underline">
              Home / Blog
            </Link>{" "}
            / {params.id}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Main Content */}
        <article className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            20 cool fonts for web and graphic design
          </h1>

          <div className="flex gap-4 text-sm text-gray-500 mb-6">
            <span>Kevin Gilbert</span>
            <span>📅 Nov 12, 2021</span>
            <span>💬 25 Comments</span>
          </div>

          <img
            src="/blog/single.jpg"
            alt=""
            className="w-full h-[420px] object-cover rounded-lg mb-8"
          />

          <div className="prose max-w-none">
            <p>
              Check out these 20 cool fonts for your next web or graphic design
              project. Typography plays a critical role in visual identity.
            </p>

            <p>
              Fonts influence perception, reinforce brand identity, and guide
              user attention throughout the layout.
            </p>

            <blockquote className="border-l-4 border-blue-600 bg-blue-50 p-5 rounded">
              Vintage meets vogue is the only way to describe this serif
              typeface.
            </blockquote>

            <h3>EB Garamond and Relative</h3>

            <p>
              EB Garamond is elegant, readable, and perfect for long-form
              editorial content.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <img src="/blog/detail1.jpg" className="rounded-lg" alt="" />
              <img src="/blog/detail2.jpg" className="rounded-lg" alt="" />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Search</h3>
            <input
              className="w-full border rounded-md px-4 py-2 text-sm"
              placeholder="Search"
            />
          </div>

          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-4">Recent Post</h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 mb-4">
                <img
                  src="/blog/thumb.jpg"
                  className="w-14 h-12 rounded object-cover"
                  alt=""
                />
                <p className="text-sm text-gray-700">
                  Integer volutpat fringilla ipsum.
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
    <Footer/>
   
   </>
  );
}

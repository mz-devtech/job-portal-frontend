"use client";

import Link from "next/link";

export default function BecomeSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Become a Candidate */}
          <div className="relative overflow-hidden rounded-xl bg-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Become a Candidate
            </h3>

            <p className="mt-3 max-w-sm text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Cras cursus a dolor convallis efficitur.
            </p>

            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow transition hover:bg-blue-50"
            >
              Register Now
              <span>→</span>
            </Link>

            {/* Image */}
            <img
              src="/assets/candidate.png"
              alt="Laptop"
              className="absolute right-4 top-4 hidden w-40 rounded-lg md:block"
            />
          </div>

          {/* Become an Employers */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
            <h3 className="text-xl font-semibold">
              Become a Employers
            </h3>

            <p className="mt-3 max-w-sm text-sm text-blue-100">
              Cras in massa pellentesque, mollis ligula non,
              luctus dui. Morbi sed efficitur dolor.
            </p>

            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Register Now
              <span>→</span>
            </Link>

            {/* Image */}
            <img
              src="/assets/employer.png"
              alt="Employer"
              className="absolute bottom-0 right-0 hidden h-48 md:block"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
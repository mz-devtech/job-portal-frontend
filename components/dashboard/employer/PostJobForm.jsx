"use client";
import { useState } from "react";

/* ---------- Reusable ---------- */

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Radio({ label }) {
  return (
    <label className="flex items-center gap-2 rounded-md border bg-white p-3 text-sm">
      <input type="radio" name="apply" />
      {label}
    </label>
  );
}

/* ---------- Success Modal ---------- */

function JobSuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-gray-900">
          🎉 Congratulations, Your Job is successfully posted!
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You can manage your form my-jobs section in your dashboard
        </p>

        <button className="mt-3 rounded-md border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
          View Jobs →
        </button>

        <p className="mt-6 mb-3 text-sm font-medium text-gray-900">
          Promote Job: UI/UX Designer
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="cursor-pointer rounded-lg border-2 border-blue-600 p-4">
            <div className="flex gap-3">
              <input type="radio" name="promote" defaultChecked />
              <div>
                <p className="text-sm font-semibold">Featured Your Job</p>
                <p className="text-xs text-gray-500">
                  Sed neque diam, lacinia nec dolor et, euismod bibendum turpis.
                </p>
              </div>
            </div>
          </label>

          <label className="cursor-pointer rounded-lg border p-4 hover:border-orange-400">
            <div className="flex gap-3">
              <input type="radio" name="promote" />
              <div>
                <p className="text-sm font-semibold">Highlight Your Job</p>
                <p className="text-xs text-gray-500">
                  Sed neque diam, lacinia nec dolor et, euismod bibendum turpis.
                </p>
              </div>
            </div>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-gray-500">
            Skip Now
          </button>
          <button className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            Promote Job →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function PostJobForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // simulate successful API response
    setShowSuccess(true);
  };

  return (
    <>
      <main
        className="
          w-full min-h-screen bg-gray-50
          px-4 py-6
          sm:px-6
          md:ml-[260px]
          md:w-[calc(100%-260px)]
          md:overflow-y-auto
        "
      >
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl rounded-lg bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Post a Job
          </h2>

          <Field label="Job Title">
            <input className="input" placeholder="Add job title, role, vacancies etc" />
          </Field>

          <Field label="Tags">
            <input className="input" placeholder="Job keyword, tags etc..." />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Job Role">
              <select className="input"><option>Select...</option></select>
            </Field>
            <Field label="Min Salary">
              <input className="input" placeholder="Minimum salary..." />
            </Field>
            <Field label="Max Salary">
              <input className="input" placeholder="Maximum salary..." />
            </Field>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Field label="Education">
              <select className="input"><option>Select...</option></select>
            </Field>
            <Field label="Experience">
              <select className="input"><option>Select...</option></select>
            </Field>
            <Field label="Job Type">
              <select className="input"><option>Select...</option></select>
            </Field>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Vacancies">
              <select className="input"><option>Select...</option></select>
            </Field>
            <Field label="Expiration Date">
              <input type="date" className="input" />
            </Field>
            <Field label="Job Level">
              <select className="input"><option>Select...</option></select>
            </Field>
          </div>

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">Location</p>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="input"><option>Country</option></select>
              <select className="input"><option>City</option></select>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" />
              Fully Remote Position – Worldwide
            </label>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Job Benefits
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "401k Salary","Flexible Time","Vision Insurance","Dental Insurance",
                "Medical Insurance","Unlimited Vacation","Stock Share","Paid Maternity",
                "Company Retreats","Learning Budget","Free Gym Membership","Work from Home",
              ].map((item) => (
                <span
                  key={item}
                  className="cursor-pointer rounded-md border px-3 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <textarea rows={6} className="input" placeholder="Add your job description..." />
          </div>

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Apply Job on:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Radio label="On Jobpilot" />
              <Radio label="External Platform" />
              <Radio label="On Your Email" />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Post Job →
          </button>
        </form>
      </main>

      {showSuccess && (
        <JobSuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
}

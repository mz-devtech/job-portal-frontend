"use client";

import { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

export default function AddResumeModal({ open, onClose, onAdd }) {
  const [resumeName, setResumeName] = useState("");
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!resumeName || !file) return;

    onAdd({
      title: resumeName,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      file,
    });

    setResumeName("");
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Add CV/Resume
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CV/Resume Name
            </label>
            <input
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Professional Resume"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Upload your CV/Resume
            </label>

            <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center">
              <FiUpload className="mb-2 text-gray-400" size={22} />
              <p className="text-sm text-gray-600">
                Browse file or drop here
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Only PDF format available. Max file size 12 MB.
              </p>

              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </label>

            {file && (
              <p className="mt-2 text-xs text-gray-500">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Add CV/Resume
          </button>
        </div>
      </div>
    </div>
  );
}

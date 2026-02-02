'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token; // 👈 URL token

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: formData.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Something went wrong');
        return;
      }

      alert('Password reset successful');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Server error');
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 text-sm">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Reset Password
        </button>
      </form>
    </>
  );
}

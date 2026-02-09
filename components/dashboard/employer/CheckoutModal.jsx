"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutModal({ open, onClose, plan }) {
  const router = useRouter();

  if (!open) return null;

  const handlePaymentSuccess = () => {
    // 1. Close modal
    onClose();

    // 2. Redirect to Post Job form page
    router.push("/post_job/create");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Checkout
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Payment */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Payment System
            </p>

            {/* Tabs */}
            <div className="mb-4 flex gap-4 text-sm">
              <button className="border-b-2 border-blue-600 pb-1 text-blue-600">
                Debit/Credit Card
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                Paypal
              </button>
            </div>

            {/* Saved Card */}
            <label className="mb-3 flex cursor-pointer items-center gap-3 rounded-md border p-3">
              <input type="radio" name="card" defaultChecked />
              <div className="flex-1 text-sm">
                <p className="font-medium text-gray-700">
                  5847 **** **** ****
                </p>
                <p className="text-xs text-gray-500">
                  Name on Card: Esther Howard
                </p>
              </div>
            </label>

            {/* New Card */}
            <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-md border p-3">
              <input type="radio" name="card" />
              <p className="text-sm text-gray-700">
                New payment card
              </p>
            </label>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Credit Card
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-20 rounded-md border px-2 py-2 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-16 rounded-md border px-2 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-md border bg-gray-50 p-5">
            <p className="mb-4 text-sm font-medium text-gray-700">
              Summary
            </p>

            <div className="mb-3 flex justify-between text-sm">
              <span className="text-gray-500">
                Pricing Plans: {plan?.name}
              </span>
              <span className="font-medium">
                ${plan?.price}.00
              </span>
            </div>

            <div className="mb-4 flex justify-between border-t pt-3 text-sm font-semibold">
              <span>Total</span>
              <span>${plan?.price} USD</span>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePaymentSuccess}
              className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Pay & Continue →
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              This package will expire after one month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

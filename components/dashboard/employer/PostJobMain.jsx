"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

export default function PostJobMain() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
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
        {/* Header */}
        <div className="mb-10 max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-900">
            Buy Premium Subscription to Post a Job
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Choose the best plan that fits your hiring needs and start posting jobs today.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* BASIC */}
          <PlanCard
            title="Basic"
            price={19}
            onChoose={handleChoosePlan}
            features={[
              "Post 1 Job",
              "Urgents & Featured Jobs",
              "Highlights Job with Colors",
              "Access & Saved 5 Candidates",
              "10 Days Resume Visibility",
              "24/7 Critical Support",
            ]}
          />

          {/* STANDARD */}
          <PlanCard
            title="Standard"
            price={39}
            recommended
            onChoose={handleChoosePlan}
            features={[
              "3 Active Jobs",
              "Urgents & Featured Jobs",
              "Highlights Job with Colors",
              "Access & Saved 10 Candidates",
              "20 Days Resume Visibility",
              "24/7 Critical Support",
            ]}
          />

          {/* PREMIUM */}
          <PlanCard
            title="Premium"
            price={59}
            onChoose={handleChoosePlan}
            features={[
              "6 Active Jobs",
              "Urgents & Featured Jobs",
              "Highlights Job with Colors",
              "Access & Saved 20 Candidates",
              "30 Days Resume Visibility",
              "24/7 Critical Support",
            ]}
          />
        </div>
      </main>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={selectedPlan}
      />
    </>
  );
}

/* ---------------- Plan Card ---------------- */

function PlanCard({ title, price, features, recommended, onChoose }) {
  return (
    <div
      className={`
        relative rounded-xl border bg-white p-6 shadow-sm
        ${recommended ? "border-blue-600 shadow-md" : "border-gray-200"}
      `}
    >
      {/* Recommended Badge */}
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
          Recommendation
        </span>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      {/* Price */}
      <div className="mt-4 flex items-end gap-1">
        <span className="text-3xl font-bold text-blue-600">
          ${price}
        </span>
        <span className="text-sm text-gray-500">
          /Monthly
        </span>
      </div>

      {/* Features */}
      <ul className="mt-6 space-y-3 text-sm text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-blue-600" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={() => onChoose({ name: title, price })}
        className={`
          mt-8 w-full rounded-md py-2.5 text-sm font-medium transition
          ${
            recommended
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border border-blue-600 text-blue-600 hover:bg-blue-50"
          }
        `}
      >
        Choose Plan →
      </button>
    </div>
  );
}

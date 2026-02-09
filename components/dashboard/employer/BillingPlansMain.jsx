"use client";

import {
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function BillingPlansMain() {
  return (
    <main
      className="
        w-full min-h-screen bg-gray-50
        px-4 py-6 sm:px-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:overflow-y-auto
      "
    >
      {/* PAGE GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <CurrentPlan />
          <NextInvoice />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">
          <PlanBenefits />
        </div>
      </div>

      {/* PAYMENT CARD */}
      <div className="mt-6">
        <PaymentCard />
      </div>

      {/* LATEST INVOICES */}
      <div className="mt-6">
        <LatestInvoices />
      </div>
    </main>
  );
}

/* ===================== CARDS ===================== */

function CurrentPlan() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">Current Plan</p>

      <h3 className="mt-2 text-2xl font-semibold text-gray-900">
        Premium
      </h3>

      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        Vestibulum ante ipsum primis in faucibus orci luctus
        ultrices posuere.
      </p>

      <div className="mt-6 flex gap-3">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Change Plans
        </button>
        <button className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          Cancel Plan
        </button>
      </div>
    </div>
  );
}

function NextInvoice() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">Next Invoices</p>

      <h3 className="mt-2 text-2xl font-semibold text-blue-600">
        $59.00 USD
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Nov 28, 2021
      </p>

      <p className="mt-3 text-xs text-gray-400 leading-relaxed">
        Package started: Jan 28, 2021
        <br />
        You have to pay this amount of money every month.
      </p>

      <button className="mt-6 w-full rounded-md bg-blue-600 py-2 text-sm text-white hover:bg-blue-700">
        Pay Now →
      </button>
    </div>
  );
}

function PlanBenefits() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h4 className="font-semibold text-gray-800">
        Plan Benefits
      </h4>

      <p className="mt-2 text-sm text-gray-500">
        Proin porta enim sit amet placerat finibus.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Benefit ok text="6 Active Jobs" />
        <Benefit ok text="Urgent & Featured Jobs" />
        <Benefit ok text="Highlights Job with Colors" />
        <Benefit ok text="Access & Saved 20 Candidates" />
        <Benefit ok text="60 Days Resume Visibility" />
        <Benefit ok text="24/7 Critical Support" />
      </div>

      <h5 className="mt-6 text-sm font-semibold text-gray-700">
        Remaining
      </h5>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Benefit text="9 Resume Access" />
        <Benefit text="4 Active Jobs" />
        <Benefit text="21 Days resume visibility" />
      </div>
    </div>
  );
}

function PaymentCard() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm max-w-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">
          Payment Card
        </h4>
        <button className="flex items-center gap-1 text-sm text-blue-600">
          <FiEdit /> Edit Card
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="h-10 w-14 rounded bg-gradient-to-r from-red-500 to-yellow-400" />
        <div className="text-sm">
          <p className="text-gray-500">Name on card</p>
          <p className="font-medium text-gray-800">
            Esther Howard
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        6714 **** **** ****
      </div>

      <div className="mt-2 text-sm text-gray-500">
        Expire date: 12/29
      </div>
    </div>
  );
}

function LatestInvoices() {
  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h4 className="font-semibold text-gray-800">
          Latest Invoices
        </h4>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-400">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>
            <th>Date</th>
            <th>Plan</th>
            <th>Amount</th>
            <th className="pr-6 text-right"></th>
          </tr>
        </thead>
        <tbody>
          <InvoiceRow id="#487441" />
          <InvoiceRow id="#653518" />
          <InvoiceRow id="#267400" />
          <InvoiceRow id="#651535" />
          <InvoiceRow id="#449003" />
          <InvoiceRow id="#558612" />
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4">
        <button className="rounded p-2 hover:bg-gray-100">
          <FiChevronLeft />
        </button>
        <button className="h-8 w-8 rounded-full bg-blue-600 text-sm text-white">
          01
        </button>
        <button className="h-8 w-8 rounded text-sm text-gray-600 hover:bg-gray-100">
          02
        </button>
        <button className="h-8 w-8 rounded text-sm text-gray-600 hover:bg-gray-100">
          03
        </button>
        <button className="rounded p-2 hover:bg-gray-100">
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

/* ===================== HELPERS ===================== */

function Benefit({ text, ok }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <FiCheckCircle className="text-green-600" />
      ) : (
        <FiXCircle className="text-red-500" />
      )}
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function InvoiceRow({ id }) {
  return (
    <tr className="border-t">
      <td className="px-6 py-4">{id}</td>
      <td>Dec 7, 2019 23:26</td>
      <td>Premium</td>
      <td>$999 USD</td>
      <td className="pr-6 text-right">
        <button className="rounded-md p-2 hover:bg-gray-100">
          <FiDownload />
        </button>
      </td>
    </tr>
  );
}

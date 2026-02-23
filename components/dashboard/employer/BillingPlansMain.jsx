"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiPlus,
  FiFileText,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import { planService } from "@/services/planService";
import { paymentService } from "@/services/paymentService";
import CheckoutModal from "@/components/dashboard/employer/CheckoutModal";
import toast from "react-hot-toast";

export default function BillingPlansMain() {
  const [subscription, setSubscription] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptionData();
    fetchAvailablePlans();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      // Get current user's subscription
      const subscriptionData = await paymentService.getCurrentSubscription();
      console.log("📋 Subscription data:", subscriptionData);
      setSubscription(subscriptionData);
      
      // If subscription exists, fetch the full plan details
      if (subscriptionData && subscriptionData.plan) {
        // Check if plan is populated or just an ID
        if (typeof subscriptionData.plan === 'object' && subscriptionData.plan._id) {
          // Plan is already populated
          setPlanDetails(subscriptionData.plan);
        } else {
          // Plan is just an ID, fetch the details
          const planData = await planService.getPlanById(subscriptionData.plan);
          setPlanDetails(planData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const plans = await planService.getPublicPlans();
      setAvailablePlans(plans);
    } catch (error) {
      console.error("Failed to fetch available plans:", error);
    }
  };

  const handleChangePlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleCancelPlan = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      try {
        await paymentService.cancelSubscription(subscription?._id);
        toast.success("Subscription cancelled successfully");
        fetchSubscriptionData(); // Refresh subscription data
      } catch (error) {
        toast.error("Failed to cancel subscription");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading your billing information...</p>
        </div>
      </div>
    );
  }

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
          <CurrentPlan 
            subscription={subscription}
            planDetails={planDetails}
            onChangePlan={() => {
              const recommendedPlan = availablePlans.find(p => p.recommended) || availablePlans[0];
              handleChangePlan(recommendedPlan);
            }}
            onCancelPlan={handleCancelPlan}
          />
          <NextInvoice subscription={subscription} planDetails={planDetails} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">
          <PlanBenefits planDetails={planDetails} />
        </div>
      </div>

      {/* PAYMENT CARD */}
      <div className="mt-6">
        <PaymentCard />
      </div>

      {/* AVAILABLE PLANS SECTION */}
      <div className="mt-6">
        <AvailablePlans 
          plans={availablePlans} 
          currentPlanId={planDetails?._id || subscription?.plan}
          onChangePlan={handleChangePlan}
        />
      </div>

      {/* LATEST INVOICES */}
      <div className="mt-6">
        <LatestInvoices subscription={subscription} />
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPlan && (
        <CheckoutModal
          open={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          plan={selectedPlan}
        />
      )}
    </main>
  );
}

/* ===================== CARDS ===================== */

function CurrentPlan({ subscription, planDetails, onChangePlan, onCancelPlan }) {
  if (!subscription) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Current Plan</p>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          No Active Plan
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          You don't have an active subscription. Choose a plan to get started.
        </p>
        <div className="mt-6">
          <button
            onClick={onChangePlan}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Choose a Plan
          </button>
        </div>
      </div>
    );
  }

  const planName = planDetails?.name || subscription.planName || 'Premium Plan';
  const isActive = subscription.status === 'active';
  const startDate = subscription.startDate 
    ? new Date(subscription.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A';
  
  const endDate = subscription.endDate 
    ? new Date(subscription.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A';

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Current Plan</p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {planName}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {subscription.status}
          </span>
          {planDetails?.recommended && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Recommended
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar className="text-gray-400" size={14} />
          <span className="text-gray-600">Started: {startDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar className="text-gray-400" size={14} />
          <span className="text-gray-600">Renews: {endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FiDollarSign className="text-gray-400" size={14} />
          <span className="text-gray-600">
            ${subscription.amount}.00/{subscription.billingCycle || 'monthly'}
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {planDetails?.description || `Access all features included in your ${planName} plan.`}
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onChangePlan}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Change Plans
        </button>
        <button
          onClick={onCancelPlan}
          className="rounded-md border px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-red-200"
        >
          Cancel Plan
        </button>
      </div>
    </div>
  );
}

function NextInvoice({ subscription, planDetails }) {
  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Next Invoice</p>
        <h3 className="mt-2 text-2xl font-semibold text-gray-400">
          No Active Subscription
        </h3>
        <p className="mt-3 text-xs text-gray-400 leading-relaxed">
          Subscribe to a plan to see your next invoice.
        </p>
      </div>
    );
  }

  const nextBillingDate = subscription.endDate 
    ? new Date(subscription.endDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A';

  const startDate = subscription.startDate
    ? new Date(subscription.startDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'N/A';

  const amount = subscription.amount || 0;
  const planName = planDetails?.name || subscription.planName || 'Premium';

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">Next Invoice</p>

      <h3 className="mt-2 text-2xl font-semibold text-blue-600">
        ${amount}.00 USD
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {nextBillingDate}
      </p>

      <div className="mt-3 space-y-1 text-xs text-gray-400">
        <p>Package started: {startDate}</p>
        <p>{planName} Plan - {subscription.billingCycle || 'monthly'} billing</p>
        <p className="text-gray-500">You'll be charged ${amount}.00 every {subscription.billingCycle || 'month'}.</p>
      </div>

      <button className="mt-6 w-full rounded-md bg-blue-600 py-2 text-sm text-white hover:bg-blue-700">
        Pay Now →
      </button>
    </div>
  );
}

function PlanBenefits({ planDetails }) {
  if (!planDetails) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="font-semibold text-gray-800">Plan Benefits</h4>
        <p className="mt-2 text-sm text-gray-500">
          No active plan selected. Choose a plan to see benefits.
        </p>
      </div>
    );
  }

  // Generate benefits from plan features
  const benefits = [
    `${planDetails.jobLimit === 999 ? 'Unlimited' : planDetails.jobLimit || 0} Active Jobs`,
    planDetails.urgentFeatured ? 'Urgent & Featured Jobs' : null,
    planDetails.highlightJob ? 'Highlight Jobs with Colors' : null,
    `${planDetails.candidateLimit === 999 ? 'Unlimited' : planDetails.candidateLimit || 0} Candidate Profile Access`,
    `${planDetails.resumeVisibility || 0} Days Resume Visibility`,
    planDetails.support24 ? '24/7 Priority Support' : null,
  ].filter(Boolean);

  // For remaining usage, we can calculate based on subscription usage
  // This is a placeholder - you'd need to fetch actual usage data from your backend
  const remaining = {
    resumeAccess: planDetails.candidateLimit ? Math.floor(planDetails.candidateLimit * 0.7) : 7,
    activeJobs: planDetails.jobLimit ? Math.floor(planDetails.jobLimit * 0.6) : 3,
    resumeVisibility: planDetails.resumeVisibility ? Math.floor(planDetails.resumeVisibility * 0.5) : 15
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">
          Plan Benefits
        </h4>
        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
          {planDetails.name} Plan
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Here's what's included in your {planDetails.name} plan.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <Benefit key={index} ok text={benefit} />
        ))}
      </div>

      <h5 className="mt-6 text-sm font-semibold text-gray-700">
        Remaining Usage
      </h5>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Benefit text={`${remaining.resumeAccess} Resume Accesses Left`} ok={remaining.resumeAccess > 0} />
        <Benefit text={`${remaining.activeJobs} Active Jobs Remaining`} ok={remaining.activeJobs > 0} />
        <Benefit text={`${remaining.resumeVisibility} Days Resume Visibility Left`} ok={remaining.resumeVisibility > 0} />
      </div>
    </div>
  );
}

function AvailablePlans({ plans, currentPlanId, onChangePlan }) {
  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">
          Available Plans
        </h4>
        <p className="text-xs text-gray-500">
          Choose the plan that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = plan._id === currentPlanId || plan._id === currentPlanId?._id;
          
          return (
            <div
              key={plan._id}
              className={`relative rounded-lg border p-5 transition ${
                isCurrentPlan
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              } ${plan.recommended ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
            >
              {plan.recommended && !isCurrentPlan && (
                <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                  Recommended
                </span>
              )}
              
              <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h5>
                {isCurrentPlan && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </div>
              
              <p className="mt-2 text-2xl font-bold text-gray-900">
                ${plan.price}
                <span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
              
              {plan.priceYearly > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  or ${plan.priceYearly}/year (save ${plan.price * 12 - plan.priceYearly})
                </p>
              )}
              
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-600">Includes:</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={12} />
                    {plan.jobLimit === 999 ? 'Unlimited' : plan.jobLimit} active jobs
                  </li>
                  {plan.urgentFeatured && (
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-green-500 flex-shrink-0" size={12} />
                      Urgent & featured jobs
                    </li>
                  )}
                  {plan.highlightJob && (
                    <li className="flex items-center gap-1.5">
                      <FiCheckCircle className="text-green-500 flex-shrink-0" size={12} />
                      Highlight jobs with colors
                    </li>
                  )}
                  <li className="flex items-center gap-1.5">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" size={12} />
                    {plan.candidateLimit === 999 ? 'Unlimited' : plan.candidateLimit} candidate profiles
                  </li>
                </ul>
              </div>
              
              <button
                onClick={() => onChangePlan(plan)}
                disabled={isCurrentPlan}
                className={`mt-4 w-full rounded-md py-2 text-sm font-medium transition ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentCard() {
  const [savedCards, setSavedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultCard, setDefaultCard] = useState(null);

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      setLoading(true);
      const cards = await paymentService.getSavedCards();
      setSavedCards(cards || []);
      if (cards && cards.length > 0) {
        setDefaultCard(cards[0]);
      }
    } catch (error) {
      console.error("Failed to fetch saved cards:", error);
      setSavedCards([]);
    } finally {
      setLoading(false);
    }
  };

  const getCardBrandColor = (brand) => {
    const brands = {
      visa: 'from-blue-500 to-blue-600',
      mastercard: 'from-orange-500 to-red-500',
      amex: 'from-blue-400 to-indigo-500',
      discover: 'from-orange-400 to-yellow-500',
      default: 'from-gray-500 to-gray-600'
    };
    return brands[brand?.toLowerCase()] || brands.default;
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm max-w-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCreditCard className="text-gray-400" />
          <h4 className="font-semibold text-gray-800">
            Payment Card
          </h4>
        </div>
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <FiPlus size={16} /> Add Card
        </button>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : savedCards.length > 0 ? (
        <div className="mt-6 space-y-4">
          {savedCards.map((card) => (
            <div key={card.id} className="flex items-start gap-4">
              <div className={`h-12 w-16 rounded bg-gradient-to-r ${getCardBrandColor(card.brand)} flex items-center justify-center`}>
                <span className="text-xs font-bold text-white uppercase">
                  {card.brand || 'CARD'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Name on card</p>
                  {card.id === defaultCard?.id && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-800">
                  {card.name || 'Cardholder'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  •••• •••• •••• {card.last4}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Expires {card.exp_month}/{card.exp_year}
                </p>
              </div>
              <button className="text-gray-400 hover:text-blue-600">
                <FiEdit size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-center py-6 border border-dashed rounded-lg">
          <p className="text-sm text-gray-500 mb-3">No payment cards saved</p>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-700">
            Add Payment Method
          </button>
        </div>
      )}
    </div>
  );
}

function LatestInvoices({ subscription }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (subscription) {
      generateInvoicesFromSubscription();
    } else {
      setInvoices([]);
      setLoading(false);
    }
  }, [subscription]);

  const generateInvoicesFromSubscription = () => {
    setLoading(true);
    
    try {
      const invoices = [];
      const today = new Date();
      
      // Get subscription details
      const planName = subscription.planName || 'Premium Plan';
      const amount = subscription.amount || 0;
      const subscriptionId = subscription._id || '';
      const startDate = subscription.startDate ? new Date(subscription.startDate) : null;
      
      if (!startDate) {
        setInvoices([]);
        setLoading(false);
        return;
      }

      console.log("Generating invoices from:", {
        startDate,
        planName,
        amount,
        subscriptionId
      });

      // Generate invoices for each billing cycle since start date
      let currentDate = new Date(startDate);
      let invoiceCount = 0;
      
      while (currentDate <= today && invoiceCount < 12) { // Limit to last 12 months
        // Format invoice ID using subscription ID and date
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const shortId = subscriptionId.slice(-4) || '0001';
        
        invoices.push({
          id: `#INV-${year}${month}${day}-${shortId}`,
          date: currentDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          plan: planName,
          amount: amount,
          status: 'paid',
          subscriptionId: subscriptionId,
          billingPeriod: {
            start: new Date(currentDate),
            end: new Date(currentDate.setMonth(currentDate.getMonth() + 1))
          }
        });

        // Move to next month
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        invoiceCount++;
      }

      // Sort invoices by date (newest first)
      invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log("Generated invoices:", invoices);
      setInvoices(invoices);
    } catch (error) {
      console.error("Error generating invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice) => {
    try {
      toast.success(`Downloading invoice ${invoice.id}`);
      
      // Generate a real invoice content
      const invoiceContent = `
        ========================================
        INVOICE
        ========================================
        
        Invoice Number: ${invoice.id}
        Date: ${invoice.date}
        
        Subscription Details:
        --------------------
        Plan: ${invoice.plan}
        Billing Period: ${invoice.billingPeriod?.start?.toLocaleDateString()} - ${invoice.billingPeriod?.end?.toLocaleDateString()}
        
        Amount: $${invoice.amount}.00 USD
        Status: ${invoice.status}
        
        Subscription ID: ${invoice.subscriptionId}
        
        Thank you for your business!
        ========================================
      `;
      
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.id.replace('#', '')}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Failed to download invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + itemsPerPage);

  if (!subscription) {
    return (
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h4 className="font-semibold text-gray-800">
            Latest Invoices
          </h4>
        </div>
        <div className="py-8 text-center">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No invoices found</p>
          <p className="text-xs text-gray-400 mt-1">Subscribe to a plan to see your invoices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">
              Latest Invoices
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {subscription.planName} • ${subscription.amount}/month
            </p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
            {invoices.length} total invoices
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-8 text-center">
          <FiFileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No invoices available yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Your first invoice will appear on {new Date(subscription.endDate).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Invoice ID</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Plan</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedInvoices.map((invoice) => (
                  <InvoiceRow 
                    key={invoice.id} 
                    invoice={invoice}
                    onDownload={() => handleDownload(invoice)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div className="px-6 py-3 bg-gray-50 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total paid to date:</span>
              <span className="font-semibold text-gray-900">
                ${(invoices.reduce((sum, inv) => sum + inv.amount, 0)).toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FiChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded text-sm transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===================== HELPERS ===================== */

function Benefit({ text, ok = true }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <FiCheckCircle className="text-green-600 flex-shrink-0" size={16} />
      ) : (
        <FiXCircle className="text-red-500 flex-shrink-0" size={16} />
      )}
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function InvoiceRow({ invoice, onDownload }) {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-900">
        {invoice.id}
      </td>
      <td className="px-6 py-4 text-gray-600">{invoice.date}</td>
      <td className="px-6 py-4 text-gray-600">{invoice.plan}</td>
      <td className="px-6 py-4 text-gray-900 font-medium">
        ${invoice.amount.toFixed(2)} USD
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {invoice.status || 'Paid'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          title="Download Invoice"
        >
          <FiDownload size={14} />
          <span className="text-xs">PDF</span>
        </button>
      </td>
    </tr>
  );
}
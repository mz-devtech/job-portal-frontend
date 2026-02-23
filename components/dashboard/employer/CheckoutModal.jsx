"use client";

import { X, CreditCard, Wallet, Shield, Check, Sparkles, Zap, Award, Gift, Star, Clock, Lock, ArrowRight, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { subscriptionService } from "@/services/subscriptionService";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Main Modal Component
export default function CheckoutModal({ open, onClose, plan }) {
  if (!open || !plan) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Complete Your Purchase
                  </h3>
                  <p className="text-xs text-gray-500">
                    {plan.name} Plan • {plan.jobLimit} {plan.jobLimit === 1 ? 'Job' : 'Jobs'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Body with Stripe Elements */}
            <Elements stripe={stripePromise}>
              <CheckoutForm plan={plan} onClose={onClose} />
            </Elements>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Checkout Form with Stripe Elements
function CheckoutForm({ plan, onClose }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [cardholderName, setCardholderName] = useState("");
  const [cardError, setCardError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [saveCardForFuture, setSaveCardForFuture] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Fetch saved cards on mount
  useEffect(() => {
    if (plan) {
      fetchSavedCards();
    }
  }, [plan]);

  // Create payment intent when plan or billing cycle changes
  useEffect(() => {
    if (plan) {
      createPaymentIntent();
    }
  }, [plan, billingCycle]);

  const fetchSavedCards = async () => {
    try {
      const cards = await paymentService.getSavedCards();
      setSavedCards(cards);
      
      if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
        setUseSavedCard(true);
      }
    } catch (error) {
      console.error("Failed to fetch saved cards:", error);
    }
  };

  const createPaymentIntent = async () => {
    try {
      const amount = billingCycle === "monthly" ? plan.price : (plan.priceYearly || plan.price * 12);
      
      const response = await paymentService.createPaymentIntent({
        planId: plan._id,
        amount,
        currency: "usd",
        billingCycle,
      });
      
      setClientSecret(response.clientSecret);
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      toast.error("Failed to initialize payment");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!useSavedCard && !cardholderName.trim()) {
      toast.error("Cardholder name is required");
      return;
    }

    setLoading(true);
    setCardError("");

    try {
      if (useSavedCard) {
        // Use saved card
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: selectedCardId,
          }
        );

        if (confirmError) {
          setCardError(confirmError.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          await handlePaymentSuccess(paymentIntent);
        }
      } else {
        // Use new card with Stripe Elements
        const cardNumberElement = elements.getElement(CardNumberElement);
        
        if (!cardNumberElement) {
          setCardError("Card element not found");
          setLoading(false);
          return;
        }

        // Create payment method
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: cardholderName,
          },
        });

        if (paymentMethodError) {
          setCardError(paymentMethodError.message);
          setLoading(false);
          return;
        }

        // Confirm payment
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmError) {
          setCardError(confirmError.message);
          setLoading(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          // Save card if checkbox is checked
          if (saveCardForFuture) {
            await paymentService.saveCard(paymentMethod.id);
            toast.success("Card saved successfully");
          }
          
          await handlePaymentSuccess(paymentIntent);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError(error.message || "Payment failed");
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handlePaymentSuccess = async (paymentIntent) => {
  try {
    // Import subscription service
    const { subscriptionService } = await import("@/services/subscriptionService");
    
    // Create subscription after successful payment
    const subscription = await subscriptionService.createSubscription({
      planId: plan._id,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      billingCycle: billingCycle,
    });

    toast.success(`Successfully subscribed to ${plan.name} plan!`);
    
    onClose();
    
    // Redirect to job creation page
    router.push("/post_job/create");
  } catch (error) {
    console.error("Subscription creation error:", error);
    toast.error("Payment succeeded but failed to create subscription");
  }
};

  // Calculate pricing
  const monthlyPrice = plan.price || 0;
  const yearlyPrice = plan.priceYearly || monthlyPrice * 12;
  const yearlySavings = (monthlyPrice * 12 - yearlyPrice).toFixed(0);
  const totalAmount = billingCycle === "monthly" ? monthlyPrice : yearlyPrice;

  // Stripe Card Element Styles
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#1f2937",
        "::placeholder": {
          color: "#9ca3af",
          fontSize: "14px",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handlePayment}>
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {/* Payment Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center gap-1 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">Payment Method</p>
          </div>

          {/* Billing Cycle Toggle */}
          {plan.priceYearly > 0 && (
            <motion.div variants={fadeInUp} className="flex gap-2">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                disabled={loading}
                className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                disabled={loading}
                className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1 ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                Yearly
                <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  Save ${yearlySavings}
                </span>
              </button>
            </motion.div>
          )}

          {/* Payment Method Tabs */}
          <motion.div variants={fadeInUp} className="flex gap-4 text-sm border-b border-gray-200">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              disabled={loading}
              className={`pb-2 px-1 -mb-px flex items-center gap-1 transition-colors duration-300 ${
                paymentMethod === "card"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("paypal")}
              disabled={loading}
              className={`pb-2 px-1 -mb-px flex items-center gap-1 transition-colors duration-300 ${
                paymentMethod === "paypal"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Wallet className="w-4 h-4" />
              PayPal
            </button>
          </motion.div>

          {paymentMethod === "card" && (
            <>
              {/* Saved Cards */}
              {savedCards.length > 0 && (
                <motion.div variants={fadeInUp} className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">
                      Saved Cards
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setUseSavedCard(!useSavedCard);
                        setSaveCardForFuture(false);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {useSavedCard ? "+ Use new card" : "Use saved card"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {useSavedCard && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-2"
                      >
                        {savedCards.map((card) => (
                          <motion.label
                            key={card.id}
                            whileHover={{ scale: 1.01 }}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-all duration-300 ${
                              selectedCardId === card.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="savedCard"
                              checked={selectedCardId === card.id}
                              onChange={() => setSelectedCardId(card.id)}
                              className="text-blue-600 w-4 h-4"
                              disabled={loading}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                {card.brand} •••• {card.last4}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Expires {card.exp_month}/{card.exp_year}
                              </p>
                            </div>
                          </motion.label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* New Card Form with Stripe Elements */}
              {(!useSavedCard || savedCards.length === 0) && (
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {/* Cardholder Name */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      disabled={loading}
                      required
                    />
                  </motion.div>

                  {/* Card Number - Stripe Element */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-xs text-gray-500 mb-1">
                      Card Number
                    </label>
                    <div className="rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-300">
                      <CardNumberElement
                        options={cardElementOptions}
                      />
                    </div>
                  </motion.div>

                  {/* Expiry & CVC - Stripe Elements */}
                  <motion.div variants={fadeInUp} className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Expiry Date
                      </label>
                      <div className="rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-300">
                        <CardExpiryElement
                          options={cardElementOptions}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        CVC
                      </label>
                      <div className="rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-300">
                        <CardCvcElement
                          options={cardElementOptions}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Save Card Checkbox */}
                  <motion.div variants={fadeInUp} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveCardForFuture"
                      checked={saveCardForFuture}
                      onChange={(e) => setSaveCardForFuture(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <label htmlFor="saveCardForFuture" className="text-xs text-gray-600">
                      Save this card for future payments
                    </label>
                  </motion.div>

                  {/* Card Error */}
                  <AnimatePresence>
                    {cardError && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="rounded-lg bg-red-50 p-3 border border-red-200"
                      >
                        <p className="text-xs text-red-600">
                          {cardError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Test Card Info - Development Only */}
                  {process.env.NODE_ENV === 'development' && (
                    <motion.div 
                      variants={fadeInUp}
                      className="rounded-lg bg-yellow-50 p-3 border border-yellow-200"
                    >
                      <p className="text-[10px] font-medium text-yellow-800 mb-1 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Test Card
                      </p>
                      <p className="text-[9px] text-yellow-700">
                        Number: 4242 4242 4242 4242 • Exp: 12/25 • CVC: 123
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </>
          )}

          {paymentMethod === "paypal" && (
            <motion.div 
              variants={fadeInUp}
              className="rounded-lg bg-gray-50 p-5 text-center border border-gray-200"
            >
              <Wallet className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                PayPal coming soon
              </p>
              <p className="text-[10px] text-gray-500">
                Please use credit card for now
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Summary Section */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm"
          onMouseEnter={() => setHoveredSection('summary')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center gap-1 mb-3">
            <Award className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">Order Summary</p>
          </div>

          {/* Plan Details */}
          <div className="mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {plan.name} Plan
              </span>
              <motion.span 
                animate={hoveredSection === 'summary' ? { scale: [1, 1.05, 1] } : {}}
                className="text-sm font-semibold text-gray-900"
              >
                ${totalAmount}.00
              </motion.span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Billing cycle</span>
              <span className="font-medium text-gray-700">
                {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
              </span>
            </div>
            
            {billingCycle === "yearly" && yearlySavings > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-between items-center text-[10px] bg-blue-50 p-1.5 rounded-lg"
              >
                <span className="text-blue-600 flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  Yearly savings
                </span>
                <span className="text-blue-600 font-medium">-${yearlySavings}.00</span>
              </motion.div>
            )}
          </div>

          {/* Features */}
          <div className="mb-3 border-t border-gray-200 pt-3">
            <p className="mb-2 text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              What's included:
            </p>
            <ul className="space-y-1">
              <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-blue-500" />
                {plan.jobLimit === 999 ? 'Unlimited' : plan.jobLimit} active {plan.jobLimit === 1 ? 'job' : 'jobs'}
              </li>
              {plan.urgentFeatured && (
                <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Urgent & featured jobs
                </li>
              )}
              {plan.highlightJob && (
                <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-yellow-500" />
                  Highlight jobs with colors
                </li>
              )}
              <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-blue-500" />
                {plan.candidateLimit === 0 || plan.candidateLimit === 999 ? 'Unlimited' : plan.candidateLimit} candidate profiles
              </li>
              <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-blue-500" />
                {plan.resumeVisibility || 30} days resume visibility
              </li>
              {plan.support24 && (
                <li className="text-[10px] text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-blue-500" />
                  24/7 priority support
                </li>
              )}
            </ul>
          </div>

          {/* Total */}
          <div className="mb-3 flex justify-between border-t border-gray-200 pt-3">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <motion.span 
              animate={hoveredSection === 'summary' ? { scale: [1, 1.05, 1] } : {}}
              className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              ${totalAmount}.00 USD
            </motion.span>
          </div>

          {/* Pay Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!stripe || loading || paymentMethod === "paypal"}
            className="relative w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span className="relative z-10">Processing...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Pay ${totalAmount}</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </motion.button>

          {/* Security Notice */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 text-[9px] text-gray-400">
              <Lock className="w-3 h-3" />
              Secured by Stripe
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1 text-[9px] text-gray-400">
              <Clock className="w-3 h-3" />
              Cancel anytime
            </div>
          </div>

          {/* Expiration Notice */}
          <p className="mt-2 text-center text-[8px] text-gray-300">
            Renews {billingCycle === "monthly" ? "monthly" : "yearly"} • No hidden fees
          </p>
        </motion.div>
      </div>
    </form>
  );
}
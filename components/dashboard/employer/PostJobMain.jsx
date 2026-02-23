"use client";

import { Check, Sparkles, Zap, Award, Crown, Gem, Star, TrendingUp, Users, Briefcase, Clock, Shield, Gift, Heart, Rocket, Coffee, Smile, ThumbsUp, Calendar, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { planService } from "@/services/planService";
import CheckoutModal from "./CheckoutModal";

export default function PostJobMain() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatAnimation = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const shimmerAnimation = {
    animate: {
      x: ['-100%', '200%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Fetch plans from API
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching plans for Post Job page...");
      
      const data = await planService.getPublicPlans();
      console.log("✅ Plans fetched successfully:", data);
      
      setPlans(data);
    } catch (error) {
      console.error("❌ Failed to fetch plans:", error);
      setError("Failed to load plans. Please try again.");
      
      // Fallback to mock data with blue/purple theme (no green)
      setPlans([
        {
          _id: "1",
          name: "Basic",
          price: 19,
          priceYearly: 190,
          jobLimit: 1,
          urgentFeatured: true,
          highlightJob: true,
          candidateLimit: 5,
          resumeVisibility: 10,
          support24: true,
          recommended: false,
          isActive: true,
          icon: <Coffee className="w-5 h-5" />,
          color: "from-blue-500 to-indigo-500",
          features: [
            "Post 1 Active Job",
            "Urgent & Featured Jobs",
            "Highlight Job with Colors",
            "Access & Save 5 Candidates",
            "10 Days Resume Visibility",
            "24/7 Critical Support"
          ]
        },
        {
          _id: "2",
          name: "Standard",
          price: 39,
          priceYearly: 390,
          jobLimit: 3,
          urgentFeatured: true,
          highlightJob: true,
          candidateLimit: 10,
          resumeVisibility: 20,
          support24: true,
          recommended: true,
          isActive: true,
          icon: <Zap className="w-5 h-5" />,
          color: "from-purple-500 to-pink-500",
          features: [
            "Post 3 Active Jobs",
            "Urgent & Featured Jobs",
            "Highlight Job with Colors",
            "Access & Save 10 Candidates",
            "20 Days Resume Visibility",
            "24/7 Critical Support"
          ]
        },
        {
          _id: "3",
          name: "Premium",
          price: 59,
          priceYearly: 590,
          jobLimit: 6,
          urgentFeatured: true,
          highlightJob: true,
          candidateLimit: 20,
          resumeVisibility: 30,
          support24: true,
          recommended: false,
          isActive: true,
          icon: <Crown className="w-5 h-5" />,
          color: "from-indigo-500 to-blue-500",
          features: [
            "Post 6 Active Jobs",
            "Urgent & Featured Jobs",
            "Highlight Job with Colors",
            "Access & Save 20 Candidates",
            "30 Days Resume Visibility",
            "24/7 Critical Support"
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  // Get plan icon based on name
  const getPlanIcon = (planName) => {
    switch(planName?.toLowerCase()) {
      case 'basic': return <Coffee className="w-5 h-5" />;
      case 'standard': return <Zap className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      default: return <Gem className="w-5 h-5" />;
    }
  };

  // Get plan color based on name (blue/purple theme only, no green)
  const getPlanColor = (planName) => {
    switch(planName?.toLowerCase()) {
      case 'basic': return 'from-blue-500 to-indigo-500';
      case 'standard': return 'from-purple-500 to-pink-500';
      case 'premium': return 'from-indigo-500 to-blue-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  // Loading skeleton with animations
  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <div className="mb-8 max-w-4xl relative">
          <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse mt-2"></div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg"
            >
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="mt-3 h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div key={j} className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="mt-5 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-8 border border-red-200">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white mx-auto">
                <span className="text-2xl">!</span>
              </div>
              <motion.div 
                className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchPlans}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Filter only active plans
  const activePlans = plans.filter(plan => plan.isActive !== false);

  return (
    <>
      <main
        className="
          w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white
          px-4 py-6
          sm:px-6
          md:ml-[260px]
          md:w-[calc(100%-260px)]
          md:overflow-y-auto
          relative
        "
      >
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
              style={{
                width: Math.random() * 150 + 50,
                height: Math.random() * 150 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 30 - 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Gradient orbs */}
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8 max-w-4xl relative"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div 
              variants={pulseAnimation}
              animate="animate"
              className="relative"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-30 blur"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Buy Premium Subscription to Post a Job
              </h2>
              <p className="text-sm text-gray-500 max-w-2xl mt-1">
                Choose the best plan that fits your hiring needs and start posting jobs today.
              </p>
            </div>
          </div>
          
          {/* Billing toggle */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-500">Billing:</span>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1 ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Yearly
                <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
          
          {/* Active plans count */}
          <motion.p 
            variants={fadeInUp}
            className="mt-3 text-xs text-gray-400 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {activePlans.length} plans available
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        {activePlans.length === 0 ? (
          <motion.div 
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="relative inline-block mb-3">
              <Smile className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No subscription plans available at the moment.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-5 lg:grid-cols-3"
          >
            {activePlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                variants={fadeInUp}
                onHoverStart={() => setHoveredPlan(plan._id)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                <PlanCard
                  plan={plan}
                  onChoose={handleChoosePlan}
                  billingCycle={billingCycle}
                  isHovered={hoveredPlan === plan._id}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={selectedPlan}
        billingCycle={billingCycle}
      />
    </>
  );
}

/* ---------------- Plan Card ---------------- */

function PlanCard({ plan, onChoose, billingCycle, isHovered, index }) {
  const {
    _id,
    name,
    price,
    priceYearly,
    jobLimit,
    urgentFeatured,
    highlightJob,
    candidateLimit,
    resumeVisibility,
    support24,
    recommended,
    features = []
  } = plan;

  // Get plan icon and color based on name (blue/purple theme only)
  const getPlanIcon = () => {
    switch(name?.toLowerCase()) {
      case 'basic': return <Coffee className="w-5 h-5" />;
      case 'standard': return <Zap className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      default: return <Gem className="w-5 h-5" />;
    }
  };

  const getPlanColor = () => {
    switch(name?.toLowerCase()) {
      case 'basic': return 'from-blue-500 to-indigo-500';
      case 'standard': return 'from-purple-500 to-pink-500';
      case 'premium': return 'from-indigo-500 to-blue-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getPlanBgColor = () => {
    switch(name?.toLowerCase()) {
      case 'basic': return 'bg-blue-50';
      case 'standard': return 'bg-purple-50';
      case 'premium': return 'bg-indigo-50';
      default: return 'bg-gray-50';
    }
  };

  const getPlanBorderColor = () => {
    switch(name?.toLowerCase()) {
      case 'basic': return 'border-blue-200';
      case 'standard': return 'border-purple-200';
      case 'premium': return 'border-indigo-200';
      default: return 'border-gray-200';
    }
  };

  const getPlanBadgeColor = () => {
    switch(name?.toLowerCase()) {
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'standard': return 'bg-purple-100 text-purple-700';
      case 'premium': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const planColor = getPlanColor();
  const planBgColor = getPlanBgColor();
  const planBorderColor = getPlanBorderColor();
  const planBadgeColor = getPlanBadgeColor();

  // Calculate current price based on billing cycle
  const currentPrice = billingCycle === 'monthly' ? price : priceYearly;
  const monthlyEquivalent = billingCycle === 'yearly' ? (priceYearly / 12).toFixed(2) : null;

  // Generate features if not provided by API
  const displayFeatures = features.length > 0 ? features : [
    `Post ${jobLimit === 999 ? 'Unlimited' : jobLimit} Active Job${jobLimit > 1 ? 's' : ''}`,
    urgentFeatured ? "Urgent & Featured Jobs" : null,
    highlightJob ? "Highlight Job with Colors" : null,
    `Access & Save ${candidateLimit === 0 || candidateLimit === 999 ? 'Unlimited' : candidateLimit} Candidates`,
    `${resumeVisibility === 0 ? 'Unlimited' : resumeVisibility} Days Resume Visibility`,
    support24 ? "24/7 Critical Support" : null,
  ].filter(Boolean);

  // Animation variants
  const shimmerAnimation = {
    animate: {
      x: ['-100%', '200%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const floatAnimation = {
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        relative rounded-xl border bg-white/80 backdrop-blur-sm p-6 shadow-lg
        transition-all duration-300 hover:shadow-2xl overflow-hidden
        ${recommended ? `border-2 border-${planColor.split('-')[1]}-500 ring-2 ring-${planColor.split('-')[1]}-500 ring-opacity-30` : `border-gray-200 ${planBorderColor} hover:border-${planColor.split('-')[1]}-300`}
      `}
    >
      {/* Shine effect on hover */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={shimmerAnimation}
        />
      )}
      
      {/* Decorative corner gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${planColor} opacity-10 rounded-bl-full`} />
      
      {/* Recommended Badge */}
      {recommended && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="relative">
            <div className={`bg-gradient-to-r ${planColor} px-3 py-1 rounded-full text-[9px] font-medium text-white flex items-center gap-1 shadow-lg`}>
              <Star className="w-3 h-3 fill-white" />
              Recommended
            </div>
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${planColor} rounded-full blur-md opacity-50`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}

      {/* Header with icon and name */}
      <div className="flex items-center gap-2 mb-3">
        <motion.div 
          animate={isHovered ? { rotate: [0, 5, -5, 0] } : {}}
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${planColor} flex items-center justify-center text-white shadow-md`}
        >
          {getPlanIcon()}
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          ${currentPrice}
        </span>
        <span className="text-xs text-gray-500">
          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
        </span>
      </div>
      
      {/* Yearly savings info */}
      {billingCycle === 'yearly' && monthlyEquivalent && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-blue-600 mt-1 flex items-center gap-1"
        >
          <DollarSign className="w-3 h-3" />
          ${monthlyEquivalent}/month equivalent
        </motion.p>
      )}

      {/* Features */}
      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        {displayFeatures.map((feature, idx) => (
          <motion.li 
            key={idx} 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-1.5"
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br ${planColor} flex items-center justify-center text-white flex-shrink-0`}>
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium ${planBadgeColor}`}
        >
          <Briefcase className="w-3 h-3 mr-0.5" />
          {jobLimit === 999 ? 'Unlimited' : jobLimit} Jobs
        </motion.span>
        {candidateLimit > 0 && (
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-blue-100 text-blue-700"
          >
            <Users className="w-3 h-3 mr-0.5" />
            {candidateLimit === 999 ? 'Unlimited' : candidateLimit} Candidates
          </motion.span>
        )}
        {urgentFeatured && (
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-purple-100 text-purple-700"
          >
            <Zap className="w-3 h-3 mr-0.5" />
            Urgent
          </motion.span>
        )}
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChoose({ ...plan, selectedBilling: billingCycle, finalPrice: currentPrice })}
        className={`
          relative mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden group
          ${
            recommended
              ? `bg-gradient-to-r ${planColor} text-white shadow-md hover:shadow-lg`
              : `border border-${planColor.split('-')[1]}-300 text-${planColor.split('-')[1]}-600 hover:bg-gradient-to-r hover:from-${planColor.split('-')[1]}-50 hover:to-${planColor.split('-')[1]}-100`
          }
        `}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <span className="relative z-10 flex items-center justify-center gap-1">
          Choose Plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </motion.button>

      {/* Floating savings badge for yearly */}
      {billingCycle === 'yearly' && priceYearly < price * 12 && (
        <motion.div 
          className="absolute top-2 right-2"
          animate={floatAnimation}
        >
          <div className={`bg-gradient-to-r ${planColor} text-white text-[8px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md`}>
            <Gift className="w-3 h-3" />
            Save ${(price * 12 - priceYearly).toFixed(0)}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ArrowRight component
const ArrowRight = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
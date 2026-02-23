import api from "@/utils/api";
import toast from "react-hot-toast";

// Create payment intent
export const createPaymentIntent = async ({ planId, amount, currency, billingCycle }) => {
  try {
    console.log("💳 [PAYMENT SERVICE] Creating payment intent:", { planId, amount, currency, billingCycle });
    
    const response = await api.post("/payments/create-intent", {
      planId,
      amount,
      currency,
      billingCycle,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Payment intent created successfully");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create payment intent");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Create payment intent error:", error);
    throw error;
  }
};

// Process payment with new card
// Process payment with new card
export const processPayment = async ({ paymentIntentId, cardDetails, cardholderName }) => {
  try {
    console.log("💳 [PAYMENT SERVICE] Processing payment:", paymentIntentId);
    
    const response = await api.post("/payments/process", {
      paymentIntentId,
      cardDetails,
      cardholderName,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Payment processed successfully");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to process payment");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Process payment error:", error);
    throw error;
  }
};

// Process payment with saved card
export const processPaymentWithSavedCard = async ({ paymentIntentId, cardId }) => {
  try {
    console.log("💳 [PAYMENT SERVICE] Processing payment with saved card:", { paymentIntentId, cardId });
    
    const response = await api.post("/payments/process-with-saved-card", {
      paymentIntentId,
      cardId,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Payment processed successfully with saved card");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to process payment with saved card");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Process payment with saved card error:", error);
    throw error;
  }
};



// Confirm payment and create subscription
export const confirmPayment = async ({ paymentIntentId }) => {
  try {
    console.log("✅ [PAYMENT SERVICE] Confirming payment:", paymentIntentId);
    
    const response = await api.post("/payments/confirm", {
      paymentIntentId,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Payment confirmed successfully");
      return response.data.subscription;
    } else {
      throw new Error(response.data.message || "Failed to confirm payment");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Confirm payment error:", error);
    throw error;
  }
};

// Get saved cards
export const getSavedCards = async () => {
  try {
    console.log("💳 [PAYMENT SERVICE] Fetching saved cards");
    
    const response = await api.get("/payments/cards");
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Saved cards fetched successfully:", response.data.cards);
      return response.data.cards || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Get saved cards error:", error);
    return [];
  }
};

// Save card for future use
export const saveCard = async (paymentMethodId) => {
  try {
    console.log("💳 [PAYMENT SERVICE] Saving card:", paymentMethodId);
    
    const response = await api.post("/payments/cards", {
      paymentMethodId,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Card saved successfully");
      return response.data.card;
    } else {
      throw new Error(response.data.message || "Failed to save card");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Save card error:", error);
    throw error;
  }
};

// Delete saved card
export const deleteCard = async (cardId) => {
  try {
    console.log("🗑️ [PAYMENT SERVICE] Deleting card:", cardId);
    
    const response = await api.delete(`/payments/cards/${cardId}`);
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Card deleted successfully");
      return true;
    } else {
      throw new Error(response.data.message || "Failed to delete card");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Delete card error:", error);
    throw error;
  }
};

// Set default card
export const setDefaultCard = async (cardId) => {
  try {
    console.log("⭐ [PAYMENT SERVICE] Setting default card:", cardId);
    
    const response = await api.put("/payments/cards/default", {
      cardId,
    });
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Default card set successfully");
      return true;
    } else {
      throw new Error(response.data.message || "Failed to set default card");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Set default card error:", error);
    throw error;
  }
};

// Get subscription history
export const getSubscriptions = async () => {
  try {
    console.log("📋 [PAYMENT SERVICE] Fetching subscriptions");
    
    const response = await api.get("/subscriptions");
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Subscriptions fetched successfully");
      return response.data.subscriptions || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Get subscriptions error:", error);
    throw error;
  }
};

// Get active subscription
export const getActiveSubscription = async () => {
  try {
    console.log("📋 [PAYMENT SERVICE] Fetching active subscription");
    
    const response = await api.get("/subscriptions/status");
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Active subscription fetched successfully");
      return response.data;
    } else {
      return { hasActiveSubscription: false, subscription: null };
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Get active subscription error:", error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    console.log("🛑 [PAYMENT SERVICE] Canceling subscription:", subscriptionId);
    
    const response = await api.put(`/subscriptions/${subscriptionId}/cancel`);
    
    if (response.data.success) {
      console.log("✅ [PAYMENT SERVICE] Subscription canceled successfully");
      return response.data.subscription;
    } else {
      throw new Error(response.data.message || "Failed to cancel subscription");
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Cancel subscription error:", error);
    throw error;
  }
};

// Calculate tax
export const calculateTax = async (amount, country = 'US') => {
  try {
    console.log("💰 [PAYMENT SERVICE] Calculating tax for amount:", amount);
    
    const response = await api.post("/payments/calculate-tax", {
      amount,
      country,
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      return { tax: 0, total: amount };
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Calculate tax error:", error);
    return { tax: 0, total: amount };
  }
};

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    console.log("💳 [PAYMENT SERVICE] Fetching payment methods");
    
    const response = await api.get("/payments/methods");
    
    if (response.data.success) {
      return response.data.methods || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Get payment methods error:", error);
    return [];
  }
};

// Get invoices
export const getInvoices = async () => {
  try {
    console.log("📄 [PAYMENT SERVICE] Fetching invoices");
    
    const response = await api.get("/subscriptions/invoices");
    
    if (response.data.success) {
      return response.data.invoices || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Get invoices error:", error);
    throw error;
  }
};

// Download invoice
export const downloadInvoice = async (invoiceId) => {
  try {
    console.log("📄 [PAYMENT SERVICE] Downloading invoice:", invoiceId);
    
    const response = await api.get(`/subscriptions/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${invoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error("❌ [PAYMENT SERVICE] Download invoice error:", error);
    throw error;
  }
};

// Export all methods as named exports
export const paymentService = {
  createPaymentIntent,
  processPayment,
  processPaymentWithSavedCard,
  confirmPayment,
  getSavedCards,
  saveCard,
  deleteCard,
  setDefaultCard,
  getSubscriptions,
  getActiveSubscription,
  cancelSubscription,
  calculateTax,
  getPaymentMethods,
  getInvoices,
  downloadInvoice,
};





// Also export as default for convenience
export default paymentService;
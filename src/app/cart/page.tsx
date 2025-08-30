"use client";

import { useState, useEffect } from "react";
import { useNexus } from "@/hooks/useNexus";
import { EventLog } from "@/components/EventLog";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function Cart() {
  const { trackEvent } = useNexus();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("cart");
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    trackEvent("page_view", {
      page: "cart",
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    });

    // Load sample cart items
    const sampleItems: CartItem[] = [
      { id: "1", name: "Wireless Headphones", price: 99.99, quantity: 1, image: "🎧", category: "electronics" },
      { id: "2", name: "Smart Watch", price: 199.99, quantity: 1, image: "⌚", category: "electronics" },
      { id: "3", name: "Laptop Stand", price: 49.99, quantity: 2, image: "💻", category: "accessories" },
    ];
    setCartItems(sampleItems);
  }, [trackEvent]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      trackEvent("item_removed_from_cart", {
        item_id: itemId,
        timestamp: new Date().toISOString(),
      });
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      trackEvent("cart_quantity_updated", {
        item_id: itemId,
        new_quantity: newQuantity,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    trackEvent("item_removed_from_cart", {
      item_id: itemId,
      timestamp: new Date().toISOString(),
    });
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setAppliedPromo(promoCode);
      setPromoCode("");
      trackEvent("promo_code_applied", {
        promo_code: promoCode,
        timestamp: new Date().toISOString(),
      });
      alert("Promo code applied successfully!");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo("");
    trackEvent("promo_code_removed", {
      timestamp: new Date().toISOString(),
    });
  };

  const proceedToCheckout = () => {
    setCheckoutStep("shipping");
    trackEvent("checkout_started", {
      cart_total: getCartTotal(),
      item_count: getItemCount(),
      timestamp: new Date().toISOString(),
    });
  };

  const handleShippingContinue = () => {
    setCheckoutStep("payment");
    trackEvent("shipping_info_completed", {
      shipping_method: shippingMethod,
      timestamp: new Date().toISOString(),
    });
  };

  const handlePaymentContinue = () => {
    setCheckoutStep("confirmation");
    trackEvent("payment_completed", {
      payment_method: "credit_card",
      timestamp: new Date().toISOString(),
    });
  };

  const handleFormChange = (field: keyof CheckoutForm, value: string) => {
    setCheckoutForm(prev => ({ ...prev, [field]: value }));
    trackEvent("checkout_field_change", {
      field,
      timestamp: new Date().toISOString(),
    });
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingMethod === "express" ? 15 : 5;
    const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount
    return subtotal + shipping - discount;
  };

  const getItemCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const shippingMethods = [
    { id: "standard", name: "Standard Shipping", price: 5, delivery: "3-5 business days" },
    { id: "express", name: "Express Shipping", price: 15, delivery: "1-2 business days" },
  ];

  if (checkoutStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
            <button
              onClick={() => {
                setCheckoutStep("cart");
                setCheckoutForm({
                  email: "",
                  firstName: "",
                  lastName: "",
                  address: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  cardNumber: "",
                  expiryDate: "",
                  cvv: "",
                });
                setAppliedPromo("");
                setShippingMethod("standard");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items / Checkout Forms */}
          <div className="lg:col-span-2">
            {checkoutStep === "cart" && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items ({getItemCount()})</h2>
                </div>
                <div className="p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl">
                            {item.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <p className="text-lg font-bold text-gray-900">${item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {checkoutStep === "shipping" && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={checkoutForm.firstName}
                        onChange={(e) => handleFormChange("firstName", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={checkoutForm.lastName}
                        onChange={(e) => handleFormChange("lastName", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={checkoutForm.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={checkoutForm.address}
                      onChange={(e) => handleFormChange("address", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={checkoutForm.city}
                        onChange={(e) => handleFormChange("city", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={checkoutForm.state}
                        onChange={(e) => handleFormChange("state", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={checkoutForm.zipCode}
                        onChange={(e) => handleFormChange("zipCode", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleShippingContinue}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={checkoutForm.cardNumber}
                      onChange={(e) => handleFormChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={checkoutForm.expiryDate}
                        onChange={(e) => handleFormChange("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={checkoutForm.cvv}
                        onChange={(e) => handleFormChange("cvv", e.target.value)}
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handlePaymentContinue}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Complete Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-8">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingMethod === "express" ? "15.00" : "5.00"}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {checkoutStep === "cart" && (
                  <>
                    <div className="border-t pt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedPromo && (
                        <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                          <span className="text-sm text-green-700">Applied: {appliedPromo}</span>
                          <button
                            onClick={removePromoCode}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <button
                        onClick={proceedToCheckout}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </>
                )}

                {checkoutStep === "shipping" && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Shipping Method</h3>
                    {shippingMethods.map((method) => (
                      <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">{method.name}</span>
                            <span className="text-sm text-gray-900">${method.price}</span>
                          </div>
                          <p className="text-xs text-gray-500">{method.delivery}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Events</h3>
          <EventLog />
        </div>
      </div>
    </div>
  );
}

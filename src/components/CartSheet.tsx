import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Tag, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useAppContext } from "../AppContext";

export const CartSheet = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    checkout,
    getCartTotals,
    appliedCoupon,
    setAppliedCoupon,
    vendors,
    addToCart,
    orders,
  } = useAppContext();
  const [couponInput, setCouponInput] = useState("");
  const [showHooray, setShowHooray] = useState(false);
  const [couponError, setCouponError] = useState("");

  const suggestedItems = useMemo(() => {
    if (cart.length === 0) return [];

    // Get unique vendors currently in the cart
    const cartVendorIds = Array.from(
      new Set(cart.map((item) => item.vendorId)),
    );

    let suggestions: {
      vendorId: string;
      vendorName: string;
      product: any;
      vendor: any;
    }[] = [];

    cartVendorIds.forEach((vid) => {
      const vendor = vendors.find((v: any) => v.id === vid);
      if (vendor) {
        // Find products from this vendor that are NOT in the cart
        const unboughtProducts = vendor.products.filter(
          (p: any) =>
            !cart.some(
              (c: any) => c.product.name === p.name && c.vendorId === vid,
            ),
        );
        // Add up to 3 suggestions from this vendor
        const topPicks = unboughtProducts.slice(0, 3).map((p: any) => ({
          vendorId: vid,
          vendorName: vendor.name,
          product: p,
          vendor: vendor,
        }));
        suggestions.push(...topPicks);
      }
    });

    // Return max 6 suggestions total
    return suggestions.slice(0, 6);
  }, [cart, vendors]);

  if (!isCartOpen) return null;

  const { subtotal, discount, total } = getCartTotals();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = () => {
    setCouponError(""); // clear previous
    
    if (couponInput.toLowerCase() === "nonu") {
      if (subtotal < 200) {
        setCouponError("⚠️ Minimum order of ₹200 is required to apply the 'Nonu' coupon!");
        setAppliedCoupon("");
        return;
      }

      const cartVendorIds = Array.from(
        new Set(cart.map((item) => item.vendorId)),
      );
      let eligible = false;

      for (const vid of cartVendorIds) {
        let orderCount = 0;
        for (const order of orders) {
          if (
            order.status === "completed" &&
            order.items.some((item) => item.vendorId === vid)
          ) {
            orderCount++;
          }
        }
        if (orderCount >= 3) {
          eligible = true;
          break;
        }
      }

      if (!eligible) {
        setCouponError(
          "⚠️ Minimum order failed. You must have ordered at least 3 times from this vendor.",
        );
        setAppliedCoupon("");
        return;
      }
    } else if (couponInput.toUpperCase() === "GRAB10") {
      if (subtotal < 150) {
        setCouponError("⚠️ Minimum order of ₹150 is required to apply the 'GRAB10' coupon!");
        setAppliedCoupon("");
        return;
      }
    } else if (couponInput.toUpperCase() === "MED25") {
      if (subtotal < 150) {
        setCouponError("⚠️ Minimum order of ₹150 is required to apply the 'MED25' coupon!");
        setAppliedCoupon("");
        return;
      }
    } else if (couponInput.trim() !== "") {
      setCouponError("⚠️ Invalid coupon code.");
      setAppliedCoupon("");
      return;
    }

    setAppliedCoupon(couponInput);
    if ((couponInput.toLowerCase() === "nonu" || couponInput.toUpperCase() === "GRAB10" || couponInput.toUpperCase() === "MED25") && cart.length > 0) {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"],
      });
      // Show Hooray graffiti
      setShowHooray(true);
      setTimeout(() => setShowHooray(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {showHooray && (
        <motion.div
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1.1, rotate: -5, opacity: 1 }}
          exit={{ scale: 1.3, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center"
        >
          <div
            className="absolute text-[80px] md:text-[120px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-indigo-500 max-w-[90vw] text-center drop-shadow-[0_10px_20px_rgba(16,185,129,0.4)]"
            style={{
              WebkitTextStroke: "2px white",
              textShadow: "4px 4px 0px #047857",
            }}
          >
            HOORAY!
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col justify-end"
        onClick={() => setIsCartOpen(false)}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white dark:bg-zinc-950 rounded-t-[32px] border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] pb-safe flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div
            className="pt-3 pb-2 flex justify-center sticky top-0 bg-white dark:bg-zinc-950 z-10 w-full"
            onClick={() => setIsCartOpen(false)}
          >
            <div className="w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          </div>

          <div className="p-6 pt-2 flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag size={24} /> My Cart
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1 text-sm">
                  {itemCount} items
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-2">
              <div className="space-y-4 mb-8">
                {cart.length === 0 ? (
                  <div className="text-center text-zinc-500 dark:text-zinc-400 py-10">
                    Your cart is empty
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                              <ShoppingBag size={16} />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                              {item.product.name}
                              {item.selectedVariant && (
                                <span className="ml-1 text-xs font-normal text-zinc-500">
                                  ({item.selectedVariant})
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                              {item.vendorName}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          ₹
                          {((item.selectedVariant &&
                            item.product.variantPrices?.[
                              item.selectedVariant
                            ]) ||
                            item.product.price) * item.quantity}
                        </span>
                      </div>
                      <div className="flex justify-end items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {suggestedItems.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 px-1">
                    You might also like
                  </h3>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                    {suggestedItems.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="min-w-[140px] flex flex-col p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm shrink-0"
                      >
                        {suggestion.product.image ? (
                          <img
                            src={suggestion.product.image}
                            alt={suggestion.product.name}
                            className="w-full h-20 rounded-xl object-cover mb-2"
                          />
                        ) : (
                          <div className="w-full h-20 rounded-xl bg-zinc-100 dark:bg-zinc-900 mb-2 flex items-center justify-center text-zinc-400">
                            <ShoppingBag size={24} strokeWidth={1.5} />
                          </div>
                        )}
                        <h4 className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {suggestion.product.name}
                        </h4>
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2 mt-0.5">
                          ₹
                          {(suggestion.product.variants &&
                            suggestion.product.variants[0] &&
                            suggestion.product.variantPrices?.[
                              suggestion.product.variants[0]
                            ]) ||
                            suggestion.product.price}
                        </span>
                        <button
                          onClick={() =>
                            addToCart(
                              suggestion.vendor,
                              suggestion.product,
                              suggestion.product.variants?.[0],
                            )
                          }
                          className="w-full py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors mt-auto"
                        >
                          Add to cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Add coupon code..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-semibold active:opacity-80 transition-opacity"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Subtotal
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white text-sm">
                    ₹{subtotal}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-emerald-500 text-sm flex items-center gap-1">
                      <Tag size={14} /> Discount
                    </span>
                    <span className="font-bold text-emerald-500 text-sm">
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4 mt-2">
                  <span className="text-zinc-900 dark:text-zinc-100 font-bold text-base">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                    ₹{total}
                  </span>
                </div>

                <AnimatePresence>
                  {couponError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl flex items-center justify-between"
                    >
                      {couponError}
                      <button
                        onClick={() => setCouponError("")}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={checkout}
                  className="w-full bg-emerald-600 active:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-base transition-transform active:scale-95 shadow-md shadow-emerald-600/20"
                >
                  Request Vendor
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Phone, Bell, Heart, ShieldCheck, CreditCard, Banknote, QrCode, ListCollapse, ListTree, Tag, Plus, Minus } from 'lucide-react';
import { Vendor } from '../types';
import { useAppContext } from '../AppContext';
import { translations } from '../lib/i18n';
import { cn } from '../lib/utils';

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
}

export const VendorDetails = ({ vendor, onClose }: Props) => {
  const { language, toggleFavorite, favorites, accessibility, addToCart, cart, updateCartQuantity } = useAppContext();
  const t = translations[language];
  const [showItems, setShowItems] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!vendor) return null;

  const isFavorite = favorites.includes(vendor.id);
  const isHighContrast = accessibility.highContrast;

  const getVariant = (p: any) => {
    if (!p.variants || p.variants.length === 0) return undefined;
    return selectedVariants[p.name] || p.variants[0];
  };

  const getCartQuantityForVariant = (productName: string, variant?: string) => {
    const variantStr = variant ? `_${variant}` : '';
    const item = cart.find(c => c.id === `${vendor.id}_${productName}${variantStr}`);
    return item ? item.quantity : 0;
  };

  const getTotalCartQuantity = (productName: string) => {
    return cart.filter(c => c.vendorId === vendor.id && c.product.name === productName)
               .reduce((sum, c) => sum + c.quantity, 0);
  };

  const handleRequestStop = () => {
    alert(t.stop_requested);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-zinc-950 rounded-t-[32px] border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] pb-safe flex flex-col max-h-[85vh] overflow-y-auto"
      >
        {/* Minimalist Top Drag Handle Indicator */}
        <div className="pt-3 pb-2 flex justify-center sticky top-0 bg-white dark:bg-zinc-950 z-10 w-full" onClick={onClose}>
           <div className="w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
        </div>

        <div className="p-6 pt-2 flex flex-col h-full bg-white dark:bg-zinc-950">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                 <h2 className={cn("text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white", isHighContrast && "text-black dark:text-white")}>
                   {vendor.name}
                 </h2>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mt-1 text-sm">{vendor.type} • <span className="font-semibold text-zinc-700 dark:text-zinc-300">{vendor.averagePrice}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md text-xs font-medium">
              <Star size={14} fill="currentColor" strokeWidth={1} className="text-amber-400" />
              <span>{vendor.rating}</span>
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-md">
              {vendor.distance.toFixed(1)} {t.distance_km}
            </div>
          </div>

          {vendor.saleOffer && (
            <div className="mb-8 flex items-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-500/10 dark:to-orange-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold shadow-sm">
              <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-black/20 flex items-center justify-center shadow-sm">
                 <Tag size={16} className="text-rose-600 dark:text-rose-400" />
              </div>
              {vendor.saleOffer}
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
               <h3 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">{t.products}</h3>
               <button 
                 onClick={() => setShowItems(!showItems)}
                 className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full"
               >
                 {showItems ? <><ListCollapse size={14} /> Hide Prices</> : <><ListTree size={14} /> Show Prices</>}
               </button>
            </div>
            
            {showItems ? (
              <div className="flex flex-col gap-2">
                {vendor.products.map(p => {
                  const activeVariant = getVariant(p);
                  const qty = getCartQuantityForVariant(p.name, activeVariant);
                  const variantStr = activeVariant ? `_${activeVariant}` : '';
                  const cartId = `${vendor.id}_${p.name}${variantStr}`;

                  return (
                  <div key={p.name} className="flex flex-col border-b border-zinc-100 dark:border-zinc-800/60 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                            <Tag size={20} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">{p.name}</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">₹{(activeVariant && p.variantPrices?.[activeVariant]) || p.price}</span>
                        </div>
                      </div>
                      
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-xl">
                          <button onClick={() => updateCartQuantity(cartId, -1)} className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"><Minus size={16} strokeWidth={2.5}/></button>
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 w-4 text-center">{qty}</span>
                          <button onClick={() => updateCartQuantity(cartId, 1)} className="p-1 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"><Plus size={16} strokeWidth={2.5}/></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(vendor, p, activeVariant)}
                          className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-full border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wide"
                        >
                          Add
                        </button>
                      )}
                    </div>

                    {p.variants && p.variants.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {p.variants.map((v: string) => (
                           <button
                             key={v}
                             onClick={() => setSelectedVariants(prev => ({ ...prev, [p.name]: v }))}
                             className={cn(
                               "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                               activeVariant === v 
                                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-black dark:border-zinc-100" 
                                : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                             )}
                           >
                             {v}
                           </button>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {vendor.products.map(p => {
                  const totalQty = getTotalCartQuantity(p.name);
                  return (
                  <button 
                    key={p.name} 
                    onClick={() => {
                        const activeVariant = getVariant(p);
                        addToCart(vendor, p, activeVariant);
                    }}
                    className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95"
                  >
                    {totalQty > 0 && <span className="mr-1 font-bold text-emerald-500">{totalQty}x</span>}
                    {p.name}
                  </button>
                )})}
              </div>
            )}
          </div>

          <div className="space-y-3 mb-8">
            <h3 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">Accepted Payments</h3>
            <div className="flex flex-wrap gap-2">
              {vendor.paymentMethods?.includes('cash') && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800/30 rounded-lg text-xs font-medium">
                  <Banknote size={14} /> Cash
                </div>
              )}
              {vendor.paymentMethods?.includes('upi') && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 rounded-lg text-xs font-medium">
                  <QrCode size={14} /> UPI
                </div>
              )}
              {vendor.paymentMethods?.includes('card') && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30 rounded-lg text-xs font-medium">
                  <CreditCard size={14} /> Card
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={handleRequestStop}
              className={cn(
                "w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors",
                isHighContrast 
                  ? "bg-black text-white dark:bg-white dark:text-black border border-transparent" 
                  : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              )}
            >
              <Bell size={18} strokeWidth={2} />
              {t.request_stop}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3.5 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <Phone size={16} strokeWidth={2} />
                {t.call_vendor}
              </button>
              <button 
                onClick={() => toggleFavorite(vendor.id)}
                className="py-3.5 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <Heart size={16} strokeWidth={2} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
                {t.save_favorite}
              </button>
            </div>
            
            <button className="py-3 mt-1 rounded-xl font-medium text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center gap-2 transition-colors">
               {t.pay_now}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

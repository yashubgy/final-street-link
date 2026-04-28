import React, { useState, useEffect, useRef } from 'react';
import { MapView } from '../components/Map';
import { useAppContext } from '../AppContext';
import { Vendor } from '../types';
import { translations } from '../lib/i18n';
import { Search, Mic, X, Star, MapPin, IndianRupee, Banknote, ArrowLeft, Tag } from 'lucide-react';
import { VendorDetails } from '../components/VendorDetails';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const HomeScreen = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { language, vendors, accessibility } = useAppContext();
  const t = translations[language];
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const prevNearbyIds = useRef<Set<string>>(new Set());

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "price">("distance");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [vendorTypeFilter, setVendorTypeFilter] = useState<"all" | "street" | "shop">("all");

  const filteredVendors = vendors.filter(v => {
    if (vendorTypeFilter !== "all" && v.vendorType !== vendorTypeFilter) return false;
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(lowerQ) || 
           v.products.some(p => p.name.toLowerCase().includes(lowerQ)) ||
           v.type.toLowerCase().includes(lowerQ) ||
           v.category.toLowerCase().includes(lowerQ);
  }).sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'rating') return b.rating - a.rating; // Highest rating first
    if (sortBy === 'price') {
      if (searchQuery) {
        // Find specific item price if search query matches an item
        const lowerQ = searchQuery.toLowerCase();
        const getMatchingMinPrice = (vendor: Vendor) => {
          const matchingProducts = vendor.products.filter(p => p.name.toLowerCase().includes(lowerQ));
          if (matchingProducts.length > 0) {
            return Math.min(...matchingProducts.map(p => p.price));
          }
          return vendor.priceLevel ? vendor.priceLevel * 1000 : 9999;
        };
        return getMatchingMinPrice(a) - getMatchingMinPrice(b);
      }
      return (a.priceLevel || 0) - (b.priceLevel || 0); // Lowest price level first
    }
    return 0;
  });

  // Simulate nearby alert
  useEffect(() => {
    let newVendorName: string | null = null;
    const currentNearbyIds = new Set<string>();

    vendors.forEach(v => {
      if (v.distance < 0.3) {
        currentNearbyIds.add(v.id);
        if (!prevNearbyIds.current.has(v.id)) {
          if (v.vendorType !== "shop" && v.category !== "medicine") {
            newVendorName = v.name;
          }
        }
      }
    });

    if (newVendorName) {
      setAlertMessage(`${newVendorName} is near your zone!`);
      setTimeout(() => setAlertMessage(null), 2000);
    }
    
    prevNearbyIds.current = currentNearbyIds;
  }, [vendors]);

  return (
    <div className="h-full w-full relative flex flex-col p-4 gap-4 pb-20">
      {/* Top Search Bar */}
      <div className="z-30 relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl flex flex-col pointer-events-auto transition-all">
        <div className="flex gap-3 items-center w-full">
          {isSearchFocused || searchQuery ? (
            <button 
              onClick={() => { setIsSearchFocused(false); setSearchQuery(''); }} 
              className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-900 dark:text-zinc-100 font-semibold text-lg flex-shrink-0">
              V
            </div>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={isSearchFocused ? "Search products, vendors..." : t.search_vendors}
              className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-medium text-base"
            />
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
               <X size={18} />
            </button>
          )}
          {accessibility.voiceCommands && !searchQuery && !isSearchFocused && (
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl font-medium text-sm transition-colors flex-shrink-0 cursor-pointer" aria-label="Voice Search">
              <Mic size={18} strokeWidth={2} />
            </button>
          )}
        </div>
        
        {/* Vendor Type Filter */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl mt-3">
          {(['all', 'street', 'shop'] as const).map(type => (
            <button
              key={type}
              onClick={() => setVendorTypeFilter(type)}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors",
                vendorTypeFilter === type 
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              {type === 'all' ? 'All Vendors' : type === 'street' ? 'Street Carts' : 'Shops'}
            </button>
          ))}
        </div>
        
        {/* Search Results Display Overlay */}
        <AnimatePresence>
          {(isSearchFocused || searchQuery) && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="overflow-hidden mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3"
             >
               <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                 <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Sort:</span>
                 {(['distance', 'rating', 'price'] as const).map(sortType => (
                   <button
                     key={sortType}
                     onClick={() => setSortBy(sortType)}
                     className={cn(
                       "px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors border",
                       sortBy === sortType 
                         ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100" 
                         : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                     )}
                   >
                     {sortType}
                   </button>
                 ))}
               </div>

               <div className="max-h-[50vh] overflow-y-auto pr-1 flex flex-col gap-2">
                 {filteredVendors.length === 0 ? (
                   <div className="py-8 text-center text-zinc-500 text-sm">No vendors found.</div>
                 ) : (
                   filteredVendors.map(vendor => (
                     <div 
                       key={vendor.id}
                       onClick={() => {
                         setSelectedVendor(vendor);
                         setIsSearchFocused(false);
                       }}
                       className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                     >
                       <div className="flex justify-between items-start">
                         <div>
                           <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{vendor.name}</h4>
                           <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">{vendor.averagePrice}</span>
                         </div>
                         <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                           <MapPin size={10} /> {vendor.distance.toFixed(1)} km
                         </div>
                       </div>
                       <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                         {searchQuery && vendor.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ? (
                           <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                             Found: {vendor.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => `${p.name} (₹${p.price})`).join(', ')}
                           </span>
                         ) : (
                           vendor.products.map(p => p.name).join(', ')
                         )}
                       </div>
                       <div className="flex items-center gap-3 mt-1.5">
                         <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                           <Star size={12} fill="currentColor" /> {vendor.rating}
                         </div>
                         <div className="flex items-center text-zinc-400 dark:text-zinc-500 text-xs font-medium">
                           {Array(3).fill(0).map((_, i) => (
                             <IndianRupee key={i} size={10} className={i < (vendor.priceLevel || 1) ? "text-zinc-700 dark:text-zinc-300" : "opacity-30"} />
                           ))}
                         </div>
                       </div>
                       {vendor.saleOffer && (
                         <div className="mt-1 flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wide">
                           <Tag size={10} /> {vendor.saleOffer}
                         </div>
                       )}
                     </div>
                   ))
                 )}
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Area */}
      <div className="flex-1 w-full relative rounded-2xl mt-2">
         <MapView vendors={filteredVendors} onVendorClick={setSelectedVendor} />
         
         {/* Nearby Alert Popup Overlayed on map */}
          <AnimatePresence>
            {alertMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute top-4 left-4 right-4 z-20"
              >
                <div className="bg-zinc-900/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-zinc-800 dark:border-zinc-800 flex items-center gap-3 animate-bounce">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  <span className="font-bold text-white dark:text-zinc-100 text-sm">{alertMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* Bottom Sheet for Vendor Details */}
      {selectedVendor && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedVendor(null)}
          />
          <VendorDetails vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
        </>
      )}
    </div>
  );
};

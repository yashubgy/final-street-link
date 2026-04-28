import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { translations } from '../lib/i18n';
import { VendorDetails } from '../components/VendorDetails';
import { Vendor } from '../types';
import { MapPin, Star, Filter, Banknote, QrCode, CreditCard, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

export const NearbyScreen = () => {
  const { language, vendors, accessibility } = useAppContext();
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const categories = ['all', 'vegetables', 'fruits', 'milk', 'snacks', 'chaat'];
  
  const filteredVendors = vendors
    .filter(v => selectedCategory === 'all' || v.category === selectedCategory)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="h-full w-full flex flex-col pt-safe bg-white dark:bg-zinc-950 pb-20">
      <div className="p-6 pb-2">
        <h1 className={cn("text-2xl font-semibold tracking-tight mb-6", accessibility.highContrast ? "text-black dark:text-white" : "text-zinc-900 dark:text-zinc-100")}>
          {t.nearby}
        </h1>
        
        {/* Categories Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 rounded-full font-medium whitespace-nowrap transition-colors text-zinc-700 dark:text-zinc-300">
             <Filter size={16} strokeWidth={2} /> Filters
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors border",
                selectedCategory === cat 
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100" 
                  : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {t[cat as keyof typeof t] || cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 pt-2">
        {filteredVendors.length === 0 ? (
          <div className="text-center text-zinc-500 font-medium py-10 mt-10">
            {t.no_vendors}
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div 
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                    {vendor.name}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {vendor.type} • <span className="font-semibold text-zinc-700 dark:text-zinc-300">{vendor.averagePrice}</span>
                  </p>
                  {vendor.saleOffer && (
                    <div className="mt-2 flex items-center gap-1.5 w-fit px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                      <Tag size={12} /> {vendor.saleOffer}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-medium mt-1">
                  <MapPin size={12} strokeWidth={2} />
                  {vendor.distance.toFixed(1)} {t.distance_km}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4 mt-3">
                {vendor.paymentMethods?.map(method => (
                  <div key={method} className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                    {method === 'cash' && <Banknote size={12} />}
                    {method === 'upi' && <QrCode size={12} />}
                    {method === 'card' && <CreditCard size={12} />}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 flex-shrink-0 rounded-md">
                  <Star size={14} className="text-amber-400" strokeWidth={2} fill="currentColor" />
                  {vendor.rating}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {vendor.products.slice(0, 3).map(p => p.name).join(', ')}{vendor.products.length > 3 ? '...' : ''}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedVendor && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelectedVendor(null)} />
          <VendorDetails vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
        </>
      )}
    </div>
  );
};

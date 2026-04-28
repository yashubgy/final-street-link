import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { translations } from '../lib/i18n';
import { VendorDetails } from '../components/VendorDetails';
import { Vendor } from '../types';
import { MapPin, Heart, Star } from 'lucide-react';

export const FavoritesScreen = () => {
  const { language, vendors, favorites } = useAppContext();
  const t = translations[language];
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const favoriteVendors = vendors.filter(v => favorites.includes(v.id));

  return (
    <div className="h-full w-full flex flex-col pt-safe bg-white dark:bg-zinc-950 pb-20">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight mb-6 text-zinc-900 dark:text-zinc-100">
          {t.favorites}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 pt-2">
        {favoriteVendors.length === 0 ? (
          <div className="text-center text-zinc-500 font-medium py-10 mt-10">
            <Heart size={40} className="mx-auto mb-4 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth={1.5} />
            <p className="text-sm">{t.no_vendors || "No favorites yet."}</p>
          </div>
        ) : (
          favoriteVendors.map(vendor => (
              <div 
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white dark:bg-zinc-950 p-5 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-5">
                 <Heart size={20} fill="currentColor" stroke="none" className="text-red-500" />
              </div>
              <div className="pr-12 mb-1">
                <h3 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                  {vendor.name}
                </h3>
              </div>
              
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                {vendor.type}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                  <Star size={14} className="text-amber-400" strokeWidth={2} fill="currentColor" />
                  {vendor.rating}
                </div>
                 <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-medium ml-auto">
                  <MapPin size={12} strokeWidth={2} />
                  {vendor.distance.toFixed(1)} {t.distance_km}
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

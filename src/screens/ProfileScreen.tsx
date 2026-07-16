import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { translations } from '../lib/i18n';
import { Check, Settings, Eye, Globe, User, History, ShoppingBag, Package, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Language } from '../types';

export const ProfileScreen = () => {
  const { language, setLanguage, accessibility, updateAccessibility, orders, reorder } = useAppContext();
  const t = translations[language];
  const [keepPrivate, setKeepPrivate] = useState(true);

  const Toggle = ({ label, checked, onChange, icon: Icon }: { label: string, checked: boolean, onChange: (v: boolean) => void, icon?: any }) => (
    <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm mb-3 transition-colors">
      <div className="flex items-center gap-3">
        {Icon && <div className="text-zinc-500 dark:text-zinc-400"><Icon size={20} strokeWidth={2} /></div>}
        <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{label}</span>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-all duration-300 relative border border-white/20 dark:border-zinc-700/50 shadow-inner overflow-hidden",
          checked ? "bg-emerald-500/90 dark:bg-emerald-500/80" : "bg-zinc-200/80 dark:bg-zinc-800/80"
        )}
      >
        <div className={cn(
          "absolute top-[2px] w-5 h-5 bg-white dark:bg-zinc-100 rounded-full shadow-md transition-all duration-300 ease-in-out",
          checked ? "left-[26px]" : "left-[2px]"
        )} />
      </button>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col pt-safe px-6 overflow-y-auto bg-zinc-50 dark:bg-black pb-28">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight mb-8 text-zinc-900 dark:text-zinc-100">
          {t.profile}
        </h1>

        {/* User Details Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 text-xl font-semibold flex-shrink-0">
              MK
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">Yashu Sangwan</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                {keepPrivate ? "+91 98765 43xxx" : "+91 98765 43210"}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {keepPrivate ? "use***@gmail.com" : "user123@gmail.com"}
              </p>
            </div>
          </div>
          
          <Toggle 
            label="Keep contact details private" 
            checked={keepPrivate} 
            onChange={setKeepPrivate} 
          />
        </div>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase">
            <Globe size={16} strokeWidth={2} />
            {t.language}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['en', 'hi'] as Language[]).map(lang => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "p-4 rounded-xl border text-sm font-medium text-center transition-all",
                  language === lang 
                    ? "border-zinc-900 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 dark:border-white" 
                    : "border-zinc-200 bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {lang === 'en' ? 'English' : 'हिंदी'}
                  {language === lang && <Check size={16} strokeWidth={2.5} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase">
            <History size={16} strokeWidth={2} />
            Order History
          </div>
          
          {orders.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <Package className="mx-auto mb-2 text-zinc-300 dark:text-zinc-600" size={32} strokeWidth={1.5} />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No past orders</p>
              <p className="text-xs text-zinc-500 mt-1">Items you check out will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex justify-between items-start mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Order #{order.id.split('-')[1]}</h3>
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                          order.status === 'processing' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          order.status === 'completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">₹{order.totalPrice}</span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400"><span className="font-medium text-zinc-900 dark:text-zinc-300">{item.quantity}x</span> {item.product.name}</span>
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5 text-right w-1/2 line-clamp-1">{item.vendorName}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => reorder(order)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Reorder Items
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-2 mb-4 font-medium text-zinc-500 dark:text-zinc-400 text-xs tracking-wider uppercase">
            <Eye size={16} strokeWidth={2} />
            {t.accessibility}
          </div>
          
          <Toggle 
            label={t.high_contrast} 
            checked={accessibility.highContrast} 
            onChange={(v) => updateAccessibility({ highContrast: v })}
          />
          {/* Text Size Selector */}
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">Text Size</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateAccessibility({ textSize: size })}
                  className={cn(
                    "py-2 rounded-xl text-sm font-medium transition-colors border",
                    accessibility.textSize === size
                      ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                  )}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  <span className="sr-only">{size}</span>
                </button>
              ))}
            </div>
          </div>
          <Toggle 
            label={t.voice_commands} 
            checked={accessibility.voiceCommands} 
            onChange={(v) => updateAccessibility({ voiceCommands: v })}
          />
          <Toggle 
            label={t.tts} 
            checked={accessibility.tts} 
            onChange={(v) => updateAccessibility({ tts: v })}
          />
        </div>
      </div>
    </div>
  );
};

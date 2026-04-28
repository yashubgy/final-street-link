import React from 'react';
import { Home, MapPin, Heart, User } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { translations } from '../lib/i18n';
import { cn } from '../lib/utils';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: Props) => {
  const { language, accessibility } = useAppContext();
  const t = translations[language];

  const navItems = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'nearby', icon: MapPin, label: t.nearby },
    { id: 'favorites', icon: Heart, label: t.favorites },
    { id: 'profile', icon: User, label: t.profile },
  ];

  return (
    <div className="absolute bottom-6 inset-x-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-2 flex justify-around items-center border border-zinc-200 dark:border-zinc-800 shadow-sm z-40">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-all min-w-[72px]",
              isActive 
                ? (accessibility.highContrast ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50")
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
            aria-label={item.label}
          >
            <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "scale-105" : ""} />
            <span className={cn(
              "text-[11px] mt-0.5 font-medium tracking-wide",
              isActive && "font-semibold"
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { HomeScreen } from './screens/HomeScreen';
import { NearbyScreen } from './screens/NearbyScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { BottomNav } from './components/BottomNav';
import { CartSheet } from './components/CartSheet';
import { CartFloatArea } from './components/CartFloatArea';
import { CheckoutModal } from './components/CheckoutModal';
import { cn } from './lib/utils';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { accessibility } = useAppContext();

  // Handle accessibility overrides on the root
  const appClasses = cn(
    "fixed inset-0 w-full h-full flex flex-col font-sans transition-all selection:bg-zinc-200 dark:selection:bg-zinc-800 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 tracking-normal antialiased",
    accessibility.highContrast && "contrast-150 grayscale",
    accessibility.textSize === "xl" ? "text-xl" : accessibility.textSize === "large" ? "text-lg" : "text-base",
  );

  return (
    <div className={appClasses}>
      {!isAuthenticated ? (
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <main className="flex-1 overflow-hidden relative pb-16">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'nearby' && <NearbyScreen />}
            {activeTab === 'favorites' && <FavoritesScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </main>
          {(activeTab === 'home' || activeTab === 'nearby' || activeTab === 'favorites') && <CartFloatArea />}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <CartSheet />
          <CheckoutModal />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}


import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const CheckoutModal = () => {
  const { checkoutModalData, setCheckoutModalData } = useAppContext();

  if (!checkoutModalData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={() => setCheckoutModalData(null)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative border border-zinc-100 dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
        >
          <button
            onClick={() => setCheckoutModalData(null)}
            className="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Order Confirmed!</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
              You may pick up your <span className="font-semibold text-zinc-900 dark:text-zinc-200">{checkoutModalData.categories}</span> in approximately <span className="font-bold text-orange-500 text-lg">{checkoutModalData.waitTimeMinutes} minutes</span>.
            </p>
            
            <button
              onClick={() => setCheckoutModalData(null)}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

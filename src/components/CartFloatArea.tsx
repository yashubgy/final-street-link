import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAppContext } from '../AppContext';

export const CartFloatArea = () => {
  const { cart, setIsCartOpen, getCartTotals } = useAppContext();

  if (cart.length === 0) return null;

  const { total } = getCartTotals();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="absolute bottom-[90px] left-0 right-0 px-4 w-full z-[45] pointer-events-none pb-4">
      <button 
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-between p-4 rounded-2xl shadow-lg transition-transform active:scale-95 border border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {itemCount}
          </div>
          <div className="flex flex-col items-start">
             <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Cart</span>
             <span className="font-bold">₹{total}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          View Cart <ShoppingBag size={18} />
        </div>
      </button>
    </div>
  );
};

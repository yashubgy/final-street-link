import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, AccessibilitySettings, Vendor, CartItem, Order, Product } from "./types";
import { MOCK_VENDORS } from "./lib/mock-data";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  userLocation: { lat: number; lng: number };
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  cart: CartItem[];
  addToCart: (vendor: Vendor, product: Product, variant?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  checkout: () => void;
  reorder: (order: Order) => void;
  orders: Order[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appliedCoupon: string;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<string>>;
  getCartTotals: () => { subtotal: number; discount: number; total: number };
  checkoutModalData: { categories: string; waitTimeMinutes: number } | null;
  setCheckoutModalData: React.Dispatch<React.SetStateAction<{ categories: string; waitTimeMinutes: number } | null>>;
}

const defaultContext: AppContextType = {
  language: "en",
  setLanguage: () => {},
  accessibility: {
    highContrast: false,
    textSize: "normal",
    voiceCommands: false,
    tts: false,
  },
  updateAccessibility: () => {},
  userLocation: { lat: 30.7688, lng: 76.5754 }, // Chandigarh University location
  vendors: [],
  setVendors: () => {},
  favorites: [],
  toggleFavorite: () => {},
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQuantity: () => {},
  checkout: () => {},
  reorder: () => {},
  orders: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  appliedCoupon: "",
  setAppliedCoupon: () => {},
  getCartTotals: () => ({ subtotal: 0, discount: 0, total: 0 }),
  checkoutModalData: null,
  setCheckoutModalData: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(defaultContext.accessibility);
  const [userLocation, setUserLocation] = useState({ lat: 30.7688, lng: 76.5754 }); // Fallback location
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Real-time location tracking
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error watching position", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [checkoutModalData, setCheckoutModalData] = useState<{ categories: string; waitTimeMinutes: number } | null>(null);

  const getCartTotals = () => {
    let subtotal = cart.reduce((acc, item) => {
      const price = (item.selectedVariant && item.product.variantPrices?.[item.selectedVariant]) 
        || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
    let discount = 0;

    // Samosa Deal: 2 Samosas get 1 Tea Free
    const samosaItem = cart.find(c => c.product.name.toLowerCase() === 'samosa');
    const teaItem = cart.find(c => c.product.name.toLowerCase() === 'tea');
    
    if (samosaItem && teaItem) {
      // Find how many Free Teas can be claimed
      // User must buy in multiples of 2 Samosas 
      const freeTeas = Math.floor(samosaItem.quantity / 2);
      // We can only discount if they actually have tea in the cart
      const eligibleFreeTeas = Math.min(freeTeas, teaItem.quantity);
      discount += eligibleFreeTeas * teaItem.product.price;
    }

    // Coupon discount logic
    if (appliedCoupon.toLowerCase() === 'nonu' && subtotal >= 200) {
      discount += (subtotal - discount) * 0.5; // 50% off remaining total
    } else if (appliedCoupon.toUpperCase() === 'GRAB10' && subtotal >= 150) {
      discount += (subtotal - discount) * 0.10;
    } else if (appliedCoupon.toUpperCase() === 'MED25' && subtotal >= 150) {
      discount += (subtotal - discount) * 0.25;
    }

    return { subtotal, discount, total: subtotal - discount };
  };

  // Cart operations
  const addToCart = (vendor: Vendor, product: Product, variant?: string) => {
    setCart((prev) => {
      const variantStr = variant ? `_${variant}` : '';
      const id = `${vendor.id}_${product.name}${variantStr}`;
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, vendorId: vendor.id, vendorName: vendor.name, product, quantity: 1, selectedVariant: variant }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const { total } = getCartTotals();
    const newOrderId = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: [...cart],
      totalPrice: total,
      status: "processing"
    };

    // Calculate wait time and categories
    let maxDistance = 0;
    let maxPrepTime = 0;
    const categorySet = new Set<string>();

    cart.forEach(item => {
      const vendor = vendors.find(v => v.id === item.vendorId);
      if (vendor) {
        // Distance
        maxDistance = Math.max(maxDistance, vendor.distance);
        
        // Prep time based on category
        const prepTimeMap: Record<string, number> = {
          snacks: 15,
          chaat: 10,
          vegetables: 2,
          fruits: 2,
          milk: 0,
          medicine: 5,
          other: 5
        };
        maxPrepTime = Math.max(maxPrepTime, prepTimeMap[vendor.category] || 5);

        // Add category name
        categorySet.add(vendor.category);
      }
    });

    // 1 km walking distance ~= 10-12 mins. Let's do 12 mins per km.
    const walkTimeMins = Math.ceil(maxDistance * 12);
    // Total wait time is max of prep time and walk time, plus buffer.
    const waitTimeMinutes = Math.max(maxPrepTime, walkTimeMins) + 2;
    const categoriesStr = Array.from(categorySet).join(', ');

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon("");
    setIsCartOpen(false);
    
    setCheckoutModalData({
      categories: categoriesStr,
      waitTimeMinutes: waitTimeMinutes
    });

    // Demo: auto-complete order after 20 seconds
    setTimeout(() => {
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === newOrderId ? { ...o, status: "completed" } : o
        )
      );
    }, 20000);
  };

  const reorder = (order: Order) => {
    setCart(prev => {
      let updatedCart = [...prev];
      for (const item of order.items) {
        const existingIdx = updatedCart.findIndex(c => c.id === item.id);
        if (existingIdx > -1) {
          updatedCart[existingIdx] = { ...updatedCart[existingIdx], quantity: updatedCart[existingIdx].quantity + item.quantity };
        } else {
          updatedCart.push({ ...item });
        }
      }
      return updatedCart;
    });
    setIsCartOpen(true);
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  // Simulate real-time updates of vendors
  useEffect(() => {
    const interval = setInterval(() => {
      setVendors(currentVendors => 
        currentVendors.map(vendor => {
          // Only move street vendors, and only with a 30% probability per tick
          if (vendor.vendorType === "street" && Math.random() < 0.3) {
            const latMovement = (Math.random() - 0.5) * 0.001;
            const lngMovement = (Math.random() - 0.5) * 0.001;
            
            // Randomly decrease or increase distance. Bias towards moving closer if they are far.
            const direction = vendor.distance > 0.4 ? -1 : (Math.random() > 0.3 ? -1 : 1);
            const distChange = direction * (0.05 + Math.random() * 0.05);

            return {
              ...vendor,
              lat: vendor.lat + latMovement,
              lng: vendor.lng + lngMovement,
              distance: Math.max(0.05, Math.min(3, vendor.distance + distChange)),
            };
          }
          return vendor;
        })
      );
    }, 35000); // 35 second interval for more realistic movement speed
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      accessibility,
      updateAccessibility,
      userLocation,
      vendors,
      setVendors,
      favorites,
      toggleFavorite,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      checkout,
      reorder,
      orders,
      isCartOpen,
      setIsCartOpen,
      appliedCoupon,
      setAppliedCoupon,
      getCartTotals
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

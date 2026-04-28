export interface Product {
  name: string;
  price: number;
  image?: string;
  variants?: string[];
  variantPrices?: Record<string, number>;
}

export interface CartItem {
  id: string; // vendorId_productName[_variant]
  vendorId: string;
  vendorName: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  status: "processing" | "completed" | "cancelled";
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  vendorType: "street" | "shop";
  category: "vegetables" | "fruits" | "milk" | "snacks" | "chaat" | "medicine" | "other";
  lat: number;
  lng: number;
  distance: number; // in km
  rating: number;
  reviewsCount: number;
  products: Product[];
  lastSeen: string;
  paymentMethods: ("cash" | "upi" | "card")[];
  priceLevel?: number; // 1 = $, 2 = $$, 3 = $$$
  averagePrice: string;
  saleOffer?: string; // Optional field for active sales/discounts
}

export type AccessibilitySettings = {
  highContrast: boolean;
  textSize: "normal" | "large" | "xl";
  voiceCommands: boolean;
  tts: boolean;
};

export type Language = "en" | "hi";

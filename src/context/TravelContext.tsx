import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GDSProviderConfig,
  OrderRecord,
  OrderStatus,
  PricingSettings,
  PromoCode,
  FlightOption,
  Passenger,
  BookingAddons,
} from '../types/travel';
import {
  CURRENCY_RATES,
  INITIAL_ORDERS,
  INITIAL_PRICING,
  INITIAL_PROMO_CODES,
  INITIAL_PROVIDERS,
} from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface TravelContextType {
  // Navigation & View
  currentView: 'book' | 'retrieve' | 'how-it-works' | 'admin';
  setCurrentView: (view: 'book' | 'retrieve' | 'how-it-works' | 'admin') => void;

  // Currency
  currency: string;
  setCurrency: (c: string) => void;
  formatPrice: (amountInUSD: number) => string;

  // Data
  orders: OrderRecord[];
  providers: GDSProviderConfig[];
  pricing: PricingSettings;
  promoCodes: PromoCode[];

  // Active Booking Flow
  bookingStep: number;
  setBookingStep: (step: number) => void;
  selectedFlight: FlightOption | null;
  setSelectedFlight: (f: FlightOption | null) => void;
  passenger: Passenger;
  setPassenger: React.Dispatch<React.SetStateAction<Passenger>>;
  addons: BookingAddons;
  setAddons: React.Dispatch<React.SetStateAction<BookingAddons>>;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  activeOrder: OrderRecord | null;
  setActiveOrder: (order: OrderRecord | null) => void;

  // Order Actions
  createOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, customPnr?: string) => void;
  resendOrderEmail: (orderId: string) => void;
  refundOrder: (orderId: string) => void;
  resyncGds: (orderId: string) => void;

  // Admin Config Actions
  updatePricing: (newPricing: Partial<PricingSettings>) => void;
  addPromoCode: (promo: PromoCode) => void;
  togglePromoCode: (code: string) => void;
  setPrimaryProvider: (providerId: 'duffel' | 'amadeus' | 'sabre') => void;
  testProviderPing: (providerId: string) => Promise<number>;

  // Notification Toast
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Reset Booking Flow
  resetBooking: () => void;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'book' | 'retrieve' | 'how-it-works' | 'admin'>('book');
  const [currency, setCurrency] = useState<string>('USD');

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('expressway_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [providers, setProviders] = useState<GDSProviderConfig[]>(INITIAL_PROVIDERS);
  const [pricing, setPricing] = useState<PricingSettings>(INITIAL_PRICING);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);

  // Active Booking state
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [passenger, setPassenger] = useState<Passenger>({
    firstName: '',
    lastName: '',
    title: 'Mr',
    gender: 'Male',
    dob: '1995-05-15',
    nationality: 'United States',
    passportNumber: '',
    email: '',
    phone: '',
    countryCode: '+1',
  });

  const [addons, setAddons] = useState<BookingAddons>({
    expressDelivery: false,
    extendedValidity14Days: false,
    whatsappSmsDelivery: false,
    prioritySupport: false,
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(orders[0] || null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('expressway_orders', JSON.stringify(orders));
    } catch {
      // ignore localstorage errors
    }
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const formatPrice = (amountInUSD: number): string => {
    const rateInfo = CURRENCY_RATES[currency] || { symbol: '$', rate: 1.0 };
    const converted = amountInUSD * rateInfo.rate;
    return `${rateInfo.symbol}${converted.toFixed(2)}`;
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code.toUpperCase() === cleanCode && p.isActive);
    if (!found) {
      showToast('Invalid or expired promo code', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
    setAppliedPromo(found);
    showToast(`Code "${found.code}" applied! ${found.discountPercent}% OFF`, 'success');
    return { success: true, message: 'Promo code applied' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  const createOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setActiveOrder(order);
    if (appliedPromo) {
      setPromoCodes((prev) =>
        prev.map((p) =>
          p.code === appliedPromo.code ? { ...p, currentUses: p.currentUses + 1 } : p
        )
      );
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, customPnr?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          return {
            ...o,
            status,
            pnr: customPnr ? customPnr : o.pnr,
          };
        }
        return o;
      })
    );
    showToast(`Order ${orderId} updated to ${status}`, 'success');
  };

  const resendOrderEmail = (orderId: string) => {
    const o = orders.find((x) => x.orderId === orderId);
    if (o) {
      showToast(`Itinerary & PNR dispatch re-sent to ${o.passenger.email}`, 'success');
    }
  };

  const refundOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Refunded');
    showToast(`Refund processed for order ${orderId}`, 'info');
  };

  const resyncGds = (orderId: string) => {
    const o = orders.find((x) => x.orderId === orderId);
    if (o) {
      const latency = Math.floor(280 + Math.random() * 200);
      showToast(`GDS synced with ${o.providerUsed} (${latency}ms) — PNR active on CRS`, 'success');
    }
  };

  const updatePricing = (newPricing: Partial<PricingSettings>) => {
    setPricing((prev) => ({ ...prev, ...newPricing }));
    showToast('Pricing engine configuration updated', 'success');
  };

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
    showToast(`Created promo code ${promo.code}`, 'success');
  };

  const togglePromoCode = (code: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === code ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const setPrimaryProvider = (providerId: 'duffel' | 'amadeus' | 'sabre') => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isPrimary: p.id === providerId,
      }))
    );
    showToast(`Primary GDS API router switched to ${providerId.toUpperCase()}`, 'success');
  };

  const testProviderPing = async (providerId: string): Promise<number> => {
    await new Promise((res) => setTimeout(res, 600));
    const latency = Math.floor(220 + Math.random() * 180);
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, latencyMs: latency } : p))
    );
    showToast(`${providerId.toUpperCase()} ping test: ${latency}ms latency`, 'success');
    return latency;
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedFlight(null);
    setAppliedPromo(null);
    setAddons({
      expressDelivery: false,
      extendedValidity14Days: false,
      whatsappSmsDelivery: false,
      prioritySupport: false,
    });
  };

  return (
    <TravelContext.Provider
      value={{
        currentView,
        setCurrentView,
        currency,
        setCurrency,
        formatPrice,
        orders,
        providers,
        pricing,
        promoCodes,
        bookingStep,
        setBookingStep,
        selectedFlight,
        setSelectedFlight,
        passenger,
        setPassenger,
        addons,
        setAddons,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus,
        resendOrderEmail,
        refundOrder,
        resyncGds,
        updatePricing,
        addPromoCode,
        togglePromoCode,
        setPrimaryProvider,
        testProviderPing,
        toast,
        showToast,
        resetBooking,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within TravelProvider');
  }
  return context;
};

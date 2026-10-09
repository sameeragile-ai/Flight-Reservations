export interface Airport {
  iata: string;
  city: string;
  country: string;
  airportName: string;
}

export interface FlightSegment {
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  departureTerminal?: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  arrivalTerminal?: string;
  duration: string;
  aircraft: string;
  cabinClass: string;
  stops: number;
}

export interface FlightOption {
  id: string;
  provider: 'Duffel' | 'Amadeus' | 'Sabre';
  baseSupplierCost: number;
  platformFee: number;
  totalPrice: number;
  currency: string;
  validityHours: number;
  airlineName: string;
  airlineCode: string;
  airlineLogoColor: string;
  segments: FlightSegment[];
  refundable: boolean;
  instantPnr: boolean;
  badge?: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  title: 'Mr' | 'Ms' | 'Mrs' | 'Dr';
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  nationality: string;
  passportNumber?: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface BookingAddons {
  expressDelivery: boolean;
  extendedValidity14Days: boolean;
  whatsappSmsDelivery: boolean;
  prioritySupport: boolean;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Processing'
  | 'Pending'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export interface OrderRecord {
  orderId: string;
  pnr: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  flight: FlightOption;
  passenger: Passenger;
  addons: BookingAddons;
  pricing: {
    basePrice: number;
    platformFee: number;
    addonsTotal: number;
    discount: number;
    total: number;
    currency: string;
    appliedPromo?: string;
  };
  paymentMethod: 'card' | 'apple_pay' | 'crypto';
  providerUsed: 'Duffel' | 'Amadeus' | 'Sabre';
  eTicketNumber: string;
  rawGdsResponse?: {
    gdsPnr: string;
    handshakeLatencyMs: number;
    ticketStock: string;
    agentId: string;
    fareRules: string;
    syncTimestamp: string;
  };
}

export interface GDSProviderConfig {
  id: 'duffel' | 'amadeus' | 'sabre';
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  priority: number;
  latencyMs: number;
  errorRatePercent: number;
  activeRequests: number;
  isPrimary: boolean;
  endpointUrl: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  discountAmount?: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface PricingSettings {
  baseMarkup: number;
  standardPrice: number;
  expressDeliveryFee: number;
  extendedValidityFee: number;
  whatsappFee: number;
  prioritySupportFee: number;
}

import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { FlightOption, OrderRecord } from '../types/travel';
import { generatePnrCode, generateTicketStockNumber } from '../services/flightProvider';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Tag,
  CheckCircle2,
  ArrowLeft,
  Server,
  Zap,
  Check,
  Send,
  Coins,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface CheckoutStepProps {
  flight: FlightOption;
  onPaymentSuccess: (order: OrderRecord) => void;
  onBack: () => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  flight,
  onPaymentSuccess,
  onBack,
}) => {
  const {
    passenger,
    addons,
    pricing,
    formatPrice,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    createOrder,
    providers,
  } = useTravel();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'crypto'>('card');
  const [promoInput, setPromoInput] = useState('');

  // Mock Card Form
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardZip, setCardZip] = useState('94107');

  // Multi-stage processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(0);

  // Pricing calculations
  const basePrice = flight.totalPrice;
  let addonsTotal = 0;
  if (addons.expressDelivery) addonsTotal += pricing.expressDeliveryFee;
  if (addons.extendedValidity14Days) addonsTotal += pricing.extendedValidityFee;
  if (addons.whatsappSmsDelivery) addonsTotal += pricing.whatsappFee;
  if (addons.prioritySupport) addonsTotal += pricing.prioritySupportFee;

  const preDiscountSubtotal = basePrice + addonsTotal;
  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = (preDiscountSubtotal * appliedPromo.discountPercent) / 100;
  }
  const finalTotal = Math.max(0, preDiscountSubtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const executeCheckout = () => {
    setIsProcessing(true);
    setProcessingStage(1); // Stage 1: Payment Verification

    // Stage 1 -> 2
    setTimeout(() => {
      setProcessingStage(2); // Stage 2: GDS API Handshake
    }, 1100);

    // Stage 2 -> 3
    setTimeout(() => {
      setProcessingStage(3); // Stage 3: PNR Generation
    }, 2200);

    // Stage 3 -> 4
    setTimeout(() => {
      setProcessingStage(4); // Stage 4: Email Dispatch & Confirmation
    }, 3200);

    // Finalize
    setTimeout(() => {
      const pnr = generatePnrCode();
      const primaryProvider = providers.find((p) => p.isPrimary)?.name.includes('Amadeus')
        ? 'Amadeus'
        : 'Duffel';
      const orderId = `EXP-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: OrderRecord = {
        orderId,
        pnr,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + (addons.extendedValidity14Days ? 14 : 2) * 24 * 60 * 60 * 1000
        ).toISOString(),
        flight,
        passenger,
        addons,
        pricing: {
          basePrice,
          platformFee: 0,
          addonsTotal,
          discount: discountAmount,
          total: finalTotal,
          currency: 'USD',
          appliedPromo: appliedPromo?.code,
        },
        paymentMethod,
        providerUsed: primaryProvider as any,
        eTicketNumber: generateTicketStockNumber(),
        rawGdsResponse: {
          gdsPnr: pnr.replace('PNR-', ''),
          handshakeLatencyMs: 312,
          ticketStock: '1A-IATA-VERIFIED',
          agentId: 'AGT-EXPRESSWAY-770',
          fareRules: addons.extendedValidity14Days
            ? 'EXTENDED 14D VISA RECORD PENDING TICKET'
            : '48H STANDARD RESERVATION ACTIVE',
          syncTimestamp: new Date().toISOString(),
        },
      };

      createOrder(newOrder);
      setIsProcessing(false);
      onPaymentSuccess(newOrder);
    }, 4200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Flow Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 1. Flight Selected
          </span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 2. Passenger Confirmed
          </span>
          <span className="text-sky-600 font-bold">Step 3: Secure Payment & GDS Handshake</span>
          <span>Step 4: Ticket & PNR</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full w-3/4 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Payment Method & Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Select Payment Method</h2>
                <p className="text-xs text-slate-500">
                  All transactions are 256-bit encrypted with PCI-DSS Level 1 compliance
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>SSL Secured</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                <span className="text-xs block">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold mb-1"> Pay / G-Pay</div>
                <span className="text-xs block">1-Click Express</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-sky-500 bg-sky-50/50 text-sky-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Coins className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                <span className="text-xs block">Crypto (USDT/BTC)</span>
              </button>
            </div>

            {/* Render Payment Method Specific Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Cardholder Information</span>
                  <span>Visa, Mastercard, Amex, Discover</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                    <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      maxLength={4}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Billing ZIP
                    </label>
                    <input
                      type="text"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="bg-slate-50/70 p-6 rounded-xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                  
                </div>
                <div className="font-bold text-sm text-slate-900">Apple Pay Ready</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Complete authorization instantly using Touch ID, Face ID, or your device passcode.
                </p>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Crypto Web3 Settlement:</span>
                  <span className="font-mono text-emerald-600 font-bold">USDT (Polygon/ERC20)</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 break-all select-all">
                  0x71C...B82f9A (Instant Onward Rail Gateway)
                </div>
                <p className="text-[11px] text-slate-500">
                  Zero transaction gas fee subsidy enabled. PNR generates upon single network confirmation.
                </p>
              </div>
            )}

            {/* Promo Code Input Box */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Have a Promo Code or Nomad Voucher?
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold text-emerald-900">{appliedPromo.code}</span>
                      <span className="text-emerald-700 ml-1.5 font-medium">
                        ({appliedPromo.discountPercent}% Discount applied)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-emerald-900 font-bold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. EXPRESS2026 or NOMAD15"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-sky-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price Summary Breakdown & Complete Button (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Order Breakdown
            </h3>

            {/* Passenger Mini Details */}
            <div className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <div className="font-bold text-slate-900">
                {passenger.title} {passenger.firstName} {passenger.lastName}
              </div>
              <div className="text-slate-500 mt-0.5">{passenger.email}</div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-3 mb-3">
              <div className="flex justify-between text-slate-600">
                <span>Flight Reservation:</span>
                <span className="font-mono">{formatPrice(basePrice)}</span>
              </div>

              {addons.expressDelivery && (
                <div className="flex justify-between text-slate-600">
                  <span>Express Priority Delivery:</span>
                  <span className="font-mono">+{formatPrice(pricing.expressDeliveryFee)}</span>
                </div>
              )}

              {addons.extendedValidity14Days && (
                <div className="flex justify-between text-slate-600">
                  <span>Extended 14-Day Validity:</span>
                  <span className="font-mono">+{formatPrice(pricing.extendedValidityFee)}</span>
                </div>
              )}

              {addons.whatsappSmsDelivery && (
                <div className="flex justify-between text-slate-600">
                  <span>WhatsApp & SMS Dispatch:</span>
                  <span className="font-mono">+{formatPrice(pricing.whatsappFee)}</span>
                </div>
              )}

              {addons.prioritySupport && (
                <div className="flex justify-between text-slate-600">
                  <span>24/7 Priority Support:</span>
                  <span className="font-mono">+{formatPrice(pricing.prioritySupportFee)}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount:</span>
                  <span className="font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center text-sm font-bold text-slate-900 mb-5">
              <span>Total Payable:</span>
              <span className="text-xl font-mono text-sky-600">{formatPrice(finalTotal)}</span>
            </div>

            {/* Execute Payment Button */}
            <button
              type="button"
              onClick={executeCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Confirm & Generate Verifiable PNR ({formatPrice(finalTotal)})</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing}
              className="w-full mt-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Passenger Details</span>
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Direct airline reservation token will be provisioned immediately. PDF will be sent to{' '}
              <strong className="text-slate-800">{passenger.email}</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN MULTI-STAGE PROCESSING MODAL */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center relative overflow-hidden">
            {/* Subtle Radiant Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 animate-pulse" />

            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-5 text-sky-600">
              <div className="w-8 h-8 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Securing Flight Reservation
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Please keep this window open while we communicate with airline GDS servers.
            </p>

            {/* Stages Timeline */}
            <div className="space-y-3 text-left">
              {/* Stage 1 */}
              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    processingStage > 1
                      ? 'bg-emerald-500 text-white'
                      : processingStage === 1
                      ? 'bg-sky-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {processingStage > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </div>
                <div className={processingStage >= 1 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                  Verifying payment authorization with banking rail...
                </div>
              </div>

              {/* Stage 2 */}
              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    processingStage > 2
                      ? 'bg-emerald-500 text-white'
                      : processingStage === 2
                      ? 'bg-sky-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {processingStage > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                </div>
                <div className={processingStage >= 2 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                  GDS API Handshake (Amadeus & Duffel Live CRS)...
                </div>
              </div>

              {/* Stage 3 */}
              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    processingStage > 3
                      ? 'bg-emerald-500 text-white'
                      : processingStage === 3
                      ? 'bg-sky-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {processingStage > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
                </div>
                <div className={processingStage >= 3 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                  Provisioning official 6-character airline PNR & seat class...
                </div>
              </div>

              {/* Stage 4 */}
              <div className="flex items-center gap-3 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    processingStage >= 4
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {processingStage >= 4 ? <Check className="w-3.5 h-3.5" /> : '4'}
                </div>
                <div className={processingStage >= 4 ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                  Generating IATA e-ticket PDF & dispatching confirmation...
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

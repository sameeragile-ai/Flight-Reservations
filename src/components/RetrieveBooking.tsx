import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { OrderRecord } from '../types/travel';
import {
  Search,
  Ticket,
  Mail,
  ShieldCheck,
  Download,
  Printer,
  Copy,
  Plane,
  Clock,
  ArrowRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import airportLoungeImg from '../assets/images/airport_lounge_nomad_1791573315210.jpg';

interface RetrieveBookingProps {
  onSelectOrderForTicketView: (order: OrderRecord) => void;
}

export const RetrieveBooking: React.FC<RetrieveBookingProps> = ({
  onSelectOrderForTicketView,
}) => {
  const { orders, showToast, formatPrice, resendOrderEmail } = useTravel();
  const [referenceQuery, setReferenceQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [foundOrder, setFoundOrder] = useState<OrderRecord | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);

    const cleanRef = referenceQuery.trim().toUpperCase().replace('#', '');
    const cleanMail = emailQuery.trim().toLowerCase();

    const matched = orders.find((o) => {
      const matchPnr =
        o.pnr.toUpperCase().includes(cleanRef) ||
        o.pnr.replace('PNR-', '').toUpperCase() === cleanRef ||
        o.orderId.toUpperCase() === cleanRef;
      const matchEmail = o.passenger.email.toLowerCase() === cleanMail;

      return matchPnr && matchEmail;
    });

    if (matched) {
      setFoundOrder(matched);
      showToast('Booking record located successfully!', 'success');
    } else {
      setFoundOrder(null);
      showToast('No booking found matching those details. Check your reference & email.', 'error');
    }
  };

  const handlePresetSelect = (preset: OrderRecord) => {
    setReferenceQuery(preset.pnr.replace('PNR-', ''));
    setEmailQuery(preset.passenger.email);
    setFoundOrder(preset);
    setSearchAttempted(true);
    showToast(`Loaded booking: ${preset.pnr}`, 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-3 border border-sky-100">
          <Ticket className="w-3.5 h-3.5 text-sky-600" />
          <span>Self-Service E-Ticket Retrieval</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Retrieve & Download Your Flight Reservation
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your 6-character PNR or Order Reference and your email address to instantly view, print, or download your official IATA travel voucher.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Retrieval Form & Preset Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Lookup Booking Record
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Instant retrieval from our global distribution records.
            </p>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Booking Reference / PNR / Order Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 78X9A2 or EXP-849201"
                    value={referenceQuery}
                    onChange={(e) => setReferenceQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:border-sky-500 focus:bg-white"
                    required
                  />
                  <Ticket className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Passenger Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. alex.sterling@example.com"
                    value={emailQuery}
                    onChange={(e) => setEmailQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Fetch Electronic Ticket</span>
                </button>
              </div>
            </form>

            {/* Quick Demo Pre-load Links */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Quick Test Lookup Presets:
              </div>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 3).map((ord) => (
                  <button
                    key={ord.orderId}
                    type="button"
                    onClick={() => handlePresetSelect(ord)}
                    className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-colors"
                  >
                    <span className="font-mono font-bold text-sky-700">
                      {ord.pnr.replace('PNR-', '')}
                    </span>
                    <span className="text-slate-500 block text-[10px]">
                      {ord.passenger.lastName} · {ord.flight.segments[0].departureAirport}➔{ord.flight.segments[0].arrivalAirport}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Search Result Card or Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {foundOrder ? (
            <div className="bg-white rounded-3xl border border-sky-300 shadow-xl shadow-sky-500/10 p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {foundOrder.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {foundOrder.orderId}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase text-slate-400">
                  Booking Reference
                </div>
                <div className="text-2xl font-mono font-extrabold text-sky-600 mt-0.5">
                  {foundOrder.pnr.replace('PNR-', '')}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Passenger:</span>
                  <span className="font-bold text-slate-900">
                    {foundOrder.passenger.lastName}, {foundOrder.passenger.firstName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Airline:</span>
                  <span className="font-semibold text-slate-800">
                    {foundOrder.flight.airlineName} ({foundOrder.flight.segments[0].flightNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {foundOrder.flight.segments[0].departureAirport} →{' '}
                    {foundOrder.flight.segments[0].arrivalAirport}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Departure:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(foundOrder.flight.segments[0].departureTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valid Until:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(foundOrder.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectOrderForTicketView(foundOrder)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Open Full Official Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => resendOrderEmail(foundOrder.orderId)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Resend PDF to Email</span>
                </button>
              </div>
            </div>
          ) : searchAttempted ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-xs text-red-700">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="font-bold text-sm mb-1">Record Not Found</div>
              <p>
                Double-check that the email address matches the one used during checkout. If you need assistance, use our operations portal or quick test presets.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-44 relative">
                <img
                  src={airportLoungeImg}
                  alt="Airport lounge traveler checking flight on smartphone"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white text-xs font-semibold">
                  24/7 Global Onward Verification
                </div>
              </div>
              <div className="p-5 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-900">Always Accessible Anywhere</div>
                <p className="leading-relaxed">
                  Lost your email confirmation? You can retrieve your valid onward reservation anytime from any device at passport control or during airline check-in without waiting for support.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { FlightOption } from '../types/travel';
import {
  User,
  Mail,
  Phone,
  Shield,
  Zap,
  Calendar,
  MessageSquare,
  LifeBuoy,
  Check,
  ArrowRight,
  ArrowLeft,
  Plane,
  AlertCircle,
} from 'lucide-react';

interface PassengerDetailsStepProps {
  flight: FlightOption;
  onProceedToCheckout: () => void;
  onBack: () => void;
}

export const PassengerDetailsStep: React.FC<PassengerDetailsStepProps> = ({
  flight,
  onProceedToCheckout,
  onBack,
}) => {
  const {
    passenger,
    setPassenger,
    addons,
    setAddons,
    pricing,
    formatPrice,
    showToast,
  } = useTravel();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!passenger.firstName.trim()) errs.firstName = 'First name is required';
    if (!passenger.lastName.trim()) errs.lastName = 'Last name is required';
    if (!passenger.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!passenger.nationality.trim()) errs.nationality = 'Nationality is required';
    if (!passenger.phone.trim()) errs.phone = 'Phone number is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onProceedToCheckout();
    } else {
      showToast('Please complete required passenger details', 'error');
    }
  };

  // Calculate dynamic subtotal
  const basePrice = flight.totalPrice;
  let addonsTotal = 0;
  if (addons.expressDelivery) addonsTotal += pricing.expressDeliveryFee;
  if (addons.extendedValidity14Days) addonsTotal += pricing.extendedValidityFee;
  if (addons.whatsappSmsDelivery) addonsTotal += pricing.whatsappFee;
  if (addons.prioritySupport) addonsTotal += pricing.prioritySupportFee;

  const subtotal = basePrice + addonsTotal;

  const firstSeg = flight.segments[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 1. Flight Selected
          </span>
          <span className="text-sky-600 font-bold">Step 2: Passenger & Service Customization</span>
          <span>Step 3: Secure Checkout</span>
          <span>Step 4: Ticket & PNR</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full w-2/4 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Passenger Details & Add-ons (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900">Passenger Information</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Enter names exactly as they appear on your international passport. This will be embedded in the airline GDS record.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title, First Name, Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Title
                  </label>
                  <select
                    value={passenger.title}
                    onChange={(e) =>
                      setPassenger({ ...passenger, title: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    First / Given Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alexander"
                    value={passenger.firstName}
                    onChange={(e) =>
                      setPassenger({ ...passenger, firstName: e.target.value })
                    }
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-[10px] text-red-500 mt-1 block">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Last / Family Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sterling"
                    value={passenger.lastName}
                    onChange={(e) =>
                      setPassenger({ ...passenger, lastName: e.target.value })
                    }
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.lastName ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-[10px] text-red-500 mt-1 block">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* Gender, DOB, Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Gender
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) =>
                      setPassenger({ ...passenger, gender: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Unspecified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={passenger.dob}
                    onChange={(e) => setPassenger({ ...passenger, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Passport Nationality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United States"
                    value={passenger.nationality}
                    onChange={(e) =>
                      setPassenger({ ...passenger, nationality: e.target.value })
                    }
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none ${
                      errors.nationality
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-sky-500'
                    }`}
                  />
                  {errors.nationality && (
                    <span className="text-[10px] text-red-500 mt-1 block">
                      {errors.nationality}
                    </span>
                  )}
                </div>
              </div>

              {/* Passport Number (Optional/Recommended) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Passport Number <span className="text-slate-400 font-normal lowercase">(optional for reservation, recommended for Schengen)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. E98124501"
                  value={passenger.passportNumber}
                  onChange={(e) =>
                    setPassenger({ ...passenger, passportNumber: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold font-mono text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address (For Instant Ticket Dispatch) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="alex.traveler@example.com"
                      value={passenger.email}
                      onChange={(e) =>
                        setPassenger({ ...passenger, email: e.target.value })
                      }
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none ${
                        errors.email ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'
                      }`}
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                  {errors.email && (
                    <span className="text-[10px] text-red-500 mt-1 block">{errors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1 415 555 0199"
                      value={passenger.phone}
                      onChange={(e) =>
                        setPassenger({ ...passenger, phone: e.target.value })
                      }
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none ${
                        errors.phone ? 'border-red-500' : 'border-slate-200 focus:border-sky-500'
                      }`}
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                  {errors.phone && (
                    <span className="text-[10px] text-red-500 mt-1 block">{errors.phone}</span>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Service Customization & Add-ons Section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Enhance Your Onward Ticket
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select optional features based on your visa processing or travel urgency.
            </p>

            <div className="space-y-3">
              {/* Addon 1: Express Delivery */}
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  addons.expressDelivery
                    ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.expressDelivery}
                    onChange={(e) =>
                      setAddons({ ...addons, expressDelivery: e.target.checked })
                    }
                    className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Express Priority Generation (&lt; 15 mins)</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        URGENT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Skip standard GDS batch queue. Your reservation is pushed to direct CRS stream in under 15 minutes.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 whitespace-nowrap ml-4">
                  +{formatPrice(pricing.expressDeliveryFee)}
                </span>
              </label>

              {/* Addon 2: Extended 14-day validity */}
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  addons.extendedValidity14Days
                    ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.extendedValidity14Days}
                    onChange={(e) =>
                      setAddons({ ...addons, extendedValidity14Days: e.target.checked })
                    }
                    className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Extended PNR Validity (Up to 14 Days)</span>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                        RECOMMENDED FOR VISAS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Standard holds last 48 hours. Extended validity keeps your airline reservation active up to 14 days for embassy review.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 whitespace-nowrap ml-4">
                  +{formatPrice(pricing.extendedValidityFee)}
                </span>
              </label>

              {/* Addon 3: WhatsApp & SMS Delivery */}
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  addons.whatsappSmsDelivery
                    ? 'border-sky-500 bg-sky-50/40 ring-1 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={addons.whatsappSmsDelivery}
                    onChange={(e) =>
                      setAddons({ ...addons, whatsappSmsDelivery: e.target.checked })
                    }
                    className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Instant WhatsApp & SMS Document Dispatch</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive direct PDF link and PNR credentials instantly on WhatsApp while in line at immigration or boarding gate.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 whitespace-nowrap ml-4">
                  +{formatPrice(pricing.whatsappFee)}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Summary & Proceed Button (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Reservation Summary
            </h3>

            {/* Flight Mini-Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-sky-600" />
                  {flight.airlineName}
                </span>
                <span className="font-mono text-slate-500">{firstSeg.flightNumber}</span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 flex items-center gap-2">
                <span>{firstSeg.departureAirport}</span>
                <span className="text-slate-400 font-normal">➔</span>
                <span>{firstSeg.arrivalAirport}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Departure: {new Date(firstSeg.departureTime).toLocaleDateString()}
              </div>
            </div>

            {/* Price Line Items */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-4 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Base Flight Reservation:</span>
                <span className="font-mono">{formatPrice(basePrice)}</span>
              </div>

              {addons.expressDelivery && (
                <div className="flex justify-between text-slate-600">
                  <span>Express Priority:</span>
                  <span className="font-mono">+{formatPrice(pricing.expressDeliveryFee)}</span>
                </div>
              )}

              {addons.extendedValidity14Days && (
                <div className="flex justify-between text-slate-600">
                  <span>14-Day Extended PNR:</span>
                  <span className="font-mono">+{formatPrice(pricing.extendedValidityFee)}</span>
                </div>
              )}

              {addons.whatsappSmsDelivery && (
                <div className="flex justify-between text-slate-600">
                  <span>WhatsApp Dispatch:</span>
                  <span className="font-mono">+{formatPrice(pricing.whatsappFee)}</span>
                </div>
              )}

              {addons.prioritySupport && (
                <div className="flex justify-between text-slate-600">
                  <span>Priority Support:</span>
                  <span className="font-mono">+{formatPrice(pricing.prioritySupportFee)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-bold text-slate-900 mb-5">
              <span>Subtotal:</span>
              <span className="text-lg font-mono text-sky-600">{formatPrice(subtotal)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Flights</span>
              </button>
            </div>
          </div>

          {/* Safe Travel Guarantee */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Expressway Quality Promise</span>
            </div>
            <p>
              If your reservation is not recognized on the airline's website or app, we immediately issue a 100% refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { POPULAR_AIRPORTS, FAST_PASS_ROUTES } from '../data/mockData';
import { generateFlightsForRoute } from '../services/flightProvider';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Building,
  Route,
  Zap,
} from 'lucide-react';
import heroFlightImg from '../assets/images/hero_flight_wing_1791573301535.jpg';

interface HeroSearchProps {
  onSearchComplete: (flights: any[]) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearchComplete }) => {
  const { pricing, formatPrice } = useTravel();

  // Product Selection Tabs
  const [activeTab, setActiveTab] = useState<'flight' | 'multicity' | 'hotel'>('flight');

  // Search parameters
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-city'>('one-way');
  const [origin, setOrigin] = useState('BKK');
  const [destination, setDestination] = useState('SIN');
  const [departureDate, setDepartureDate] = useState('2026-10-18');
  const [returnDate, setReturnDate] = useState('2026-10-25');

  // Autocomplete state
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');

  // Passenger state
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Multi-city extra leg state
  const [extraLegs, setExtraLegs] = useState([
    { origin: 'SIN', destination: 'DPS', date: '2026-10-22' },
  ]);

  // Hotel booking state (Proof of accommodation tab)
  const [hotelCity, setHotelCity] = useState('Bangkok, Thailand');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-10-18');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-10-25');

  // Loading state
  const [isSearching, setIsSearching] = useState(false);

  const filteredOrigins = POPULAR_AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDests = POPULAR_AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(destQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(destQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(destQuery.toLowerCase())
  );

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleFastPassSelect = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    executeSearch(from, to, tripType);
  };

  const executeSearch = (from: string, to: string, type: 'one-way' | 'round-trip' | 'multi-city') => {
    setIsSearching(true);
    setTimeout(() => {
      const generated = generateFlightsForRoute(
        from,
        to,
        departureDate,
        pricing.standardPrice,
        type,
        returnDate
      );
      setIsSearching(false);
      onSearchComplete(generated);
    }, 450);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(origin, destination, tripType);
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="relative pt-6 pb-12">
      {/* Background Hero Card & Image Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl shadow-blue-900/10 border border-slate-800">
          {/* Hero Image with Scrim Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroFlightImg}
              alt="Expressway commercial airliner soaring at sunset"
              className="w-full h-full object-cover object-center opacity-40 scale-105 transform hover:scale-100 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>GDS Direct Reservation Rail · Amadeus & Duffel Live Node</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
              Instant Verifiable Flight Reservations for Visa & Immigration
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Rent a valid onward flight reservation with authentic airline PNR code in 60 seconds.
              Verifiable directly on airline websites (Emirates, Singapore Airlines, Qatar, etc.) for only{' '}
              <span className="text-white font-bold">{formatPrice(pricing.standardPrice)}</span>.
            </p>

            {/* Quick Proof Metrics Row */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-700/50 pt-5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Genuine Airline PNR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instant PDF & WhatsApp Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Embassy & Airline Check-in Accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Multi-Step Booking Widget */}
        <div className="relative -mt-8 z-20 mx-2 sm:mx-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-5 sm:p-7">
          {/* Product Selection Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('flight')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'flight'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Plane className="w-3.5 h-3.5 text-sky-600" />
                Flight Reservation (Fast PNR)
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('multicity');
                  setTripType('multi-city');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'multicity'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Route className="w-3.5 h-3.5 text-indigo-600" />
                Multi-City Itinerary
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hotel')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'hotel'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                Proof of Accommodation
              </button>
            </div>

            {/* Trip Type Segmented Controls (When on flight tab) */}
            {activeTab === 'flight' && (
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTripType('one-way')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    tripType === 'one-way'
                      ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  One-Way (Most Popular)
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('round-trip')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    tripType === 'round-trip'
                      ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Return / Round-Trip
                </button>
              </div>
            )}
          </div>

          {/* FLIGHT SEARCH FORM */}
          {activeTab !== 'hotel' ? (
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Origin Selector */}
                <div className="md:col-span-3 relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    From (Departure)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOriginDropdown(!showOriginDropdown);
                        setShowDestDropdown(false);
                      }}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 flex items-center justify-between"
                    >
                      <div className="truncate">
                        <span className="font-mono font-bold text-slate-900 text-base mr-2">
                          {origin}
                        </span>
                        <span className="text-xs text-slate-600 truncate">
                          {POPULAR_AIRPORTS.find((a) => a.iata === origin)?.city || origin}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-1">Change</span>
                    </button>

                    {showOriginDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search city or IATA..."
                          value={originQuery}
                          onChange={(e) => setOriginQuery(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-sky-500"
                          autoFocus
                        />
                        <div className="space-y-1">
                          {filteredOrigins.map((a) => (
                            <button
                              key={a.iata}
                              type="button"
                              onClick={() => {
                                setOrigin(a.iata);
                                setShowOriginDropdown(false);
                                setOriginQuery('');
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group"
                            >
                              <div>
                                <span className="font-bold text-slate-900 font-mono mr-2">
                                  {a.iata}
                                </span>
                                <span className="text-slate-600">{a.city}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                                {a.country}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap Airports Button */}
                <div className="hidden md:flex md:col-span-1 justify-center pt-5">
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200/80"
                    title="Swap route directions"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination Selector */}
                <div className="md:col-span-3 relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    To (Destination)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDestDropdown(!showDestDropdown);
                        setShowOriginDropdown(false);
                      }}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 flex items-center justify-between"
                    >
                      <div className="truncate">
                        <span className="font-mono font-bold text-slate-900 text-base mr-2">
                          {destination}
                        </span>
                        <span className="text-xs text-slate-600 truncate">
                          {POPULAR_AIRPORTS.find((a) => a.iata === destination)?.city || destination}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-1">Change</span>
                    </button>

                    {showDestDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search city or IATA..."
                          value={destQuery}
                          onChange={(e) => setDestQuery(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-sky-500"
                          autoFocus
                        />
                        <div className="space-y-1">
                          {filteredDests.map((a) => (
                            <button
                              key={a.iata}
                              type="button"
                              onClick={() => {
                                setDestination(a.iata);
                                setShowDestDropdown(false);
                                setDestQuery('');
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group"
                            >
                              <div>
                                <span className="font-bold text-slate-900 font-mono mr-2">
                                  {a.iata}
                                </span>
                                <span className="text-slate-600">{a.city}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                                {a.country}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Departure Date */}
                <div className={tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Departure Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Return Date (if round-trip) */}
                {tripType === 'round-trip' && (
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Return Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Passenger Selector Button */}
                <div className={tripType === 'round-trip' ? 'md:col-span-1' : 'md:col-span-2'}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Travelers
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPassengerModal(!showPassengerModal)}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 flex items-center justify-between"
                    >
                      <span className="truncate">
                        {totalPassengers} {totalPassengers === 1 ? 'Adult' : 'Pax'}
                      </span>
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {showPassengerModal && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">Adults</div>
                            <div className="text-[10px] text-slate-400">Age 12+</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-mono font-bold">{adults}</span>
                            <button
                              type="button"
                              onClick={() => setAdults(Math.min(9, adults + 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <div>
                            <div className="font-semibold text-slate-900">Children</div>
                            <div className="text-[10px] text-slate-400">Age 2–11</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-mono font-bold">{children}</span>
                            <button
                              type="button"
                              onClick={() => setChildren(Math.min(5, children + 1))}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowPassengerModal(false)}
                            className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-City extra leg builder if on multi-city */}
              {activeTab === 'multicity' && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2">Leg 2 (Connecting Itinerary)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">From</label>
                      <input
                        type="text"
                        value={extraLegs[0]?.origin || 'SIN'}
                        onChange={(e) =>
                          setExtraLegs([{ ...extraLegs[0], origin: e.target.value.toUpperCase() }])
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">To</label>
                      <input
                        type="text"
                        value={extraLegs[0]?.destination || 'DPS'}
                        onChange={(e) =>
                          setExtraLegs([{ ...extraLegs[0], destination: e.target.value.toUpperCase() }])
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Date</label>
                      <input
                        type="date"
                        value={extraLegs[0]?.date || '2026-10-22'}
                        onChange={(e) =>
                          setExtraLegs([{ ...extraLegs[0], date: e.target.value }])
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Search Submit Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Standard reservation holds active for 48 hours · Extension to 14 days available in next step</span>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75 cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Querying GDS Schedules...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Flights & Reserve PNR ({formatPrice(pricing.standardPrice)})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* HOTEL / PROOF OF ACCOMMODATION TAB */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 leading-relaxed">
                <span className="font-bold">Proof of Accommodation:</span> Embassies often require both an onward flight ticket and a confirmed hotel reservation voucher. Generate an authentic, verifiable hotel voucher with booking confirmation code for your visa application.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    City / Destination
                  </label>
                  <input
                    type="text"
                    value={hotelCity}
                    onChange={(e) => setHotelCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => executeSearch('BKK', 'SIN', 'one-way')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  <span>Reserve Hotel Voucher ({formatPrice(pricing.standardPrice)})</span>
                </button>
              </div>
            </div>
          )}

          {/* SPEEDY DIRECT / FAST-PASS POPULAR ONWARD ROUTES */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Speedy Direct Fast-Pass (1-Click Popular Onward Routes)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {FAST_PASS_ROUTES.map((route) => (
                <button
                  key={`${route.origin}-${route.dest}`}
                  type="button"
                  onClick={() => handleFastPassSelect(route.origin, route.dest)}
                  className="text-left p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-sky-300 hover:shadow-sm transition-all group"
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-sky-600 flex items-center justify-between">
                    <span>{route.origin} → {route.dest}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {route.note}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

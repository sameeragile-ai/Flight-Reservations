import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { FlightOption } from '../types/travel';
import {
  Plane,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Filter,
  Sparkles,
  Server,
  Info,
} from 'lucide-react';

interface FlightResultsProps {
  flights: FlightOption[];
  onSelectFlight: (flight: FlightOption) => void;
  onBackToSearch: () => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  onSelectFlight,
  onBackToSearch,
}) => {
  const { formatPrice, providers } = useTravel();
  const [filterDirectOnly, setFilterDirectOnly] = useState(false);
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState('ALL');
  const [selectedProviderFilter, setSelectedProviderFilter] = useState('ALL');

  const uniqueAirlines = Array.from(new Set(flights.map((f) => f.airlineName)));

  const filteredFlights = flights.filter((f) => {
    if (filterDirectOnly && f.segments[0].stops > 0) return false;
    if (selectedAirlineFilter !== 'ALL' && f.airlineName !== selectedAirlineFilter) return false;
    if (selectedProviderFilter !== 'ALL' && f.provider !== selectedProviderFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar / Flow Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="text-sky-600 font-bold">Step 1: Select Flight Itinerary</span>
          <span>Step 2: Passenger & Addons</span>
          <span>Step 3: Secure Checkout</span>
          <span>Step 4: Ticket & PNR</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full w-1/4 rounded-full" />
        </div>
      </div>

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={onBackToSearch}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 mb-1"
          >
            ← Modify Search Criteria
          </button>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Available GDS Flight Reservations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time IATA schedules ready for instant verifiable PNR generation
          </p>
        </div>

        {/* Live Active Provider Indicator */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700">
          <Server className="w-3.5 h-3.5 text-emerald-600" />
          <span>Active GDS Routing:</span>
          <span className="font-bold text-slate-900">
            {providers.find((p) => p.isPrimary)?.name || 'Duffel API'}
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
            CRS SYNC READY
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter Results:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Direct Flights Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={filterDirectOnly}
              onChange={(e) => setFilterDirectOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="font-medium text-slate-700">Direct Non-stop Only</span>
          </label>

          {/* Airline Selector */}
          <select
            value={selectedAirlineFilter}
            onChange={(e) => setSelectedAirlineFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="ALL">All Airlines ({uniqueAirlines.length})</option>
            {uniqueAirlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>

          {/* GDS Provider Filter */}
          <select
            value={selectedProviderFilter}
            onChange={(e) => setSelectedProviderFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="ALL">All GDS Data Rails</option>
            <option value="Duffel">Duffel API</option>
            <option value="Amadeus">Amadeus CRS</option>
            <option value="Sabre">Sabre Rail</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredFlights.length}</span> flight options
        </div>
      </div>

      {/* Flight Cards Grid */}
      <div className="space-y-4">
        {filteredFlights.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-base font-semibold text-slate-700">No flights match the selected filters</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters to view all available routes</p>
            <button
              onClick={() => {
                setFilterDirectOnly(false);
                setSelectedAirlineFilter('ALL');
                setSelectedProviderFilter('ALL');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFlights.map((flight) => {
            const firstSeg = flight.segments[0];
            const hasReturn = flight.segments.length > 1;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-sky-300 transition-all p-5 sm:p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left & Middle: Flight Segments Details (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Airline Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm"
                          style={{ backgroundColor: flight.airlineLogoColor }}
                        >
                          {flight.airlineCode}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{flight.airlineName}</span>
                            <span className="text-xs font-mono text-slate-500">
                              {firstSeg.flightNumber}
                            </span>
                            {flight.badge && (
                              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                                {flight.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {firstSeg.aircraft} · {firstSeg.cabinClass}
                          </div>
                        </div>
                      </div>

                      {/* GDS Provider Source tag */}
                      <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        via {flight.provider} API
                      </div>
                    </div>

                    {/* Outbound Segment Route Visualizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      {/* Departure */}
                      <div className="sm:col-span-2">
                        <div className="text-lg font-bold font-mono text-slate-900">
                          {new Date(firstSeg.departureTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="font-bold text-xs text-slate-700">
                          {firstSeg.departureAirport} · {firstSeg.departureCity}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {firstSeg.departureTerminal || 'Main Concourse'}
                        </div>
                      </div>

                      {/* Duration & Flight Line */}
                      <div className="sm:col-span-3 text-center px-2">
                        <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{firstSeg.duration}</span>
                        </div>
                        <div className="relative flex items-center justify-center">
                          <div className="w-full h-0.5 bg-slate-300" />
                          <Plane className="w-3.5 h-3.5 text-sky-600 absolute bg-slate-50 px-0.5" />
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                          {firstSeg.stops === 0 ? 'Direct Non-stop' : `${firstSeg.stops} Stop`}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="sm:col-span-2 text-left sm:text-right">
                        <div className="text-lg font-bold font-mono text-slate-900">
                          {new Date(firstSeg.arrivalTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="font-bold text-xs text-slate-700">
                          {firstSeg.arrivalAirport} · {firstSeg.arrivalCity}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {firstSeg.arrivalTerminal || 'Terminal 1'}
                        </div>
                      </div>
                    </div>

                    {/* Return Leg (if exists) */}
                    {hasReturn && (
                      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        <div className="sm:col-span-2">
                          <div className="text-xs font-bold text-slate-500 uppercase">Return Flight</div>
                          <div className="text-base font-bold font-mono text-slate-900">
                            {flight.segments[1].departureAirport} → {flight.segments[1].arrivalAirport}
                          </div>
                        </div>
                        <div className="sm:col-span-3 text-center">
                          <span className="text-[11px] text-slate-500">
                            {flight.segments[1].duration} · {flight.segments[1].flightNumber}
                          </span>
                        </div>
                        <div className="sm:col-span-2 sm:text-right">
                          <span className="text-[11px] font-medium text-slate-600">
                            {new Date(flight.segments[1].departureTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Transparent Pricing & Select Button (4 cols) */}
                  <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
                    <div>
                      {/* Transparent Price Breakdown */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 space-y-1 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>GDS Base Cost:</span>
                          <span className="font-mono">{formatPrice(flight.baseSupplierCost)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Expressway Issuance Fee:</span>
                          <span className="font-mono">{formatPrice(flight.platformFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200/80 pt-1 text-sm">
                          <span>Total Reservation:</span>
                          <span className="text-sky-600 font-mono text-base">
                            {formatPrice(flight.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Guarantees */}
                      <div className="space-y-1 text-[11px] text-slate-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Standard 48-hour genuine PNR guarantee</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Verifiable on {flight.airlineName} portal</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectFlight(flight)}
                      className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
                    >
                      <span>Reserve This Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trust & Verification Disclaimer Banner */}
      <div className="mt-8 bg-sky-50/60 border border-sky-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-900">How verification works:</span> When you complete this reservation, ExpresswayTicket connects to global distribution systems (Amadeus/Duffel) to register your passenger record directly with the operating airline. You receive an official 6-character PNR code and IATA-compliant ticket confirmation PDF that will show as "Active/Confirmed" on the airline's official check-in website.
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTravel } from '../context/TravelContext';
import { Plane, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { CURRENCY_RATES } from '../data/mockData';

export const Header: React.FC = () => {
  const { currentView, setCurrentView, currency, setCurrency, resetBooking } = useTravel();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            resetBooking();
            setCurrentView('book');
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Expressway<span className="text-sky-600">Ticket</span>
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              resetBooking();
              setCurrentView('book');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'book'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Book Ticket
          </button>

          <button
            onClick={() => setCurrentView('retrieve')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'retrieve'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Retrieve Booking
          </button>

          <button
            onClick={() => setCurrentView('how-it-works')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'how-it-works'
                ? 'text-sky-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            How It Works
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'admin'
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Operations Admin
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold py-2 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer transition-colors"
              aria-label="Select Currency"
            >
              {Object.keys(CURRENCY_RATES).map((curr) => (
                <option key={curr} value={curr}>
                  {curr} ({CURRENCY_RATES[curr].symbol})
                </option>
              ))}
            </select>
          </div>

          {currentView === 'admin' ? (
            <button
              onClick={() => {
                resetBooking();
                setCurrentView('book');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Customer Portal
            </button>
          ) : (
            <button
              onClick={() => {
                resetBooking();
                setCurrentView('book');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-lg hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Instant PNR
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

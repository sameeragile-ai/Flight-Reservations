import React from 'react';
import { useTravel } from '../context/TravelContext';
import { Plane, ShieldCheck, Mail, Globe, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, resetBooking } = useTravel();

  return (
    <footer className="no-print bg-white border-t border-slate-200/80 text-xs text-slate-500 py-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Expressway<span className="text-sky-600">Ticket</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed text-[11px]">
              ExpresswayTicket is an automated flight reservation and onward ticket booking service.
              We provision real, verifiable flight reservations with authentic PNR codes via direct GDS connections for visas, passport control, and immigration proof of travel.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                256-Bit SSL Encrypted
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                IATA Compliant Rail
              </span>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-bold text-slate-900 text-xs">Customer Services</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => {
                    resetBooking();
                    setCurrentView('book');
                  }}
                  className="hover:text-slate-900 transition-colors"
                >
                  Book Onward Flight
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('retrieve')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Self-Service E-Ticket Retrieval
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('how-it-works')}
                  className="hover:text-slate-900 transition-colors"
                >
                  How It Works & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Operations Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Compliance (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-bold text-slate-900 text-xs">Global Airline Compatibility</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Reservations are registered across global computer reservation systems and accepted by airlines including Emirates, Qatar Airways, Singapore Airlines, British Airways, Air France, Lufthansa, and Delta Air Lines.
            </p>
            <div className="text-[10px] text-slate-400 mt-2">
              Support Desk: support@expresswayticket.com · Active 24/7/365
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 ExpresswayTicket.com. All rights reserved. Registered travel management platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-600 cursor-pointer">Refund Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

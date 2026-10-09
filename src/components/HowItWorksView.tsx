import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Plane,
  ChevronDown,
  ArrowRight,
  FileCheck,
  Globe,
  Lock,
} from 'lucide-react';
import loungeImg from '../assets/images/airport_lounge_nomad_1791573315210.jpg';

export const HowItWorksView: React.FC = () => {
  const { setCurrentView, pricing, formatPrice } = useTravel();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is this an actual verifiable flight reservation?',
      a: 'Yes, 100%. We do not create mock documents or fake flight tickets. Our system queries live airline inventories via GDS networks (Amadeus and Duffel API) and registers your passenger name record directly with the operating airline. You receive an authentic 6-character PNR code that is immediately searchable on the airline’s official website under "Manage Booking".',
    },
    {
      q: 'Will immigration and visa officers accept this for Schengen and other visas?',
      a: 'Yes. Embassies and visa processing centers (VFS Global, TLScontact, BLS) specifically require proof of flight reservation / flight itinerary without requiring you to purchase an expensive non-refundable ticket prior to visa approval. Embassies verify the booking reference on the airline system, where your reservation will appear as "Active / Confirmed".',
    },
    {
      q: 'How long does the reservation stay valid?',
      a: 'Standard reservations stay valid for 48 hours. If you are applying for an embassy visa that takes several days to process, you can select our "Extended 14-Day Validity" option during checkout to maintain the active PNR hold for up to 14 days.',
    },
    {
      q: 'What happens after the validity expires?',
      a: 'After the validity period elapses, the reservation is automatically cancelled by the airline reservation system. You will never be charged for the actual flight ticket, and no cancellation fees apply.',
    },
    {
      q: 'Can I check in or board the flight with this reservation?',
      a: 'No. This is a flight reservation hold intended specifically as proof of onward travel, visa application support, and entry clearance. If you wish to board the plane, you must purchase a full ticket directly from the airline.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-3 border border-sky-100">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>Verifiable Onward Travel Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How ExpresswayTicket Works
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          Avoid paying thousands of dollars for non-refundable international flights just to satisfy immigration rules. We hold genuine airline reservations for you in under 60 seconds.
        </p>
      </div>

      {/* 3 Step Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold text-base">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-900">Select Your Route</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pick your origin, destination, and travel date—or use our 1-click popular onward routes (e.g. Bangkok to Singapore, Bali to Kuala Lumpur).
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-base">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-900">GDS Airline Hold</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our automated engine registers your passenger record with Amadeus/Duffel CRS, generating an official 6-character PNR code and ticket stock voucher.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-base">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-900">Download & Verify</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Receive your printable IATA e-ticket PDF instantly via email and WhatsApp. Verify it anytime directly on the airline’s official website.
          </p>
        </div>
      </div>

      {/* Comparison: Fake Ticket vs ExpresswayTicket */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
          Genuine GDS Reservation vs. Dangerous "Fake" Tickets
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6 max-w-xl mx-auto">
          Immigration and airline gate agents now routinely scan barcodes and cross-check PNR codes on airline reservation terminals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Fake PDF Generators (High Risk)</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Just an edited PDF document with non-existent booking numbers</li>
              <li>Fails immediately when immigration checks the airline website</li>
              <li>Can result in boarding denial, visa rejection, or airport fines</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ExpresswayTicket (100% Genuine)</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Real reservation booked through IATA-certified travel rails</li>
              <li>Searchable and verifiable on the airline’s own website</li>
              <li>Accepted by all embassies, airlines, and border control agencies</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-sky-600' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl shadow-blue-500/20">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to Secure Your Onward Ticket?</h2>
        <p className="text-sm text-sky-100 mt-2 max-w-xl mx-auto">
          Generate an authentic flight reservation with live PNR code in less than 60 seconds for just{' '}
          <strong>{formatPrice(pricing.standardPrice)}</strong>.
        </p>
        <button
          onClick={() => setCurrentView('book')}
          className="mt-6 px-8 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs shadow-lg inline-flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
        >
          <span>Book Onward Flight Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

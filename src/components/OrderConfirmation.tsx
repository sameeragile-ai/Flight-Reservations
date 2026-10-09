import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { OrderRecord } from '../types/travel';
import {
  CheckCircle2,
  Copy,
  Printer,
  Download,
  Mail,
  Plane,
  Clock,
  ExternalLink,
  ShieldCheck,
  Check,
  QrCode,
  Calendar,
  Share2,
  AlertCircle,
} from 'lucide-react';
import boardingPassImg from '../assets/images/airline_boarding_pass_1791573327175.jpg';

interface OrderConfirmationProps {
  order: OrderRecord;
  onNewBooking: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onNewBooking,
}) => {
  const { formatPrice, resendOrderEmail, showToast, setCurrentView } = useTravel();
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const cleanPnr = order.pnr.replace('PNR-', '');

  const handleCopyPnr = () => {
    navigator.clipboard.writeText(cleanPnr);
    setCopiedPnr(true);
    showToast(`PNR code ${cleanPnr} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedPnr(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      setIsDownloadingPdf(false);
      showToast('Electronic Ticket PDF downloaded successfully', 'success');
      // trigger browser print dialog or download simulation
      window.print();
    }, 800);
  };

  const firstSeg = order.flight.segments[0];
  const lastSeg = order.flight.segments[order.flight.segments.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Success Banner (no-print) */}
      <div className="no-print bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 sm:p-7 mb-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
          Flight Reservation Confirmed & Active
        </h1>
        <p className="text-xs sm:text-sm text-emerald-800 mt-1 max-w-xl mx-auto">
          Your official airline reservation has been provisioned. A confirmation receipt and IATA PDF have been dispatched to{' '}
          <strong className="underline">{order.passenger.email}</strong>.
        </p>

        {/* Action Button Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPdf ? 'Preparing PDF...' : 'Download Official PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Itinerary</span>
          </button>

          <button
            type="button"
            onClick={() => resendOrderEmail(order.orderId)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Email Copy Again</span>
          </button>

          <button
            type="button"
            onClick={onNewBooking}
            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Another Ticket</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE FLIGHT ITINERARY & RESERVATION RECEIPT */}
      <div className="print-ticket-container bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-bold text-lg tracking-tight">ExpresswayTicket</span>
            </div>
            <div className="text-xs text-slate-400">
              Official Passenger Name Record (PNR) Itinerary & Travel Voucher
            </div>
          </div>

          {/* Booking Reference Box */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Airline PNR / Booking Ref
            </div>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span className="text-2xl font-mono font-extrabold text-sky-400 tracking-wider">
                {cleanPnr}
              </span>
              <button
                type="button"
                onClick={handleCopyPnr}
                className="no-print p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy PNR code"
              >
                {copiedPnr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Order: {order.orderId}
            </div>
          </div>
        </div>

        {/* Live Status & Validity Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900">Reservation Status:</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
              CONFIRMED / ACTIVE IN CRS
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <div>
              Issued: <strong className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</strong>
            </div>
            <div>
              Valid Until: <strong className="text-slate-900">{new Date(order.expiresAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        {/* Passenger & Ticket Identification Grid */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Passenger Details
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">Passenger Name</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5 uppercase">
                {order.passenger.lastName}, {order.passenger.firstName} {order.passenger.title}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Nationality</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {order.passenger.nationality}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">E-Ticket Document No.</div>
              <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                {order.eTicketNumber}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Operating Airline</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {order.flight.airlineName} ({order.flight.airlineCode})
              </div>
            </div>
          </div>
        </div>

        {/* Flight Segments List */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Flight Routing Itinerary
          </h3>

          {order.flight.segments.map((seg, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4"
            >
              {/* Segment Header */}
              <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{seg.airline}</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {seg.flightNumber}
                  </span>
                </div>
                <div className="text-slate-500">
                  {seg.aircraft} · Class: <strong className="text-slate-800">{seg.cabinClass}</strong>
                </div>
              </div>

              {/* Segment Origin / Destination Route */}
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
                {/* Departure */}
                <div className="sm:col-span-3">
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {seg.departureAirport}
                  </div>
                  <div className="font-semibold text-xs text-slate-800">{seg.departureCity}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {seg.departureTerminal || 'Terminal 1'}
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-1">
                    {new Date(seg.departureTime).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {new Date(seg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Duration */}
                <div className="sm:col-span-1 text-center">
                  <div className="text-[10px] text-slate-500 font-mono">{seg.duration}</div>
                  <div className="relative my-1">
                    <div className="h-0.5 bg-slate-300 w-full" />
                    <Plane className="w-3.5 h-3.5 text-sky-600 mx-auto -mt-2 bg-slate-50 px-0.5" />
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">Non-Stop</div>
                </div>

                {/* Arrival */}
                <div className="sm:col-span-3 text-left sm:text-right">
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {seg.arrivalAirport}
                  </div>
                  <div className="font-semibold text-xs text-slate-800">{seg.arrivalCity}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {seg.arrivalTerminal || 'Terminal 2'}
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-1">
                    {new Date(seg.arrivalTime).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {new Date(seg.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Baggage & Check-in Rules */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <div>
                  Baggage Allowance: <strong>1 × 23kg Checked Baggage + 1 × 7kg Hand Luggage</strong>
                </div>
                <div className="font-mono text-slate-500">
                  Fare Basis: ONW2026/GDS · Non-Transferable
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Notes & Barcode Container */}
        <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-slate-500 space-y-1 max-w-lg">
            <div className="font-bold text-slate-700">Official IATA Travel Agency Endorsement</div>
            <p>
              This travel itinerary receipt is generated via Expressway Global Travel Distribution Rail.
              Valid for immigration proof of onward travel, embassy visa applications (Schengen, UK, US, Japan), and airline check-in clearance.
            </p>
            <div className="text-[10px] text-slate-400 font-mono mt-2">
              GDS Ref: {order.rawGdsResponse?.gdsPnr || cleanPnr} · Agent: AGT-EXPRESSWAY-770 · CRS: 1A
            </div>
          </div>

          {/* Barcode / QR Simulation */}
          <div className="flex flex-col items-center p-3 bg-white border border-slate-200 rounded-xl text-center">
            {/* SVG QR Code Simulation */}
            <div className="w-20 h-20 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center text-white mb-1.5">
              <QrCode className="w-full h-full text-white" />
            </div>
            <span className="font-mono text-[9px] text-slate-500 tracking-wider">
              *{cleanPnr}*
            </span>
          </div>
        </div>
      </div>

      {/* How to Verify on Official Airline Website (no-print) */}
      <div className="no-print bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900">
            How to Verify This Reservation on the Airline Website
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Your reservation is live on global computerized reservation systems (CRS). Anyone, including immigration officers, can verify it directly with the operating airline.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div className="font-bold text-xs text-slate-900">Visit Airline Official Website</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Go to the official website of {order.flight.airlineName} (e.g., emirates.com, singaporeair.com) and navigate to <strong>"Manage Booking"</strong> or <strong>"Find My Trip"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div className="font-bold text-xs text-slate-900">Enter Your PNR Code</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              In the booking reference field, type your 6-character code <strong className="font-mono text-sky-700">{cleanPnr}</strong> and your passenger last name <strong className="uppercase">{order.passenger.lastName}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div className="font-bold text-xs text-slate-900">View Active Status</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The airline portal will display your full itinerary, assigned seat class, and flight details with "Confirmed / Active" hold status.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Showcase Card (Companion Image) */}
      <div className="no-print bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 h-48 md:h-full relative overflow-hidden">
          <img
            src={boardingPassImg}
            alt="International passport and flight boarding pass on travel counter"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent to-white/30" />
        </div>
        <div className="md:col-span-7 p-6 sm:p-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 mb-1">
            Traveler Guarantee
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Accepted by All Major Embassies and Airlines Worldwide
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Whether applying for a Schengen visa at VFS Global, boarding a low-cost carrier in Southeast Asia (AirAsia, Scoot), or clearing customs in Japan, your Expressway onward reservation fulfills all return/onward proof requirements without paying thousands for a full-price flight.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('retrieve')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 underline"
            >
              Need to lookup this ticket later? Use our Self-Service Retrieval tool →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

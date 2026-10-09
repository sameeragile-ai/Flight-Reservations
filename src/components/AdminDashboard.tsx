import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { OrderRecord, OrderStatus, PromoCode } from '../types/travel';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Server,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Mail,
  RotateCcw,
  Edit,
  Sliders,
  Tag,
  Code,
  X,
  Plus,
  Radio,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    providers,
    pricing,
    updatePricing,
    promoCodes,
    addPromoCode,
    togglePromoCode,
    setPrimaryProvider,
    testProviderPing,
    updateOrderStatus,
    resendOrderEmail,
    refundOrder,
    resyncGds,
    formatPrice,
    showToast,
  } = useTravel();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'pricing' | 'gds'>('orders');

  // Order filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Selected Order Drawer / Modal
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<OrderRecord | null>(null);
  const [overridePnrInput, setOverridePnrInput] = useState('');
  const [isEditingPnr, setIsEditingPnr] = useState(false);
  const [showRawLogs, setShowRawLogs] = useState(false);

  // Pricing engine form state
  const [retailPriceInput, setRetailPriceInput] = useState(pricing.standardPrice);
  const [expressFeeInput, setExpressFeeInput] = useState(pricing.expressDeliveryFee);
  const [extendedFeeInput, setExtendedFeeInput] = useState(pricing.extendedValidityFee);
  const [whatsappFeeInput, setWhatsappFeeInput] = useState(pricing.whatsappFee);

  // New Promo Code Form Modal
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState(15);
  const [newPromoMaxUses, setNewPromoMaxUses] = useState(100);

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => {
    return o.status !== 'Refunded' && o.status !== 'Cancelled' ? sum + o.pricing.total : sum;
  }, 0);

  const totalBookings = orders.length;
  const confirmedBookings = orders.filter((o) => o.status === 'Confirmed').length;
  const avgProcessingTime = '418ms';
  const conversionRate = '14.8%';
  const primaryProvider = providers.find((p) => p.isPrimary) || providers[0];

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const pnrMatch = o.pnr.toLowerCase().includes(q);
      const nameMatch = `${o.passenger.firstName} ${o.passenger.lastName}`.toLowerCase().includes(q);
      const emailMatch = o.passenger.email.toLowerCase().includes(q);
      const orderIdMatch = o.orderId.toLowerCase().includes(q);
      return pnrMatch || nameMatch || emailMatch || orderIdMatch;
    }
    return true;
  });

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing({
      standardPrice: Number(retailPriceInput),
      expressDeliveryFee: Number(expressFeeInput),
      extendedValidityFee: Number(extendedFeeInput),
      whatsappFee: Number(whatsappFeeInput),
    });
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const promo: PromoCode = {
      code: newPromoCode.trim().toUpperCase(),
      discountPercent: Number(newPromoDiscount),
      maxUses: Number(newPromoMaxUses),
      currentUses: 0,
      expiresAt: '2026-12-31',
      isActive: true,
    };
    addPromoCode(promo);
    setShowPromoModal(false);
    setNewPromoCode('');
  };

  const handleSavePnrOverride = () => {
    if (selectedOrderForDrawer && overridePnrInput.trim()) {
      updateOrderStatus(selectedOrderForDrawer.orderId, 'Confirmed', `PNR-${overridePnrInput.trim().toUpperCase()}`);
      setSelectedOrderForDrawer({
        ...selectedOrderForDrawer,
        pnr: `PNR-${overridePnrInput.trim().toUpperCase()}`,
        status: 'Confirmed',
      });
      setIsEditingPnr(false);
      setOverridePnrInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Operations & Distribution Terminal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ExpresswayTicket Admin Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time GDS order routing, computerized reservation sync, markups, and provider health.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'orders'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Order Management ({orders.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('pricing')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'pricing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pricing & Markups
          </button>

          <button
            onClick={() => setActiveAdminTab('gds')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeAdminTab === 'gds'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-GDS Router
          </button>
        </div>
      </div>

      {/* REAL-TIME METRICS PANEL */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Gross Revenue
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.8% vs last week</span>
          </div>
        </div>

        {/* Total Reservations */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Total Bookings
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {totalBookings}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {confirmedBookings} active PNRs
          </div>
        </div>

        {/* Active Provider */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Primary GDS Rail
          </div>
          <div className="text-sm sm:text-base font-extrabold text-indigo-700 truncate">
            {primaryProvider.name}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational (100% Up)</span>
          </div>
        </div>

        {/* Avg Processing Latency */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            GDS PNR Latency
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {primaryProvider.latencyMs}ms
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Avg handshake speed
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Funnel Conversion
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {conversionRate}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Search to completed PNR
          </div>
        </div>
      </div>

      {/* TAB 1: ORDER MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by PNR, passenger, email, order..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto">
              <span className="font-bold text-slate-600 whitespace-nowrap">Status:</span>
              {['ALL', 'Confirmed', 'Processing', 'Pending', 'Failed', 'Cancelled', 'Refunded'].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                      orderStatusFilter === status
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Airline PNR</th>
                    <th className="py-3 px-4">Passenger</th>
                    <th className="py-3 px-4">Flight Route</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        No orders match your search parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                          <div>{ord.orderId}</div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-sky-600 text-sm">
                            {ord.pnr.replace('PNR-', '')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {ord.passenger.lastName}, {ord.passenger.firstName}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {ord.passenger.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-800">
                            {ord.flight.segments[0].departureAirport} ➔{' '}
                            {ord.flight.segments[0].arrivalAirport}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {ord.flight.airlineName} ({ord.flight.segments[0].flightNumber})
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Processing'
                                ? 'bg-sky-100 text-sky-800'
                                : ord.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : ord.status === 'Refunded'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {ord.providerUsed}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatPrice(ord.pricing.total)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForDrawer(ord)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>Manage</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING & MARKUP ENGINE */}
      {activeAdminTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Base Markup Config (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-sky-600" />
                <h2 className="text-lg font-bold text-slate-900">Base Markup & Fee Rules</h2>
              </div>
              <p className="text-xs text-slate-500">
                Supplier cost from GDS is fixed at $5.00. Retail pricing adjusts your platform gross margin.
              </p>
            </div>

            <form onSubmit={handleSavePricing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standard Onward Ticket Retail Price (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.50"
                    value={retailPriceInput}
                    onChange={(e) => setRetailPriceInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                  <div className="text-xs text-slate-500 whitespace-nowrap">
                    Margin: ${(Number(retailPriceInput) - 5.0).toFixed(2)} / ticket
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Express Fee
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={expressFeeInput}
                    onChange={(e) => setExpressFeeInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    14-Day Extension
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={extendedFeeInput}
                    onChange={(e) => setExtendedFeeInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    WhatsApp Fee
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    value={whatsappFeeInput}
                    onChange={(e) => setWhatsappFeeInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Markup Parameters
                </button>
              </div>
            </form>
          </div>

          {/* Promo Code Engine (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900">Nomad & Partner Promo Codes</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Manage conversion discounts and influencer redemption limits.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPromoModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Code</span>
              </button>
            </div>

            <div className="space-y-3">
              {promoCodes.map((promo) => (
                <div
                  key={promo.code}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {promo.code}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {promo.discountPercent}% OFF
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Used: {promo.currentUses} / {promo.maxUses} times · Expires {promo.expiresAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePromoCode(promo.code)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                        promo.isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {promo.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-GDS / TRAVEL API ROUTER CONFIG */}
      {activeAdminTab === 'gds' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Multi-GDS Dynamic Failover Router
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Primary requests are dispatched to Primary Provider. If connection fails or latency exceeds 1,200ms, fallback automatically cascades.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    p.isPrimary
                      ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                    {p.isPrimary ? (
                      <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                        PRIMARY
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        STANDBY #{p.priority}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Status:</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Live Response Time:</span>
                      <span className="font-mono font-bold text-slate-900">{p.latencyMs}ms</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Error Rate:</span>
                      <span className="font-mono text-slate-900">{p.errorRatePercent}%</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Active Queued:</span>
                      <span className="font-mono text-slate-900">{p.activeRequests} reqs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => testProviderPing(p.id)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Activity className="w-3 h-3 text-slate-500" />
                      <span>Ping</span>
                    </button>

                    {!p.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryProvider(p.id as any)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTION DRAWER / MODAL FOR SELECTED ORDER */}
      {selectedOrderForDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase">Order Operations</div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedOrderForDrawer.orderId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForDrawer(null);
                  setIsEditingPnr(false);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PNR & Status Row */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Current PNR</div>
                  <div className="text-2xl font-mono font-extrabold text-sky-600">
                    {selectedOrderForDrawer.pnr.replace('PNR-', '')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Status</div>
                  <div className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {selectedOrderForDrawer.status}
                  </div>
                </div>
              </div>

              {/* Manual PNR Override Section */}
              {isEditingPnr ? (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Enter Custom Airline PNR Override:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 99X8K2"
                      value={overridePnrInput}
                      onChange={(e) => setOverridePnrInput(e.target.value.toUpperCase())}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold uppercase flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleSavePnrOverride}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                    >
                      Save Override
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPnr(false)}
                      className="px-2 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingPnr(true)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Manual PNR Override</span>
                </button>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Execution Triggers:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => resyncGds(selectedOrderForDrawer.orderId)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 flex items-center gap-2 justify-center"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trigger GDS Re-Sync</span>
                </button>

                <button
                  type="button"
                  onClick={() => resendOrderEmail(selectedOrderForDrawer.orderId)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 flex items-center gap-2 justify-center"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Resend Confirmation Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => refundOrder(selectedOrderForDrawer.orderId)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl font-semibold text-rose-700 flex items-center gap-2 justify-center col-span-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Issue Full Refund ({formatPrice(selectedOrderForDrawer.pricing.total)})</span>
                </button>
              </div>
            </div>

            {/* Passenger & Flight Details */}
            <div className="border-t border-slate-200 pt-4 space-y-3 text-xs">
              <div className="font-bold text-slate-900">Passenger Information</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div>
                  Name: <strong className="text-slate-800">{selectedOrderForDrawer.passenger.lastName}, {selectedOrderForDrawer.passenger.firstName}</strong>
                </div>
                <div>
                  Email: <strong className="text-slate-800">{selectedOrderForDrawer.passenger.email}</strong>
                </div>
                <div>
                  Nationality: <strong className="text-slate-800">{selectedOrderForDrawer.passenger.nationality}</strong>
                </div>
                <div>
                  Passport: <strong className="font-mono text-slate-800">{selectedOrderForDrawer.passenger.passportNumber || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Raw GDS API Logs Viewer */}
            <div className="border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowRawLogs(!showRawLogs)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 p-2 rounded-lg bg-slate-100"
              >
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-slate-500" />
                  <span>Raw GDS Handshake JSON Payload</span>
                </span>
                <span>{showRawLogs ? '▲ Hide' : '▼ View Payload'}</span>
              </button>

              {showRawLogs && (
                <div className="mt-2 bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56">
                  <pre>{JSON.stringify(selectedOrderForDrawer, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW PROMO CODE MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create Promo Code</h3>
              <button
                type="button"
                onClick={() => setShowPromoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. BALINOMAD20"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={newPromoDiscount}
                  onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Max Redemptions
                </label>
                <input
                  type="number"
                  min="1"
                  value={newPromoMaxUses}
                  onChange={(e) => setNewPromoMaxUses(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

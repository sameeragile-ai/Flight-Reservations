import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FlightResults } from './components/FlightResults';
import { PassengerDetailsStep } from './components/PassengerDetailsStep';
import { CheckoutStep } from './components/CheckoutStep';
import { OrderConfirmation } from './components/OrderConfirmation';
import { RetrieveBooking } from './components/RetrieveBooking';
import { HowItWorksView } from './components/HowItWorksView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { FlightOption, OrderRecord } from './types/travel';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    bookingStep,
    setBookingStep,
    selectedFlight,
    setSelectedFlight,
    activeOrder,
    setActiveOrder,
    resetBooking,
  } = useTravel();

  const [searchResults, setSearchResults] = useState<FlightOption[] | null>(null);

  const handleSearchComplete = (flights: FlightOption[]) => {
    setSearchResults(flights);
  };

  const handleSelectFlight = (flight: FlightOption) => {
    setSelectedFlight(flight);
    setBookingStep(2); // Move to Passenger details
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setBookingStep(3); // Move to Payment & GDS Handshake
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (order: OrderRecord) => {
    setActiveOrder(order);
    setBookingStep(4); // Move to Order confirmation & e-ticket
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewBooking = () => {
    resetBooking();
    setSearchResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrderForTicketView = (order: OrderRecord) => {
    setActiveOrder(order);
    setSelectedFlight(order.flight);
    setBookingStep(4);
    setCurrentView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* VIEW 1: BOOKING FLOW */}
        {currentView === 'book' && (
          <>
            {/* Step 1: Search & Results */}
            {bookingStep === 1 && (
              <>
                <HeroSearch onSearchComplete={handleSearchComplete} />
                {searchResults && (
                  <FlightResults
                    flights={searchResults}
                    onSelectFlight={handleSelectFlight}
                    onBackToSearch={() => setSearchResults(null)}
                  />
                )}
              </>
            )}

            {/* Step 2: Passenger Details & Addons */}
            {bookingStep === 2 && selectedFlight && (
              <PassengerDetailsStep
                flight={selectedFlight}
                onProceedToCheckout={handleProceedToCheckout}
                onBack={() => setBookingStep(1)}
              />
            )}

            {/* Step 3: Checkout & GDS Handshake */}
            {bookingStep === 3 && selectedFlight && (
              <CheckoutStep
                flight={selectedFlight}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setBookingStep(2)}
              />
            )}

            {/* Step 4: Official E-Ticket Confirmation */}
            {bookingStep === 4 && activeOrder && (
              <OrderConfirmation
                order={activeOrder}
                onNewBooking={handleNewBooking}
              />
            )}
          </>
        )}

        {/* VIEW 2: SELF-SERVICE RETRIEVAL */}
        {currentView === 'retrieve' && (
          <RetrieveBooking
            onSelectOrderForTicketView={handleSelectOrderForTicketView}
          />
        )}

        {/* VIEW 3: HOW IT WORKS & FAQS */}
        {currentView === 'how-it-works' && <HowItWorksView />}

        {/* VIEW 4: ADMIN OPERATIONS DASHBOARD */}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <MainAppContent />
    </TravelProvider>
  );
}

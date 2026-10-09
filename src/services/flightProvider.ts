import { FlightOption, FlightSegment } from '../types/travel';
import { POPULAR_AIRPORTS } from '../data/mockData';

const AIRLINE_CATALOG = [
  { name: 'Emirates', code: 'EK', logoColor: '#D71921', aircraft: 'Boeing 777-300ER', cabin: 'Economy (V)' },
  { name: 'Singapore Airlines', code: 'SQ', logoColor: '#00266B', aircraft: 'Airbus A350-900', cabin: 'Economy (M)' },
  { name: 'Qatar Airways', code: 'QR', logoColor: '#5C0632', aircraft: 'Boeing 787-9 Dreamliner', cabin: 'Economy (O)' },
  { name: 'British Airways', code: 'BA', logoColor: '#075AAA', aircraft: 'Airbus A320neo', cabin: 'Euro Traveller (S)' },
  { name: 'Lufthansa', code: 'LH', logoColor: '#05164D', aircraft: 'Airbus A321', cabin: 'Economy Classic (Q)' },
  { name: 'Turkish Airlines', code: 'TK', logoColor: '#C70826', aircraft: 'Airbus A330-300', cabin: 'Economy Semi-Flexible (L)' },
  { name: 'Cathay Pacific', code: 'CX', logoColor: '#006564', aircraft: 'Airbus A350-1000', cabin: 'Economy Standard (H)' },
  { name: 'Delta Air Lines', code: 'DL', logoColor: '#003A70', aircraft: 'Airbus A330neo', cabin: 'Main Cabin (X)' },
  { name: 'Air France', code: 'AF', logoColor: '#002157', aircraft: 'Boeing 777-200', cabin: 'Economy Standard (R)' },
  { name: 'Malaysia Airlines', code: 'MH', logoColor: '#003399', aircraft: 'Boeing 737-800', cabin: 'Economy (K)' },
];

export function generateFlightsForRoute(
  originIata: string,
  destIata: string,
  departureDate: string,
  baseTicketPrice: number = 14.99,
  tripType: 'one-way' | 'round-trip' | 'multi-city' = 'one-way',
  returnDate?: string
): FlightOption[] {
  const originAirport = POPULAR_AIRPORTS.find((a) => a.iata === originIata) || {
    iata: originIata,
    city: originIata,
    country: 'International',
    airportName: `${originIata} Airport`,
  };
  const destAirport = POPULAR_AIRPORTS.find((a) => a.iata === destIata) || {
    iata: destIata,
    city: destIata,
    country: 'International',
    airportName: `${destIata} Airport`,
  };

  const results: FlightOption[] = [];

  // Pick 3-4 realistic flights
  const selectedAirlines = AIRLINE_CATALOG.slice(0, 4);

  selectedAirlines.forEach((airline, index) => {
    const flightNum = `${airline.code} ${Math.floor(100 + Math.random() * 899)}`;
    const depHour = 8 + index * 4;
    const depMinute = index % 2 === 0 ? '15' : '45';
    const depTimeStr = `${departureDate}T${String(depHour).padStart(2, '0')}:${depMinute}:00Z`;

    const durationHours = 2 + (index % 3) * 2;
    const durationMinutes = 20 + index * 10;
    const arrHour = (depHour + durationHours) % 24;
    const arrTimeStr = `${departureDate}T${String(arrHour).padStart(2, '0')}:${durationMinutes}:00Z`;

    const outboundSegment: FlightSegment = {
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: flightNum,
      departureAirport: originAirport.iata,
      departureCity: originAirport.city,
      departureTime: depTimeStr,
      departureTerminal: `Terminal ${1 + (index % 3)}`,
      arrivalAirport: destAirport.iata,
      arrivalCity: destAirport.city,
      arrivalTime: arrTimeStr,
      arrivalTerminal: `Terminal ${1 + ((index + 1) % 3)}`,
      duration: `${durationHours}h ${durationMinutes}m`,
      aircraft: airline.aircraft,
      cabinClass: airline.cabin,
      stops: index === 3 ? 1 : 0,
    };

    const segments = [outboundSegment];

    if (tripType === 'round-trip' && returnDate) {
      const returnFlightNum = `${airline.code} ${Math.floor(200 + Math.random() * 799)}`;
      const returnDepTime = `${returnDate}T14:30:00Z`;
      const returnArrTime = `${returnDate}T${String(14 + durationHours)}:${durationMinutes}:00Z`;

      segments.push({
        airline: airline.name,
        airlineCode: airline.code,
        flightNumber: returnFlightNum,
        departureAirport: destAirport.iata,
        departureCity: destAirport.city,
        departureTime: returnDepTime,
        departureTerminal: `Terminal 2`,
        arrivalAirport: originAirport.iata,
        arrivalCity: originAirport.city,
        arrivalTime: returnArrTime,
        arrivalTerminal: `Terminal 1`,
        duration: `${durationHours}h ${durationMinutes}m`,
        aircraft: airline.aircraft,
        cabinClass: airline.cabin,
        stops: 0,
      });
    }

    const provider: 'Duffel' | 'Amadeus' | 'Sabre' =
      index === 0 ? 'Duffel' : index === 1 ? 'Amadeus' : index === 2 ? 'Duffel' : 'Sabre';

    const supplierCost = 5.0;
    const platformFee = Number((baseTicketPrice - supplierCost).toFixed(2));

    results.push({
      id: `FL-${airline.code}-${index + 1}`,
      provider,
      baseSupplierCost: supplierCost,
      platformFee: Math.max(0, platformFee),
      totalPrice: baseTicketPrice,
      currency: 'USD',
      validityHours: 48,
      airlineName: airline.name,
      airlineCode: airline.code,
      airlineLogoColor: airline.logoColor,
      segments,
      refundable: false,
      instantPnr: true,
      badge: index === 0 ? 'Fastest Direct' : index === 1 ? 'Best Value PNR' : undefined,
    });
  });

  return results;
}

export function generatePnrCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PNR-${pnr}`;
}

export function generateTicketStockNumber(): string {
  const prefix = Math.floor(100 + Math.random() * 899);
  const body = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}-${body}`;
}

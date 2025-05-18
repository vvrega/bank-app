'use client';

import { useEffect, useState } from 'react';

const ExchangeRates = () => {
  const [quotes, setQuotes] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        console.log('Fetching exchange rates from API route...');

        const response = await fetch('/api/exchangeRates');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        const invertedRates: Record<string, number> = {
          EUR: 1 / data.quotes.PLNEUR,
          USD: 1 / data.quotes.PLNUSD,
          GBP: 1 / data.quotes.PLNGBP,
        };

        setQuotes(invertedRates);
      } catch (err) {
        console.error('Error fetching rates:', err);
        setError(`Failed to load exchange rates: ${(err as Error).message}`);
      }
    };

    fetchRates();
  }, []);

  if (error) return <div>{error}</div>;

  if (!quotes) return <div>Loading...</div>;

  return (
    <div>
      <h2>Exchange Rates (Base: PLN)</h2>
      <ul>
        {quotes &&
          Object.entries(quotes).map(([currency, quote]) => (
            <li key={currency}>
              {currency}: {quote.toFixed(4)}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ExchangeRates;

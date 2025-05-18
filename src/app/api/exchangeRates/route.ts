import { NextResponse } from 'next/server';

let cachedData: any = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function GET() {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is missing in server environment variables.' },
      { status: 500 }
    );
  }

  const now = Date.now();
  if (cachedData && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached data...');
    return NextResponse.json(cachedData);
  }

  try {
    console.log('Fetching new data from API...');
    const response = await fetch(
      `https://api.exchangerate.host/live?access_key=${apiKey}&source=PLN&currencies=USD,EUR,GBP&format=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    cachedData = data;
    lastFetchTime = now;

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching exchange rates:', err);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates.' },
      { status: 500 }
    );
  }
}

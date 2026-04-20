export interface FinnhubQuote {
  current: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

export async function fetchFinnhubQuote(symbol: string): Promise<FinnhubQuote> {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_FINNHUB_API_KEY in environment variables')
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Finnhub API error: ${response.status} ${body}`)
  }

  const data = await response.json()
  if (typeof data.c !== 'number') {
    throw new Error('Finnhub API returned invalid quote data')
  }

  return {
    current: data.c,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: data.t
  }
}

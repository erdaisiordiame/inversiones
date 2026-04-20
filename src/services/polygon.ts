export interface PolygonQuote {
  symbol: string;
  last: number;
  bidprice?: number;
  askprice?: number;
  bidsize?: number;
  asksize?: number;
  exchange: number;
  timestamp: number;
}

interface PolygonLastTradeResponse {
  status: string;
  symbol: string;
  last: number;
  bidprice?: number;
  askprice?: number;
  bidsize?: number;
  asksize?: number;
  exchange: number;
  timestamp: number;
}

export async function fetchPolygonQuote(symbol: string): Promise<PolygonQuote> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_POLYGON_API_KEY in environment variables')
  }

  const url = `https://api.polygon.io/v1/last/stocks/${encodeURIComponent(symbol)}?apiKey=${apiKey}`
  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Polygon API error: ${response.status} ${text}`)
  }

  const data: PolygonLastTradeResponse = await response.json()
  return {
    symbol: data.symbol,
    last: data.last,
    bidprice: data.bidprice,
    askprice: data.askprice,
    bidsize: data.bidsize,
    asksize: data.asksize,
    exchange: data.exchange,
    timestamp: data.timestamp
  }
}

export async function fetchPolygonPreviousClose(symbol: string): Promise<number> {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_POLYGON_API_KEY in environment variables')
  }

  const url = `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(symbol)}/prev?adjusted=true&apiKey=${apiKey}`
  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Polygon API error: ${response.status} ${text}`)
  }

  const data = await response.json()
  if (!data.results || !data.results.length) {
    throw new Error('Polygon API returned no previous close data')
  }

  return data.results[0].c
}

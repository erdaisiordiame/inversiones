import { useState, useEffect } from 'react'
import { fetchFinnhubQuote } from '../../services/finnhub'
import type { FinnhubQuote } from '../../services/finnhub'

export function MarketDataPanel() {
  const [symbol, setSymbol] = useState('AAPL')
  const [quote, setQuote] = useState<FinnhubQuote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadQuote = async () => {
      setLoading(true)
      setError(null)
      try {
        const quoteData = await fetchFinnhubQuote(symbol)
        setQuote(quoteData)
      } catch (err) {
        setError((err as Error).message)
        setQuote(null)
      } finally {
        setLoading(false)
      }
    }

    loadQuote()
  }, [symbol])

  const changeSymbol = (value: string) => {
    setSymbol(value.trim().toUpperCase())
  }

  return (
    <section style={{ padding: '1rem', border: '1px solid #444', borderRadius: 12, marginTop: '1.5rem', backgroundColor: '#f7f8fc' }}>
      <h2>Integración Finnhub Market API</h2>
      <p>Datos de mercado en tiempo real usando Finnhub.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          value={symbol}
          onChange={(event) => changeSymbol(event.target.value)}
          placeholder="Símbolo (por ejemplo AAPL)"
          style={{ padding: '0.75rem', fontSize: '0.95rem', width: '180px' }}
        />
        <button
          onClick={() => changeSymbol(symbol)}
          style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}
        >
          Actualizar
        </button>
      </div>

      {loading && <p>Cargando cotización...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {quote && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3>{symbol}</h3>
            <p style={{ margin: '0.5rem 0' }}>Precio actual: <strong>${quote.current.toFixed(2)}</strong></p>
            <p>Apertura: ${quote.open.toFixed(2)}</p>
            <p>Máximo: ${quote.high.toFixed(2)}</p>
            <p>Mínimo: ${quote.low.toFixed(2)}</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3>Comparación</h3>
            <p>Cierre previo: ${quote.previousClose.toFixed(2)}</p>
            <p>Última actualización: {quote.timestamp ? new Date(quote.timestamp * 1000).toLocaleString() : 'N/A'}</p>
            <p>Variación: {quote.previousClose ? `${((quote.current - quote.previousClose) / quote.previousClose * 100).toFixed(2)}%` : 'N/A'}</p>
          </div>
        </div>
      )}
    </section>
  )
}

import { Provider } from 'react-redux'
import './App.css'
import { MarketDataPanel } from './features/market-data'
import { TradingCrudPage } from './features/crud'
import { store } from './store'

function App() {
  return (
    <Provider store={store}>
      <main className="app-shell">
        <header className="app-hero">
          <div>
            <h1>PWA Inversiones Drfic</h1>
            <p>Demo de plataforma de inversión con CRUD, REST API, MongoDB y panel de mercado en tiempo real.</p>
          </div>
          <div className="app-hero-badge">Fase 3/4 - CRUD RESTful</div>
        </header>

        <TradingCrudPage />
        <MarketDataPanel />
      </main>
    </Provider>
  )
}

export default App

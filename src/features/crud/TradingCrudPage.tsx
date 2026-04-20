import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  createOrder,
  deleteOrder,
  fetchOrders,
  updateOrder,
  type Order,
} from '../../store/ordersSlice'
import {
  createStrategy,
  deleteStrategy,
  fetchStrategies,
  updateStrategy,
  type Strategy,
} from '../../store/strategiesSlice'
import {
  createWatchlist,
  deleteWatchlist,
  fetchWatchlists,
  updateWatchlist,
  type Watchlist,
} from '../../store/watchlistsSlice'

const tabs = [
  { key: 'orders', label: 'Órdenes' },
  { key: 'strategies', label: 'Estrategias' },
  { key: 'watchlists', label: 'Watchlists' },
] as const

type TabKey = (typeof tabs)[number]['key']

const defaultOrderForm: Omit<Order, '_id'> = {
  symbol: 'AAPL',
  side: 'BUY',
  quantity: '1',
  order_type: 'market',
  asset_type: 'STOCK',
  status: 'pending',
}

const defaultStrategyForm: Omit<Strategy, '_id'> = {
  name: 'Estrategia demo',
  description: 'Estrategia de prueba',
  is_preset: false,
  is_active: true,
  recommended_timeframes: ['1D'],
  min_confidence_threshold: '0.55',
}

const defaultWatchlistForm: Omit<Watchlist, '_id'> = {
  name: 'Lista de seguimiento',
  description: 'Símbolos clave a monitorear',
  is_default: false,
  is_active: true,
  symbols: [{ symbol: 'AAPL', instrument_type: 'Stock', is_active: true, sort_order: 1 }],
}

function toSymbolInput(symbols: Watchlist['symbols']) {
  return symbols.map((item) => item.symbol).join(', ')
}

export function TradingCrudPage() {
  const dispatch = useAppDispatch()
  const ordersState = useAppSelector((state) => state.orders)
  const strategiesState = useAppSelector((state) => state.strategies)
  const watchlistsState = useAppSelector((state) => state.watchlists)
  const [activeTab, setActiveTab] = useState<TabKey>('orders')
  const [orderForm, setOrderForm] = useState(defaultOrderForm)
  const [strategyForm, setStrategyForm] = useState(defaultStrategyForm)
  const [watchlistForm, setWatchlistForm] = useState({
    ...defaultWatchlistForm,
    symbolsInput: toSymbolInput(defaultWatchlistForm.symbols),
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchStrategies())
    dispatch(fetchWatchlists())
  }, [dispatch])

  const activeStatus = useMemo(() => {
    if (activeTab === 'orders') return ordersState.status
    if (activeTab === 'strategies') return strategiesState.status
    return watchlistsState.status
  }, [activeTab, ordersState.status, strategiesState.status, watchlistsState.status])

  const activeError = useMemo(() => {
    if (activeTab === 'orders') return ordersState.error
    if (activeTab === 'strategies') return strategiesState.error
    return watchlistsState.error
  }, [activeTab, ordersState.error, strategiesState.error, watchlistsState.error])

  const resetForms = () => {
    setOrderForm(defaultOrderForm)
    setStrategyForm(defaultStrategyForm)
    setWatchlistForm({
      ...defaultWatchlistForm,
      symbolsInput: toSymbolInput(defaultWatchlistForm.symbols),
    })
    setEditingId(null)
  }

  const handleOrderSave = async (event: FormEvent) => {
    event.preventDefault()
    if (editingId) {
      await dispatch(updateOrder({ id: editingId, order: orderForm }))
    } else {
      await dispatch(createOrder(orderForm))
    }
    resetForms()
  }

  const handleStrategySave = async (event: FormEvent) => {
    event.preventDefault()
    const payload = {
      ...strategyForm,
      recommended_timeframes: strategyForm.recommended_timeframes,
    }
    if (editingId) {
      await dispatch(updateStrategy({ id: editingId, strategy: payload }))
    } else {
      await dispatch(createStrategy(payload))
    }
    resetForms()
  }

  const handleWatchlistSave = async (event: FormEvent) => {
    event.preventDefault()
    const symbols = watchlistForm.symbolsInput
      .split(',')
      .map((symbol) => symbol.trim())
      .filter(Boolean)
      .map((symbol, index) => ({ symbol, instrument_type: 'Stock' as const, is_active: true, sort_order: index + 1 }))

    const payload = {
      ...watchlistForm,
      symbols,
    }

    if (editingId) {
      await dispatch(updateWatchlist({ id: editingId, watchlist: payload }))
    } else {
      await dispatch(createWatchlist(payload))
    }

    resetForms()
  }

  return (
    <section className="crud-dashboard">
      <header className="crud-header">
        <div>
          <h2>CRUD Trading Dashboard</h2>
          <p>Este módulo implementa frontend + backend CRUD, tablas, pestañas y APIs.</p>
        </div>
        <div className="crud-status">
          <span>Estado: {activeStatus}</span>
          {activeError && <span className="crud-error">{activeError}</span>}
        </div>
      </header>

      <nav className="crud-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={tab.key === activeTab ? 'crud-tab active' : 'crud-tab'}
            onClick={() => {
              setActiveTab(tab.key)
              resetForms()
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'orders' && (
        <div className="crud-panel">
          <form className="crud-form" onSubmit={handleOrderSave}>
            <div className="crud-form-grid">
              <label>
                Símbolo
                <input
                  value={orderForm.symbol}
                  onChange={(event) => setOrderForm({ ...orderForm, symbol: event.target.value.toUpperCase() })}
                />
              </label>
              <label>
                Lado
                <select value={orderForm.side} onChange={(event) => setOrderForm({ ...orderForm, side: event.target.value as Order['side'] })}>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </label>
              <label>
                Cantidad
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={orderForm.quantity}
                  onChange={(event) => setOrderForm({ ...orderForm, quantity: event.target.value })}
                />
              </label>
              <label>
                Tipo
                <select value={orderForm.order_type} onChange={(event) => setOrderForm({ ...orderForm, order_type: event.target.value as Order['order_type'] })}>
                  <option value="market">market</option>
                  <option value="limit">limit</option>
                  <option value="stop">stop</option>
                  <option value="stop_limit">stop_limit</option>
                </select>
              </label>
              <label>
                Activo
                <select value={orderForm.asset_type} onChange={(event) => setOrderForm({ ...orderForm, asset_type: event.target.value as Order['asset_type'] })}>
                  <option value="STOCK">STOCK</option>
                  <option value="ETF">ETF</option>
                  <option value="CRYPTO">CRYPTO</option>
                  <option value="OPTION">OPTION</option>
                  <option value="FOREX">FOREX</option>
                </select>
              </label>
              <label>
                Estado
                <select value={orderForm.status} onChange={(event) => setOrderForm({ ...orderForm, status: event.target.value as Order['status'] })}>
                  <option value="pending">pending</option>
                  <option value="filled">filled</option>
                  <option value="cancelled">cancelled</option>
                  <option value="rejected">rejected</option>
                  <option value="partial">partial</option>
                </select>
              </label>
            </div>
            <div className="crud-form-actions">
              <button type="submit">{editingId ? 'Actualizar orden' : 'Crear orden'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForms}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="crud-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Símbolo</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Activo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordersState.items.map((order) => (
                  <tr key={order._id}>
                    <td>{order.symbol}</td>
                    <td>{order.order_type}</td>
                    <td>{order.quantity}</td>
                    <td>{order.asset_type}</td>
                    <td>{order.status}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingId(order._id ?? null)
                          setOrderForm({
                            symbol: order.symbol,
                            side: order.side,
                            quantity: order.quantity,
                            order_type: order.order_type,
                            asset_type: order.asset_type,
                            status: order.status,
                            limit_price: order.limit_price,
                            stop_price: order.stop_price,
                          })
                        }}
                      >
                        Editar
                      </button>
                      <button className="danger" onClick={() => order._id && dispatch(deleteOrder(order._id))}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'strategies' && (
        <div className="crud-panel">
          <form className="crud-form" onSubmit={handleStrategySave}>
            <div className="crud-form-grid">
              <label>
                Nombre
                <input
                  value={strategyForm.name}
                  onChange={(event) => setStrategyForm({ ...strategyForm, name: event.target.value })}
                />
              </label>
              <label>
                Descripción
                <input
                  value={strategyForm.description ?? ''}
                  onChange={(event) => setStrategyForm({ ...strategyForm, description: event.target.value })}
                />
              </label>
              <label>
                Mínimo conf.
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={strategyForm.min_confidence_threshold}
                  onChange={(event) => setStrategyForm({ ...strategyForm, min_confidence_threshold: event.target.value })}
                />
              </label>
              <label>
                Timeframes
                <input
                  value={strategyForm.recommended_timeframes.join(', ')}
                  onChange={(event) =>
                    setStrategyForm({
                      ...strategyForm,
                      recommended_timeframes: event.target.value
                        .split(',')
                        .map((value) => value.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              <label>
                Activa
                <select
                  value={strategyForm.is_active ? 'true' : 'false'}
                  onChange={(event) => setStrategyForm({ ...strategyForm, is_active: event.target.value === 'true' })}
                >
                  <option value="true">Si</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <div className="crud-form-actions">
              <button type="submit">{editingId ? 'Actualizar estrategia' : 'Crear estrategia'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForms}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="crud-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Mín. Confianza</th>
                  <th>Timeframes</th>
                  <th>Activa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {strategiesState.items.map((strategy) => (
                  <tr key={strategy._id}>
                    <td>{strategy.name}</td>
                    <td>{strategy.min_confidence_threshold}</td>
                    <td>{strategy.recommended_timeframes.join(', ')}</td>
                    <td>{strategy.is_active ? 'Sí' : 'No'}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingId(strategy._id ?? null)
                          setStrategyForm({
                            name: strategy.name,
                            description: strategy.description,
                            is_preset: strategy.is_preset ?? false,
                            is_active: strategy.is_active ?? true,
                            recommended_timeframes: strategy.recommended_timeframes || [],
                            min_confidence_threshold: strategy.min_confidence_threshold,
                          })
                        }}
                      >
                        Editar
                      </button>
                      <button className="danger" onClick={() => strategy._id && dispatch(deleteStrategy(strategy._id))}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'watchlists' && (
        <div className="crud-panel">
          <form className="crud-form" onSubmit={handleWatchlistSave}>
            <div className="crud-form-grid">
              <label>
                Nombre
                <input
                  value={watchlistForm.name}
                  onChange={(event) => setWatchlistForm({ ...watchlistForm, name: event.target.value })}
                />
              </label>
              <label>
                Descripción
                <input
                  value={watchlistForm.description ?? ''}
                  onChange={(event) => setWatchlistForm({ ...watchlistForm, description: event.target.value })}
                />
              </label>
              <label>
                Símbolos
                <input
                  value={watchlistForm.symbolsInput}
                  onChange={(event) => setWatchlistForm({ ...watchlistForm, symbolsInput: event.target.value })}
                  placeholder="AAPL, MSFT, GOOGL"
                />
              </label>
              <label>
                Predeterminada
                <select
                  value={watchlistForm.is_default ? 'true' : 'false'}
                  onChange={(event) => setWatchlistForm({ ...watchlistForm, is_default: event.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </label>
              <label>
                Activa
                <select
                  value={watchlistForm.is_active ? 'true' : 'false'}
                  onChange={(event) => setWatchlistForm({ ...watchlistForm, is_active: event.target.value === 'true' })}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <div className="crud-form-actions">
              <button type="submit">{editingId ? 'Actualizar watchlist' : 'Crear watchlist'}</button>
              {editingId && (
                <button type="button" className="secondary" onClick={resetForms}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="crud-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Símbolos</th>
                  <th>Predeterminada</th>
                  <th>Activa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {watchlistsState.items.map((watchlist) => (
                  <tr key={watchlist._id}>
                    <td>{watchlist.name}</td>
                    <td>{watchlist.symbols.map((symbol) => symbol.symbol).join(', ')}</td>
                    <td>{watchlist.is_default ? 'Sí' : 'No'}</td>
                    <td>{watchlist.is_active ? 'Sí' : 'No'}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingId(watchlist._id ?? null)
                          setWatchlistForm({
                            ...watchlist,
                            symbolsInput: toSymbolInput(watchlist.symbols),
                          })
                        }}
                      >
                        Editar
                      </button>
                      <button className="danger" onClick={() => watchlist._id && dispatch(deleteWatchlist(watchlist._id))}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

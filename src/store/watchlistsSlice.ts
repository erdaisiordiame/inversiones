import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface WatchlistSymbol {
  symbol: string
  instrument_type: 'Stock' | 'ETF' | 'Index' | 'Option'
  is_active?: boolean
  sort_order?: number
}

export interface Watchlist {
  _id?: string
  user_id?: string
  name: string
  description?: string
  is_default?: boolean
  is_active?: boolean
  symbols: WatchlistSymbol[]
  created_at?: string
  updated_at?: string
}

type WatchlistState = {
  items: Watchlist[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: WatchlistState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchWatchlists = createAsyncThunk('watchlists/fetch', async () => {
  const response = await fetch('/api/watchlists')
  if (!response.ok) throw new Error('Failed to load watchlists')
  return (await response.json()) as Watchlist[]
})

export const createWatchlist = createAsyncThunk('watchlists/create', async (watchlist: Omit<Watchlist, '_id'>) => {
  const response = await fetch('/api/watchlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(watchlist),
  })
  if (!response.ok) throw new Error('Failed to create watchlist')
  return (await response.json()) as Watchlist
})

export const updateWatchlist = createAsyncThunk(
  'watchlists/update',
  async ({ id, watchlist }: { id: string; watchlist: Partial<Watchlist> }) => {
    const response = await fetch(`/api/watchlists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchlist),
    })
    if (!response.ok) throw new Error('Failed to update watchlist')
    return (await response.json()) as Watchlist
  },
)

export const deleteWatchlist = createAsyncThunk('watchlists/delete', async (id: string) => {
  const response = await fetch(`/api/watchlists/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete watchlist')
  return id
})

const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlists.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchWatchlists.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
      })
      .addCase(fetchWatchlists.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Error cargando watchlists'
      })
      .addCase(createWatchlist.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateWatchlist.fulfilled, (state, action) => {
        state.items = state.items.map((watchlist) => (watchlist._id === action.payload._id ? action.payload : watchlist))
      })
      .addCase(deleteWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter((watchlist) => watchlist._id !== action.payload)
      })
  },
})

export default watchlistsSlice.reducer

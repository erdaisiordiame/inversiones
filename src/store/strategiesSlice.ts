import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Strategy {
  _id?: string
  user_id?: string
  name: string
  description?: string
  is_preset?: boolean
  is_active?: boolean
  recommended_timeframes: string[]
  min_confidence_threshold: string
  created_at?: string
  updated_at?: string
}

type StrategyState = {
  items: Strategy[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: StrategyState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchStrategies = createAsyncThunk('strategies/fetch', async () => {
  const response = await fetch('/api/strategies')
  if (!response.ok) throw new Error('Failed to load strategies')
  return (await response.json()) as Strategy[]
})

export const createStrategy = createAsyncThunk('strategies/create', async (strategy: Omit<Strategy, '_id'>) => {
  const response = await fetch('/api/strategies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
  if (!response.ok) throw new Error('Failed to create strategy')
  return (await response.json()) as Strategy
})

export const updateStrategy = createAsyncThunk(
  'strategies/update',
  async ({ id, strategy }: { id: string; strategy: Partial<Strategy> }) => {
    const response = await fetch(`/api/strategies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strategy),
    })
    if (!response.ok) throw new Error('Failed to update strategy')
    return (await response.json()) as Strategy
  },
)

export const deleteStrategy = createAsyncThunk('strategies/delete', async (id: string) => {
  const response = await fetch(`/api/strategies/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete strategy')
  return id
})

const strategiesSlice = createSlice({
  name: 'strategies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStrategies.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Error cargando estrategias'
      })
      .addCase(createStrategy.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateStrategy.fulfilled, (state, action) => {
        state.items = state.items.map((strategy) => (strategy._id === action.payload._id ? action.payload : strategy))
      })
      .addCase(deleteStrategy.fulfilled, (state, action) => {
        state.items = state.items.filter((strategy) => strategy._id !== action.payload)
      })
  },
})

export default strategiesSlice.reducer

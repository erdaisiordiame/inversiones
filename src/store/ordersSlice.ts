import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Order {
  _id?: string
  user_id?: string
  symbol: string
  side: 'BUY' | 'SELL'
  quantity: string
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit'
  asset_type: 'STOCK' | 'OPTION' | 'ETF' | 'CRYPTO' | 'FOREX'
  status: 'pending' | 'filled' | 'cancelled' | 'rejected' | 'partial'
  limit_price?: string
  stop_price?: string
  created_at?: string
  updated_at?: string
}

type OrderState = {
  items: Order[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: OrderState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const response = await fetch('/api/orders')
  if (!response.ok) throw new Error('Failed to load orders')
  return (await response.json()) as Order[]
})

export const createOrder = createAsyncThunk('orders/create', async (order: Omit<Order, '_id'>) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  if (!response.ok) throw new Error('Failed to create order')
  return (await response.json()) as Order
})

export const updateOrder = createAsyncThunk(
  'orders/update',
  async ({ id, order }: { id: string; order: Partial<Order> }) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    if (!response.ok) throw new Error('Failed to update order')
    return (await response.json()) as Order
  },
)

export const deleteOrder = createAsyncThunk('orders/delete', async (id: string) => {
  const response = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete order')
  return id
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Error cargando órdenes'
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.items = state.items.map((order) => (order._id === action.payload._id ? action.payload : order))
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((order) => order._id !== action.payload)
      })
  },
})

export default ordersSlice.reducer

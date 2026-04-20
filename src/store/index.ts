import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './ordersSlice'
import strategiesReducer from './strategiesSlice'
import watchlistsReducer from './watchlistsSlice'

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    strategies: strategiesReducer,
    watchlists: watchlistsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

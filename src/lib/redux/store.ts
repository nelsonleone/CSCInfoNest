import { configureStore } from '@reduxjs/toolkit'
import mobileNavReducer from "./slices/mobileNavSlice"


export const makeStore = () => {
  return configureStore({
    reducer: {
      mobileNav: mobileNavReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']
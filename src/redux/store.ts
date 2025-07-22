import {configureStore} from '@reduxjs/toolkit'
import { carApi } from './services/car/car'

export const makeStore = () =>{
    return configureStore({
        reducer:{
           [carApi.reducerPath]:carApi.reducer

        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(carApi.middleware),
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
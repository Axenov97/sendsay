import {configureStore} from '@reduxjs/toolkit'
import draggableReducer from './draggableSlice'
import modeReducer from './modeSlice'
import calculateReducer from './calculateSlice'

const store = configureStore({
    reducer: {
        //подключение редьюсерОВ
        draggable: draggableReducer,
        mode: modeReducer,
        calculate: calculateReducer,
    }
})

export default  store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof  store.dispatch;
import {createSlice} from '@reduxjs/toolkit'

type ModeState = {isRuntime: boolean}

const initialState: ModeState = {isRuntime : false}

const modeSlice = createSlice({
    name: 'mode',     //имя среза
    initialState,
    reducers: {
        //редьюсеры (набор методов)
        setIsRuntime(state, action) {state.isRuntime = action.payload},
    },
})

export const {setIsRuntime} = modeSlice.actions;
export default modeSlice.reducer;
import {createSlice} from '@reduxjs/toolkit'

type CalculateState = {
    displayValue: string,
    leftValue: number | null,
    rightValue: number | null,
    operator: string,
    isLeft: boolean,
}

const initialState: CalculateState = {
    displayValue: '0',
    leftValue: null,
    rightValue: null,
    operator: '',
    isLeft: true
}

const calculateSlice = createSlice({
    name: 'calculate',
    initialState,

    reducers: {
        aroundDisplayValue(state, action) {state.displayValue = action.payload},

        clear(state) {
            state.displayValue = '0'
            state.leftValue = null
            state.rightValue = null
            state.operator = ''
            state.isLeft = true
        },

        setLeftValue(state, action) {
            state.leftValue === null && (state.leftValue = 0)
            if (state.leftValue === 0 && action.payload !== ',') {
                state.displayValue = action.payload
                state.leftValue = +action.payload
            } else if ((action.payload === ',' && state.leftValue === 0)) {
                state.displayValue = '0' + action.payload
                state.leftValue = 0 + (action.payload === ',' ? '.' : action.payload)
            } else {
                state.displayValue = state.displayValue + action.payload
                state.leftValue = state.leftValue + (action.payload === ',' ? '.' : action.payload)
            }
        },

        setRightValue(state, action) {
            state.rightValue === null && (state.rightValue = 0)
            if (state.rightValue === 0 && action.payload !== ',') {
                state.displayValue = action.payload
                state.rightValue = +action.payload
            } else if ((action.payload === ',' && state.rightValue === 0)) {
                state.displayValue = '0' + action.payload
                state.rightValue = 0 + (action.payload === ',' ? '.' : action.payload)
            } else {
                state.displayValue = state.displayValue + action.payload
                state.rightValue = state.rightValue + (action.payload === ',' ? '.' : action.payload)
            }
        },

        setOperator(state, action) {
            if (+state.displayValue.split(',').join('.') !== 0 && state.leftValue === null) {
                state.leftValue = +state.displayValue.split(',').join('.')
                state.isLeft = false
            }

            state.leftValue === null && (state.leftValue = 0)

            if (!state.isLeft) {
                if (state.rightValue !== null) {
                    switch (state.operator) {
                        case '+' : state.leftValue = +state.leftValue + +state.rightValue
                            break;
                        case '-' : state.leftValue = +state.leftValue - +state.rightValue
                            break;
                        case '/' : state.leftValue = +state.leftValue / +state.rightValue
                            break;
                        case 'x' : state.leftValue = +state.leftValue * +state.rightValue
                            break;
                    }
                    state.rightValue = null
                    state.displayValue = state.leftValue.toString().split('.').join(',')
                }
            }

            if (action.payload === '=') {
                state.operator = ''
                state.leftValue = null
                state.isLeft = true
            } else {
                state.operator = action.payload
                state.isLeft = false
            }
        },

    },
})

export const {setOperator, setLeftValue, setRightValue, clear, aroundDisplayValue} = calculateSlice.actions;
export default calculateSlice.reducer;
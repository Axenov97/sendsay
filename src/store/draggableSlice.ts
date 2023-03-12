import {createSlice} from '@reduxjs/toolkit'

type DraggableState = {
    paletteList:  {id: number, type: string, buttonNames: string[], draggable: boolean}[],
    canvasList:  {id?: number, type?: string, buttonNames?: string[], draggable?: boolean}[],
    currentElement: {id?: number, type?: string, buttonNames?: string[], draggable?: boolean},
    onOverElement: string,
    panelFromDrag: string,
    firstElementEvent: any
}

const initialState: DraggableState = {
    paletteList: [
        {id: 1, type: 'display', buttonNames: [], draggable : true},
        {id: 2, type: 'computing', buttonNames: ['/', 'x', '-', '+'], draggable : true},
        {id: 3, type: 'numpad', buttonNames: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', ','], draggable : true},
        {id: 4, type: 'equals', buttonNames: ['='], draggable : true}
    ],
    canvasList: [],
    currentElement: {},
    onOverElement: '',
    panelFromDrag: '',
    firstElementEvent: null
}

const draggableSlice = createSlice({
    name: 'draggable',
    initialState,
    reducers: {
        setCurrentElement(state, action) {state.currentElement = action.payload},
        setOnOverElement(state, action) {state.onOverElement = action.payload},
        setPanelFromDrag(state, action) {state.panelFromDrag = action.payload},

        transferElement(state, action) {
            if (state.panelFromDrag === 'palette') {
                state.paletteList.forEach(itemOnPalette => {
                    if (itemOnPalette.type === state.currentElement.type) {
                        if (state.currentElement.type === 'display') {
                            state.canvasList.unshift(Object.assign({}, itemOnPalette))
                            state.canvasList[0].draggable = false
                        } else if (state.onOverElement === ''){
                            state.canvasList.splice(state.canvasList.length, 0, Object.assign({}, itemOnPalette))
                        } else {
                            state.canvasList.splice(action.payload.index + 1, 0 , Object.assign({}, itemOnPalette))
                        }
                        itemOnPalette.draggable = false
                    }
                })
            } else if (state.panelFromDrag === 'canvas') {
                state.canvasList.forEach(itemOnCanvas => {
                    if (itemOnCanvas.type === state.currentElement.type) {
                        if (state.onOverElement === '') {
                            state.canvasList.splice(state.canvasList.indexOf(state.canvasList
                                .find(item => item.type === state.currentElement.type)!), 1)

                            state.canvasList.splice(state.canvasList.length, 0, Object.assign({}, itemOnCanvas))
                        } else if (state.onOverElement !== state.currentElement.type){
                            state.canvasList.splice(state.canvasList.indexOf(state.canvasList
                                .find(item => item.type === state.currentElement.type)!), 1)

                            state.canvasList.splice(action.payload.index + 1, 0 , Object.assign({}, itemOnCanvas))
                        }
                    }
                })
            }
        },

        removeElement(state, action) {
            if (action.payload.panel === 'canvas') {
                state.canvasList.forEach(itemOnCanvas => {
                    if (itemOnCanvas.type === action.payload.type) {
                        state.canvasList.splice(state.canvasList.indexOf(itemOnCanvas), 1)
                    }
                    state.paletteList.forEach(itemOnPalette => itemOnPalette.type === action.payload.type && (itemOnPalette.draggable = true))
                })
            }
        }

    },
})

export const {setCurrentElement, setOnOverElement, setPanelFromDrag, transferElement, removeElement} = draggableSlice.actions;
export default draggableSlice.reducer;
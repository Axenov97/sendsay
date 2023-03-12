import React, {RefObject} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks";
import {removeElement, setCurrentElement, setOnOverElement, setPanelFromDrag} from '../store/draggableSlice';
import {setLeftValue, setRightValue, setOperator} from '../store/calculateSlice';

interface IDraggable {
    draggableComponent: {id?: number, type?: string, buttonNames?: string[], draggable?: boolean},
    panelName: string,
    canvasRef?: RefObject<HTMLDivElement>,
    displayRef?: React.RefObject<HTMLParagraphElement>,
    lastElementRef?: RefObject<HTMLDivElement>,
}

const DraggableComponent = ({draggableComponent, panelName, canvasRef, displayRef, lastElementRef} : IDraggable) => {
    const dispatch = useAppDispatch()
    const isRuntime = useAppSelector(state => state.mode.isRuntime)
    const currentElement = useAppSelector(state => state.draggable.currentElement)
    const canvasList = useAppSelector(state => state.draggable.canvasList)
    const leftValue = useAppSelector(state => state.calculate.leftValue)
    const rightValue = useAppSelector(state => state.calculate.rightValue)
    const displayValue = useAppSelector(state => state.calculate.displayValue)
    const isLeft = useAppSelector(state => state.calculate.isLeft)

    const dragStartHandler = (e: React.DragEvent<HTMLDivElement>, element: {}) => {
        dispatch(setCurrentElement(element))
        dispatch(setPanelFromDrag(panelName))
    }

    const dragEndHandler = () => dispatch(setCurrentElement({}))

    const dragOverHandler = (e: React.DragEvent<HTMLDivElement>, typeOnOverItem: string) => {
        e.preventDefault()
        dispatch(setOnOverElement(typeOnOverItem))
        if (currentElement.type === 'display' && canvasList.length) {
            canvasRef?.current?.classList.add('over__for-display')
        } else {
            e.currentTarget.classList.add('over')
        }
    }

    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        dispatch(setOnOverElement(''))
        e.currentTarget.classList.remove('over')
        canvasRef?.current?.classList?.remove('over__for-display')
    }

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => e.currentTarget.classList.remove('over')

    const calculation = (button: string, buttonType: string) => {
        if (buttonType === 'computing' || buttonType === 'equals') {
            Number.isFinite(+displayValue.split(',').join('.')) && dispatch(setOperator(button))
        } else {
            if (isLeft && (leftValue!?.toString().length <= 12 || typeof leftValue?.toString().length === "undefined")) {
                dispatch(setLeftValue(button))
            } else if (!isLeft && (rightValue!?.toString().length <= 12 || typeof rightValue?.toString().length === "undefined")){
                dispatch(setRightValue(button))
            }
        }
    }

    return (
        <div
            className={ draggableComponent.draggable ? 'draggable-item' : 'draggable-item opacity' }
            ref={lastElementRef}
            draggable={!isRuntime && draggableComponent.draggable}
            onDragStart={(e) => dragStartHandler(e, draggableComponent)}
            onDragEnd={() => dragEndHandler()}
            onDragOver={(e) => dragOverHandler(e, draggableComponent.type!)}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDrop={(e) => dropHandler(e)}
            onDoubleClick={() => !isRuntime && dispatch(removeElement({panel: panelName, type: draggableComponent.type}))}
        >
            {
                draggableComponent.buttonNames!.map((button, id) =>
                    <div
                        key={id}
                        className={`draggable-item__button ${draggableComponent.type}`}
                        onClick={() => isRuntime && calculation(button, draggableComponent.type!)}
                    >
                        <p>{button}</p>
                    </div>)
            }

            {
                draggableComponent.type === 'display' ?
                <div className="draggable-item__display">
                    <p ref={displayRef}>
                        {/*{displayValue}*/}
                        {!Number.isFinite(+displayValue.split(',').join('.')) ? 'Не определено' : displayValue }
                    </p>
                </div> : null
            }
        </div>
    )
};

export default DraggableComponent;
import React, {useEffect, useRef} from 'react';
import DraggableComponent from "./DraggableComponent";
import {useAppDispatch, useAppSelector} from "../hooks";
import {transferElement} from '../store/draggableSlice';
import {aroundDisplayValue} from '../store/calculateSlice';
import image from './../assets/drag.svg'

interface IPanel {panelName: string}

const Panel = ({panelName}: IPanel) => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const displayRef = useRef<HTMLParagraphElement>(null)
    const lastElementRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const isRuntime = useAppSelector(state => state.mode.isRuntime);
    const currentElement = useAppSelector(state => state.draggable.currentElement);
    const canvasList = useAppSelector(state => state.draggable.canvasList);
    const paletteList = useAppSelector(state => state.draggable.paletteList);
    const onOverElement = useAppSelector(state => state.draggable.onOverElement);
    const displayValue = useAppSelector(state => state.calculate.displayValue);

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (panelName === 'canvas' && !canvasList.length) {
            (canvasRef.current!.style.backgroundColor = '#F0F9FF')
        }

        if (currentElement.type === 'display' && canvasList.length) {
            canvasRef.current!.classList.add('over__for-display')
        } else if (panelName === 'canvas' && onOverElement === '') {
            lastElementRef?.current?.classList.add('over__on-panel')
        } else {
            lastElementRef?.current?.classList.remove('over__on-panel')
        }
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, panel: string, currentItem: {}) {
        e.preventDefault()
        if (panel === 'canvas' && !isRuntime) {
            dispatch(transferElement({
                index: canvasList.indexOf(canvasList.find(item => item.type === onOverElement)!),
                currentItem: currentItem
            }))
            canvasRef.current!.style.backgroundColor = 'transparent'
            canvasRef.current!.classList.remove('over__for-display')
            lastElementRef?.current?.classList.remove('over__on-panel')
        }
    }

    function dragLeaveHandler() {
        canvasRef.current!.style.backgroundColor = 'transparent'
        canvasRef.current!.classList.remove('over__for-display')
        lastElementRef?.current?.classList.remove('over__on-panel')

    }

    useEffect(() => {
        canvasList.length ? canvasRef.current!.classList.add('is-length') : canvasRef.current!.classList.remove('is-length')
        isRuntime ? canvasRef.current!.classList.add('runtime') : canvasRef.current!.classList.remove('runtime')

        if (displayValue.length >= 12 || displayValue === 'Infinity') {
            dispatch(aroundDisplayValue( Number(displayValue.split(',').join('.'))
                .toPrecision(2).toString().split('.').join(',')))
            displayRef.current!?.classList.add('medium__text-size')
            displayRef.current!?.classList.remove('big__text-size')
        } else if (displayValue.length > 7 && displayValue.length < 12) {
            displayRef.current!?.classList.add('big__text-size')
            displayRef.current!?.classList.remove('medium__text-size')
        } else {
            displayRef.current!?.classList.remove('medium__text-size')
            displayRef.current!?.classList.remove('big__text-size')
        }


    }, [canvasList, isRuntime, displayValue])

    return (
        <div
            className={panelName}
            ref={canvasRef}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropHandler(e, panelName, currentElement)}
            onDragLeave={() => dragLeaveHandler()}
        >
            {
                (panelName === 'canvas') ?
                    canvasList.map((item, index) => {
                        if (index === canvasList.length - 1) {
                            return <DraggableComponent
                                key={item.id}
                                draggableComponent={item}
                                panelName={panelName}
                                canvasRef={canvasRef}
                                lastElementRef={lastElementRef}
                                displayRef={displayRef}
                            />
                        } else {
                            return <DraggableComponent
                                key={item.id}
                                draggableComponent={item}
                                panelName={panelName}
                                canvasRef={canvasRef}
                                displayRef={displayRef}
                            />
                        }

                    })
                    : paletteList.map(item => {
                        return <DraggableComponent
                            key={item.id}
                            draggableComponent={item}
                            panelName={panelName}
                        />
                    })
            }

            {
                panelName === 'canvas' ?
                    <div className={!canvasList.length ? 'canvas__description canvas__description_visible' : 'canvas__description'}>
                        <img src={image} alt="drag and drop"/>
                        <h3>Перетащите сюда</h3>
                        <p>любой элемент из левой панели</p>
                    </div> : null
            }

        </div>
    )
};

export default Panel;